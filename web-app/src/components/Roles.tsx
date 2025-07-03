'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Check, Save, View, Eye } from 'lucide-react';
import { AddRole } from './modals/AddRole';
import axios from 'axios';
import { EditRole } from './modals/EditRole';
import DeleteConfirm from './modals/DeleteConfirm';
import { RolesData, TablePrivileges } from '@/app/types/RolesData';
import { getPrivDescription } from '@/app/utils/getInfo';
import EditTable from './EditTable';
import EditPrivileges from './EditPrivileges';

export default function RolesManagement() {
    const [refresh, setRefresh] = useState(false);
    const [roles, setRoles] = useState<RolesData[]>([]);
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [selectedTable, setSelectedTable] = useState<TablePrivileges | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [allTables, setAllTables] = useState<string[]>([]);
    const [allPrivileges, setAllPrivileges] = useState<string[]>([]);

    const [isEditTable, setIsEditTable] = useState(false);
    const [isEditPrivileges, setIsEditPrivileges] = useState(false);

    const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
    const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
    const [isDeleteRoleModalOpen, setIsDeleteRoleModalOpen] = useState(false);

    const handleEditRole = async (newName: string) => {
        console.log(newName);
    };
    const handleDeleteRole = async () => {
        console.log('delete role');
    };

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const response = await axios.get('/api/tables');
                setAllTables(response.data);
            } catch (error) {
                console.error('Failed to fetch tables:', error);
            }
        };
        const fetchPrivileges = async () => {
            try {
                const response = await axios.get('/api/privileges');
                setAllPrivileges(response.data);
            } catch (error) {
                console.error('Failed to fetch privileges:', error);
            }
        };
        fetchTables();
        fetchPrivileges();

        const fetchRoles = async () => {
            try {
                const response = await axios.get('/api/roles');
                setRoles(response.data);
                setSelectedRole(response.data[0].role);
                setSelectedTable(response.data[0].tables[0]);
            } catch (error) {
                console.error('Failed to fetch roles:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRoles();
    }, [refresh]);

    // const currentRole = roles.find(role => role.id === selectedRole);



    if (isLoading) {
        return (
            <div className="space-y-6">
                {/* Header Skeleton */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="h-8 w-48 bg-slate-700 rounded"></div>
                        <div className="h-5 w-64 bg-slate-700/50 rounded mt-1"></div>
                    </div>
                    <div className="h-12 w-36 bg-slate-700 rounded-lg"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Roles List Skeleton */}
                    <div className="lg:col-span-1">
                        <div className="bg-black border border-slate-700 rounded-xl">
                            <div className="p-6 border-b border-slate-700">
                                <div className="h-7 w-24 bg-slate-700 rounded"></div>
                            </div>
                            <div className="p-4 space-y-2">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="w-full p-4 rounded-lg border border-slate-700">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-2">
                                                <div className="h-5 w-32 bg-slate-700 rounded"></div>
                                                <div className="h-4 w-24 bg-slate-700/50 rounded"></div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="h-8 w-8 bg-slate-700 rounded"></div>
                                                <div className="h-8 w-8 bg-slate-700 rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Tables Skeleton */}
                    <div className="bg-black border border-slate-700 rounded-xl">
                        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                            <div className="h-7 w-24 bg-slate-700 rounded"></div>
                            <div className="h-5 w-5 bg-slate-700 rounded"></div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="p-4 rounded-lg border border-slate-600">
                                        <div className="h-5 w-28 bg-slate-700 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Permissions Skeleton */}
                    <div className="lg:col-span-2">
                        <div className="space-y-6">
                            <div className="bg-black border border-slate-700 rounded-xl">
                                <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                                    <div className="h-7 w-32 bg-slate-700 rounded"></div>
                                    <div className="h-5 w-5 bg-slate-700 rounded"></div>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[...Array(6)].map((_, i) => (
                                            <div key={i} className="p-4 rounded-lg border border-slate-600">
                                                <div className="space-y-2">
                                                    <div className="h-5 w-24 bg-slate-700 rounded"></div>
                                                    <div className="h-4 w-36 bg-slate-700/50 rounded"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end">
                                <div className="h-12 w-28 bg-slate-700 rounded-lg"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Roles & Privileges</h1>
                    <p className="text-slate-400 mt-1">Manage user roles and access permissions</p>
                </div>
                <button onClick={() => setIsAddRoleModalOpen(true)} className="bg-sky-500/20  border border-sky-500/30 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2">
                    <Plus className="w-5 h-5" />
                    <span>Create Role</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Roles List */}
                <div className="lg:col-span-1">
                    <div className="bg-black border border-slate-700 rounded-xl">
                        <div className="p-6 border-b border-slate-700">
                            <h2 className="text-xl font-bold text-white">Roles</h2>
                        </div>
                        <div className="p-4 space-y-2">
                            {roles.map((role) => (
                                <button
                                    key={role.role}
                                    onClick={() => setSelectedRole(role.role)}
                                    className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${selectedRole === role.role
                                        ? 'bg-sky-500/20  border border-sky-500/30 text-white'
                                        : 'text-slate-300 hover:bg-black border border-slate-700 hover:border-slate-600 hover:text-white'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center justify-between gap-2">
                                                <h3 className="font-semibold">{role.role}</h3>
                                                <button className="p-1 hover:bg-white/10 rounded transition-colors" onClick={() => setIsEditRoleModalOpen(true)}>
                                                    <Edit className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <p className={`text-sm mt-1 ${selectedRole === role.role ? 'text-sky-200' : 'text-slate-400'
                                                }`}>
                                                {role.tables.length} tables
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">

                                            <button className="p-1 hover:bg-white/10 rounded transition-colors" onClick={() => setIsDeleteRoleModalOpen(true)}>
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-black border border-slate-700 rounded-xl">
                    <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white">Tables</h3>
                        <button className={`text-white ${isEditPrivileges ? 'cursor-not-allowed opacity-50' : ''}`} disabled={isEditPrivileges} onClick={() => setIsEditTable(!isEditTable)}>
                            {
                                isEditTable ? (<Eye className="w-5 h-5" />) : (<Edit className="w-5 h-5" />)
                            }
                        </button>
                    </div>
                    {
                        isEditTable ? (<EditTable
                            allTables={allTables.map(t => ({ name: t, privileges: [] }))}
                            accessibleTables={roles.find(role => role.role === selectedRole)?.tables.map(t => ({ name: t.name, privileges: t.privileges })) || []}
                            selectedRole={selectedRole}
                            onSave={() => setIsEditTable(false)}
                        />)
                            :
                            (
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {allTables.map((table) => {
                                            const tableWithAccess = roles.find(role => role.role === selectedRole)?.tables.find(t => t.name === table);
                                            return (
                                                <div
                                                    key={table}
                                                    onClick={() => {
                                                        if (tableWithAccess) {
                                                            setSelectedTable({ name: table, privileges: allPrivileges });
                                                        }
                                                        console.log("tableWithAccess", tableWithAccess);
                                                    }}
                                                    className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${tableWithAccess
                                                        ? 'bg-black border-slate-600 text-slate-400 hover:border-slate-500'
                                                        : 'bg-slate-600 border-slate-600 text-slate-400 hover:border-slate-500 cursor-not-allowed'} 
                                                        ${selectedTable?.name === table ? 'bg-sky-700/50 border-sky-500 text-white' : ''}`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h4 className="font-medium">{table}</h4>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )
                    }

                </div>

                {/* Role Details */}
                <div className="lg:col-span-2">
                    {selectedRole && (
                        <div className="space-y-6">
                            {/* Permissions */}
                            <div className="bg-black border border-slate-700 rounded-xl">
                                <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-white">Privileges</h3>
                                    <button className={`text-white ${isEditTable ? 'cursor-not-allowed opacity-50' : ''}`} disabled={isEditTable} onClick={() => setIsEditPrivileges(!isEditPrivileges)} >
                                        {
                                            isEditPrivileges ? (<Eye className="w-5 h-5" />) : (<Edit className="w-5 h-5" />)
                                        }
                                    </button>
                                </div>
                                {
                                    isEditPrivileges ? (<EditPrivileges
                                        onSave={() => setIsEditPrivileges(false)}
                                        allPrivileges={allPrivileges}
                                        accessiblePrivileges={selectedTable?.privileges}
                                        selectedTable={selectedTable}
                                        selectedRole={selectedRole}
                                    />) : (<div className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {allPrivileges.sort().map((privilege) => {
                                                const isAccessible = selectedTable?.privileges.includes(privilege);
                                                return (
                                                    <div
                                                        key={privilege}
                                                        className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${isAccessible
                                                            ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
                                                            : 'bg-black border-slate-600 text-slate-400 hover:border-slate-500'
                                                            }`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <h4 className="font-medium">{privilege}</h4>
                                                                <p className="text-sm mt-1 text-slate-400 opacity-75">{getPrivDescription(privilege)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>)
                                }

                            </div>
                            {/* Tables */}


                        </div>
                    )}
                </div>
            </div>
            <AddRole isOpen={isAddRoleModalOpen} onClose={() => setIsAddRoleModalOpen(false)} />
            <EditRole isOpen={isEditRoleModalOpen} onClose={() => setIsEditRoleModalOpen(false)} onSubmit={handleEditRole} currentRole={{ id: selectedRole, name: selectedRole }} />
            <DeleteConfirm isOpen={isDeleteRoleModalOpen} onClose={() => setIsDeleteRoleModalOpen(false)} onConfirm={handleDeleteRole} title="Delete Role" message="Are you sure you want to delete this role?" />
        </div >
    );
} 