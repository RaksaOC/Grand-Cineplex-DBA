'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Check } from 'lucide-react';
import { AddRole } from './modals/AddRole';
import axios from 'axios';

export default function RolesManagement() {
    const [selectedRole, setSelectedRole] = useState('admin');
    const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
    const roles = [
        {
            id: 'admin',
            name: 'Administrator',
            description: 'Full system access and control',
            userCount: 3,
            permissions: ['read', 'write', 'delete', 'create_users', 'manage_roles', 'system_config']
        },
        {
            id: 'manager',
            name: 'Manager',
            description: 'Department-level access and management',
            userCount: 8,
            permissions: ['read', 'write', 'create_users', 'view_reports']
        },
        {
            id: 'user',
            name: 'Standard User',
            description: 'Basic access to assigned resources',
            userCount: 45,
            permissions: ['read', 'write']
        },
        {
            id: 'viewer',
            name: 'Viewer',
            description: 'Read-only access to specific data',
            userCount: 12,
            permissions: ['read']
        }
    ];

    const allPermissions = [
        { id: 'read', name: 'Read Data', description: 'View database records' },
        { id: 'write', name: 'Write Data', description: 'Create and update records' },
        { id: 'delete', name: 'Delete Data', description: 'Remove records from database' },
        { id: 'create_users', name: 'Create Users', description: 'Add new user accounts' },
        { id: 'manage_roles', name: 'Manage Roles', description: 'Create and modify roles' },
        { id: 'system_config', name: 'System Configuration', description: 'Modify system settings' },
        { id: 'view_reports', name: 'View Reports', description: 'Access system reports' },
        { id: 'backup_restore', name: 'Backup & Restore', description: 'Database backup operations' }
    ];

    const currentRole = roles.find(role => role.id === selectedRole);

    const handleAddRole = async (roleName: string, privileges: string[], tables: string[]) => {
        console.log(roleName, privileges, tables);
        // try {
        //     const response = await axios.post('/api/roles', { roleName, privileges, tables });
        //     console.log(response.data);
        // } catch (error) {
        //     console.error('Failed to add role:', error);
        // }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Roles & Permissions</h1>
                    <p className="text-slate-400 mt-1">Manage user roles and access permissions</p>
                </div>
                <button onClick={() => setIsAddRoleModalOpen(true)} className="bg-sky-500/20  border border-sky-500/30 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2">
                    <Plus className="w-5 h-5" />
                    <span>Create Role</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Roles List */}
                <div className="lg:col-span-1">
                    <div className="bg-black border border-slate-700 rounded-xl">
                        <div className="p-6 border-b border-slate-700">
                            <h2 className="text-xl font-bold text-white">Roles</h2>
                        </div>
                        <div className="p-4 space-y-2">
                            {roles.map((role) => (
                                <button
                                    key={role.id}
                                    onClick={() => setSelectedRole(role.id)}
                                    className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${selectedRole === role.id
                                        ? 'bg-sky-500/20  border border-sky-500/30 text-white'
                                        : 'text-slate-300 hover:bg-black border border-slate-700 hover:border-slate-600 hover:text-white'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold">{role.name}</h3>
                                            <p className={`text-sm mt-1 ${selectedRole === role.id ? 'text-sky-200' : 'text-slate-400'
                                                }`}>
                                                {role.userCount} users
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button className="p-1 hover:bg-white/10 rounded transition-colors">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="p-1 hover:bg-white/10 rounded transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Role Details */}
                <div className="lg:col-span-2">
                    {currentRole && (
                        <div className="space-y-6">

                            {/* Permissions */}
                            <div className="bg-black border border-slate-700 rounded-xl">
                                <div className="p-6 border-b border-slate-700">
                                    <h3 className="text-xl font-bold text-white">Permissions</h3>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {allPermissions.map((permission) => {
                                            const hasPermission = currentRole.permissions.includes(permission.id);
                                            return (
                                                <div
                                                    key={permission.id}
                                                    className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${hasPermission
                                                        ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
                                                        : 'bg-black border-slate-600 text-slate-400 hover:border-slate-500'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h4 className="font-medium">{permission.name}</h4>
                                                            <p className="text-sm mt-1 opacity-75">{permission.description}</p>
                                                        </div>
                                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${hasPermission
                                                            ? 'bg-sky-500/50 border-sky-500/50'
                                                            : 'border-slate-500'
                                                            }`}>
                                                            {hasPermission && <Check className="w-4 h-4 text-white" />}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <AddRole isOpen={isAddRoleModalOpen} onClose={() => setIsAddRoleModalOpen(false)} onSubmit={handleAddRole} />
        </div>
    );
} 