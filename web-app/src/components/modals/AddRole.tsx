'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { X, Shield, Check, Database } from 'lucide-react';
import axios from 'axios';
import { Table } from '@/types/Schema';
import { getPrivDescription } from '@/utils/getInfo';
import { TablePrivileges } from '@/types/RolesData';
import api from '@/config/api';

interface AddRoleProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const AddRole = ({ isOpen, onClose, onSuccess }: AddRoleProps) => {
    const [roleName, setRoleName] = useState('');
    const [selectedPrivileges, setSelectedPrivileges] = useState<string[]>([]);
    const [selectedTable, setSelectedTable] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [privileges, setPrivileges] = useState<string[]>([]);
    const [tables, setTables] = useState<string[]>([]);

    const [data, setData] = useState<TablePrivileges[]>([]);

    useEffect(() => {
        const fetchPrivileges = async () => {
            try {
                const response = await api.get('/privileges');
                setPrivileges(response.data);
            } catch (error) {
                console.error('Failed to fetch privileges:', error);
                setIsLoading(false);
            }
        }
        const fetchTables = async () => {
            try {
                const response = await api.get('/tables');
                setTables(response.data);
                const newData = (response.data.map((table: string) => {
                    return {
                        name: table,
                        privileges: []
                    }
                }));

                setData(newData);
                setSelectedTable([newData[0].name]);
                setIsLoading(false);
            } catch (error) {
                console.error('Failed to fetch tables:', error);
                setIsLoading(false);
            }
        }
        fetchPrivileges();
        fetchTables();
    }, [isOpen]);

    const clearData = () => {
        setData(data.map((item) => {
            return {
                name: item.name,
                privileges: []
            }
        }));
        setSelectedPrivileges([]);
        setSelectedTable([]);
        setRoleName('');
        setIsSubmitting(false);
    }

    const handlePrivilegeToggle = (privilegeId: string) => {
        setSelectedPrivileges(prev =>
            prev.includes(privilegeId)
                ? prev.filter(id => id !== privilegeId)
                : [...prev, privilegeId]
        );

        const newData = data.map((item) => {
            if (item.name === selectedTable[0] && privilegeId !== '') {
                if (item.privileges.includes(privilegeId)) {
                    item.privileges = item.privileges.filter(id => id !== privilegeId);
                } else {
                    setSelectedPrivileges([...selectedPrivileges, privilegeId]);
                    item.privileges.push(privilegeId);
                }
                return item;
            }
            return item;
        });
        console.log(newData);
        setData(newData);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!roleName.trim()) return;

        try {
            await axios.post('/api/roles', { role: roleName.trim(), tableAndPrivileges: data });
            setIsSubmitting(true);
            clearData();
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to add role:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="bg-black border border-slate-700 rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto  scrollbar-hide">
                                {/* Header */}
                                <div className="flex items-center justify-between p-6 border-b border-slate-700">
                                    <Dialog.Title className="text-xl font-bold text-white">
                                        Create New Role
                                    </Dialog.Title>
                                    <button
                                        onClick={() => {
                                            clearData();
                                            onClose();
                                        }}
                                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="p-6 space-y-8">
                                    {/* Role Name Field */}
                                    <div className="space-y-4">
                                        <label htmlFor="roleName" className="block text-sm font-medium text-slate-300">
                                            Role Name
                                        </label>
                                        <div className="relative">
                                            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                            <input
                                                id="roleName"
                                                type="text"
                                                value={roleName}
                                                onChange={(e) => setRoleName(e.target.value)}
                                                placeholder="Enter role name"
                                                className="w-full pl-10 pr-4 py-3 bg-black border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-colors"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className='flex flex-col lg:flex-row gap-4 items-start justify-between '>

                                        {/* Tables Section */}
                                        <div className="space-y-4 w-full lg:w-1/2">
                                            <h3 className="text-lg font-semibold text-white">Table Access</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {tables.map((table) => {
                                                    const isSelected = selectedTable.includes(table);
                                                    return (
                                                        <div
                                                            key={table}
                                                            onClick={() => {
                                                                setSelectedPrivileges(data.find((item) => item.name === table)?.privileges || []);
                                                                setSelectedTable([table]);
                                                            }}
                                                            className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${isSelected
                                                                ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
                                                                : 'bg-black border-slate-600 text-slate-400 hover:border-slate-500'
                                                                }`}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <h4 className="font-medium text-sm">{table}</h4>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        {/* Privileges Section */}
                                        <div className="space-y-4 w-full lg:w-1/2">
                                            <h3 className="text-lg font-semibold text-white">Privileges</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {privileges.map((privilege) => {
                                                    const isSelected = selectedPrivileges.includes(privilege);
                                                    return (
                                                        <div
                                                            key={privilege}
                                                            onClick={() => handlePrivilegeToggle(privilege)}
                                                            className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${isSelected
                                                                ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
                                                                : 'bg-black border-slate-600 text-slate-400 hover:border-slate-500'
                                                                }`}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <h4 className="font-medium text-sm">{privilege}</h4>
                                                                    <p className="text-xs mt-1 opacity-75">{getPrivDescription(privilege)}</p>
                                                                </div>
                                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected
                                                                    ? 'bg-sky-500/50 border-sky-500/50'
                                                                    : 'border-slate-500'
                                                                    }`}>
                                                                    {isSelected && <Check className="w-3 h-3 text-white" />}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    {/* Summary */}
                                    <div className='space-y-4'>
                                        <div className='flex items-center justify-between'>
                                            <h3 className='text-lg font-semibold text-white'>Summary</h3>
                                        </div>
                                        <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                                            {data.map((tableData) => (
                                                <div key={tableData.name} className='p-4 rounded-lg border border-slate-700 bg-black'>
                                                    <h4 className='text-sm font-bold text-white mb-2'>{tableData.name}</h4>
                                                    <div className='flex flex-wrap gap-2'>
                                                        {tableData.privileges.length > 0 ? (
                                                            tableData.privileges.map((priv) => (
                                                                <span key={priv} className='px-2 py-1 text-xs rounded-md bg-sky-500/20 text-sky-300 border border-sky-500/30'>
                                                                    {priv}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className='text-sm text-slate-400'>None</span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>



                                    {/* Actions */}
                                    <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-700">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                clearData();
                                                onClose();
                                            }}
                                            className="px-4 py-2 text-slate-400 hover:text-white border border-slate-600 hover:border-slate-500 rounded-lg transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || !roleName.trim()}
                                            className="px-6 py-2 bg-sky-500/20 border border-sky-500/30 text-white rounded-lg font-medium transition-all duration-200 hover:bg-sky-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    <span>Creating...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Database className="w-4 h-4" />
                                                    <span>Create Role</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};
