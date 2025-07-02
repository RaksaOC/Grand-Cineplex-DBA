'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Check, Save } from 'lucide-react';
import { AddRole } from './modals/AddRole';
import axios from 'axios';
import { EditRole } from './modals/EditRole';
import DeleteConfirm from './modals/DeleteConfirm';
import { TableSchema } from './Schema';

const mockTables: TableSchema[] = [
    {
        name: 'users',
        rowCount: 1250,
        columns: [
            { name: 'id', dataType: 'SERIAL', isNullable: false, isPrimaryKey: true, isUnique: true },
            { name: 'username', dataType: 'VARCHAR(50)', isNullable: false, isPrimaryKey: false, isUnique: true },
            { name: 'email', dataType: 'VARCHAR(100)', isNullable: false, isPrimaryKey: false, isUnique: true },
            { name: 'password_hash', dataType: 'VARCHAR(255)', isNullable: false, isPrimaryKey: false, isUnique: false },
            { name: 'created_at', dataType: 'TIMESTAMP', isNullable: false, isPrimaryKey: false, isUnique: false, defaultValue: 'CURRENT_TIMESTAMP' },
            { name: 'updated_at', dataType: 'TIMESTAMP', isNullable: true, isPrimaryKey: false, isUnique: false }
        ]
    },
    {
        name: 'movies',
        rowCount: 300,
        columns: [
            { name: 'id', dataType: 'SERIAL', isNullable: false, isPrimaryKey: true, isUnique: true },
            { name: 'title', dataType: 'VARCHAR(200)', isNullable: false, isPrimaryKey: false, isUnique: false },
            { name: 'description', dataType: 'TEXT', isNullable: true, isPrimaryKey: false, isUnique: false },
            { name: 'duration', dataType: 'INTEGER', isNullable: false, isPrimaryKey: false, isUnique: false },
            { name: 'release_date', dataType: 'DATE', isNullable: false, isPrimaryKey: false, isUnique: false },
            { name: 'genre', dataType: 'VARCHAR(50)', isNullable: false, isPrimaryKey: false, isUnique: false },
            { name: 'rating', dataType: 'DECIMAL(3,1)', isNullable: true, isPrimaryKey: false, isUnique: false }
        ]
    },
    {
        name: 'cinemas',
        rowCount: 5,
        columns: [
            { name: 'id', dataType: 'SERIAL', isNullable: false, isPrimaryKey: true, isUnique: true },
            { name: 'name', dataType: 'VARCHAR(100)', isNullable: false, isPrimaryKey: false, isUnique: false },
            { name: 'location', dataType: 'VARCHAR(200)', isNullable: false, isPrimaryKey: false, isUnique: false },
            { name: 'address', dataType: 'TEXT', isNullable: false, isPrimaryKey: false, isUnique: false },
            { name: 'phone', dataType: 'VARCHAR(20)', isNullable: true, isPrimaryKey: false, isUnique: false }
        ]
    },
    {
        name: 'screenings',
        rowCount: 7500,
        columns: [
            { name: 'id', dataType: 'SERIAL', isNullable: false, isPrimaryKey: true, isUnique: true },
            { name: 'movie_id', dataType: 'INTEGER', isNullable: false, isPrimaryKey: false, isUnique: false },
            { name: 'cinema_id', dataType: 'INTEGER', isNullable: false, isPrimaryKey: false, isUnique: false },
            { name: 'theater_number', dataType: 'INTEGER', isNullable: false, isPrimaryKey: false, isUnique: false },
            { name: 'start_time', dataType: 'TIMESTAMP', isNullable: false, isPrimaryKey: false, isUnique: false },
            { name: 'price', dataType: 'DECIMAL(6,2)', isNullable: false, isPrimaryKey: false, isUnique: false }
        ]
    },
    {
        name: 'bookings',
        rowCount: 50000,
        columns: [
            { name: 'id', dataType: 'SERIAL', isNullable: false, isPrimaryKey: true, isUnique: true },
            { name: 'user_id', dataType: 'INTEGER', isNullable: false, isPrimaryKey: false, isUnique: false },
            { name: 'screening_id', dataType: 'INTEGER', isNullable: false, isPrimaryKey: false, isUnique: false },
            { name: 'seat_number', dataType: 'VARCHAR(10)', isNullable: false, isPrimaryKey: false, isUnique: false },
            { name: 'booking_date', dataType: 'TIMESTAMP', isNullable: false, isPrimaryKey: false, isUnique: false, defaultValue: 'CURRENT_TIMESTAMP' },
            { name: 'status', dataType: 'VARCHAR(20)', isNullable: false, isPrimaryKey: false, isUnique: false, defaultValue: "'confirmed'" }
        ]
    }
];

export default function RolesManagement() {
    const [selectedRole, setSelectedRole] = useState('admin');
    const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
    const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
    const [isDeleteRoleModalOpen, setIsDeleteRoleModalOpen] = useState(false);
    const [selectedTable, setSelectedTable] = useState<TableSchema | null>(null);

    const handleEditRole = async (newName: string) => {
        console.log(newName);
    };
    const handleDeleteRole = async () => {
        console.log('delete role');
    };
    const roles = [
        {
            id: 'admin',
            name: 'Administrator',
            description: 'Full system access and control',
            userCount: 3,
            permissions: ['read', 'write', 'delete', 'create_users', 'manage_roles', 'system_config'],
            tables: mockTables.map(table => table.name)
        },
        {
            id: 'manager',
            name: 'Manager',
            description: 'Department-level access and management',
            userCount: 8,
            permissions: ['read', 'write', 'create_users', 'view_reports'],
            tables: ['users', 'movies', 'screenings']
        },
        {
            id: 'user',
            name: 'Standard User',
            description: 'Basic access to assigned resources',
            userCount: 45,
            permissions: ['read', 'write'],
            tables: ['movies', 'screenings', 'bookings']
        },
        {
            id: 'viewer',
            name: 'Viewer',
            description: 'Read-only access to specific data',
            userCount: 12,
            permissions: ['read'],
            tables: ['movies', 'screenings']
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
                    <h1 className="text-2xl font-bold text-white">Roles & Privileges</h1>
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
                                            <div className="flex items-center justify-between gap-2">
                                                <h3 className="font-semibold">{role.name}</h3>
                                                <button className="p-1 hover:bg-white/10 rounded transition-colors" onClick={() => setIsEditRoleModalOpen(true)}>
                                                    <Edit className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <p className={`text-sm mt-1 ${selectedRole === role.id ? 'text-sky-200' : 'text-slate-400'
                                                }`}>
                                                {role.userCount} users
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
                            {/* Tables */}
                            <div className="bg-black border border-slate-700 rounded-xl">
                                <div className="p-6 border-b border-slate-700">
                                    <h3 className="text-xl font-bold text-white">Tables</h3>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {mockTables.map((table) => {
                                            const hasTableAccess = currentRole.tables.includes(table.name);
                                            return (
                                                <div
                                                    key={table.name}
                                                    className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${hasTableAccess
                                                        ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
                                                        : 'bg-black border-slate-600 text-slate-400 hover:border-slate-500'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h4 className="font-medium">{table.name}</h4>
                                                        </div>
                                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${hasTableAccess
                                                            ? 'bg-sky-500/50 border-sky-500/50'
                                                            : 'border-slate-500'
                                                            }`}>
                                                            {hasTableAccess && <Check className="w-4 h-4 text-white" />}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-end">
                                <button className="bg-sky-500/20  border border-sky-500/30 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2">
                                    <Save className="w-5 h-5" />
                                    <span>Save</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <AddRole isOpen={isAddRoleModalOpen} onClose={() => setIsAddRoleModalOpen(false)} onSubmit={handleAddRole} />
            <EditRole isOpen={isEditRoleModalOpen} onClose={() => setIsEditRoleModalOpen(false)} onSubmit={handleEditRole} currentRole={currentRole} />
            <DeleteConfirm isOpen={isDeleteRoleModalOpen} onClose={() => setIsDeleteRoleModalOpen(false)} onConfirm={handleDeleteRole} title="Delete Role" message="Are you sure you want to delete this role?" />
        </div>
    );
} 