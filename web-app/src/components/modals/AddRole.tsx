'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { X, Shield, Check, Database } from 'lucide-react';

interface AddRoleProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (roleName: string, privileges: string[], tables: string[]) => void;
}

export const AddRole = ({ isOpen, onClose, onSubmit }: AddRoleProps) => {
    const [roleName, setRoleName] = useState('');
    const [selectedPrivileges, setSelectedPrivileges] = useState<string[]>([]);
    const [selectedTables, setSelectedTables] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Mock data for privileges
    const privileges = [
        { id: 'read', name: 'Read Data', description: 'View database records' },
        { id: 'write', name: 'Write Data', description: 'Create and update records' },
        { id: 'delete', name: 'Delete Data', description: 'Remove records from database' },
        { id: 'create_users', name: 'Create Users', description: 'Add new user accounts' },
        { id: 'manage_roles', name: 'Manage Roles', description: 'Create and modify roles' },
        { id: 'system_config', name: 'System Configuration', description: 'Modify system settings' },
        { id: 'view_reports', name: 'View Reports', description: 'Access system reports' },
        { id: 'backup_restore', name: 'Backup & Restore', description: 'Database backup operations' }
    ];

    // Mock data for tables
    const tables = [
        { id: 'users', name: 'Users Table', description: 'User account information' },
        { id: 'roles', name: 'Roles Table', description: 'Role definitions and permissions' },
        { id: 'permissions', name: 'Permissions Table', description: 'System permissions' },
        { id: 'audit_logs', name: 'Audit Logs', description: 'System activity logs' },
        { id: 'backups', name: 'Backups Table', description: 'Database backup records' },
        { id: 'settings', name: 'Settings Table', description: 'System configuration' }
    ];

    const handlePrivilegeToggle = (privilegeId: string) => {
        setSelectedPrivileges(prev =>
            prev.includes(privilegeId)
                ? prev.filter(id => id !== privilegeId)
                : [...prev, privilegeId]
        );
    };

    const handleTableToggle = (tableId: string) => {
        setSelectedTables(prev =>
            prev.includes(tableId)
                ? prev.filter(id => id !== tableId)
                : [...prev, tableId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!roleName.trim()) return;

        setIsLoading(true);
        try {
            await onSubmit(roleName.trim(), selectedPrivileges, selectedTables);
            setRoleName('');
            setSelectedPrivileges([]);
            setSelectedTables([]);
            onClose();
        } catch (error) {
            console.error('Failed to add role:', error);
        } finally {
            setIsLoading(false);
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
                            <Dialog.Panel className="bg-black border border-slate-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                                {/* Header */}
                                <div className="flex items-center justify-between p-6 border-b border-slate-700">
                                    <Dialog.Title className="text-xl font-bold text-white">
                                        Create New Role
                                    </Dialog.Title>
                                    <button
                                        onClick={onClose}
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

                                    {/* Privileges Section */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-white">Privileges</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {privileges.map((privilege) => {
                                                const isSelected = selectedPrivileges.includes(privilege.id);
                                                return (
                                                    <div
                                                        key={privilege.id}
                                                        onClick={() => handlePrivilegeToggle(privilege.id)}
                                                        className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${isSelected
                                                            ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
                                                            : 'bg-black border-slate-600 text-slate-400 hover:border-slate-500'
                                                            }`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <h4 className="font-medium text-sm">{privilege.name}</h4>
                                                                <p className="text-xs mt-1 opacity-75">{privilege.description}</p>
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

                                    {/* Tables Section */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-white">Table Access</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {tables.map((table) => {
                                                const isSelected = selectedTables.includes(table.id);
                                                return (
                                                    <div
                                                        key={table.id}
                                                        onClick={() => handleTableToggle(table.id)}
                                                        className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${isSelected
                                                            ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
                                                            : 'bg-black border-slate-600 text-slate-400 hover:border-slate-500'
                                                            }`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <h4 className="font-medium text-sm">{table.name}</h4>
                                                                <p className="text-xs mt-1 opacity-75">{table.description}</p>
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

                                    {/* Actions */}
                                    <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-700">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 text-slate-400 hover:text-white border border-slate-600 hover:border-slate-500 rounded-lg transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading || !roleName.trim()}
                                            className="px-6 py-2 bg-sky-500/20 border border-sky-500/30 text-white rounded-lg font-medium transition-all duration-200 hover:bg-sky-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                        >
                                            {isLoading ? (
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
