'use client';

import { Dialog, Transition, Listbox } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { X, User, Lock, Shield, Check, ChevronsUpDown } from 'lucide-react';
import { Role } from '@/types/Roles';
import axios from 'axios';
import { RolesData } from '@/types/RolesData';

interface AddUserProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddUser = ({ isOpen, onClose }: AddUserProps) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [roles, setRoles] = useState<string[]>([]);

    useEffect(() => {
        const fetchRoles = async () => {
            const response = await axios.get('/api/roles');

            // should get roles in an array like ["postgres", "admin", "user"]
            const data = response.data.map((role: RolesData) => role.role);
            console.log(data);
            setRoles(data);
        }
        fetchRoles();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim() || !password.trim()) return;

        setIsLoading(true);
        try {
            await axios.post('/api/users', {
                username: username.trim(),
                password: password,
                role: selectedRole || null
            });
            setUsername('');
            setPassword('');
            setSelectedRole(null);
            onClose();
        } catch (error) {
            console.error('Failed to add user:', error);
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
                            <Dialog.Panel className="bg-black border border-slate-700 rounded-xl w-full max-w-md">
                                {/* Header */}
                                <div className="flex items-center justify-between p-6 border-b border-slate-700">
                                    <Dialog.Title className="text-xl font-bold text-white">
                                        Add New User
                                    </Dialog.Title>
                                    <button
                                        onClick={onClose}
                                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                    {/* Username Field */}
                                    <div className="space-y-4">
                                        <label htmlFor="username" className="block text-sm font-medium text-slate-300">
                                            Username
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                            <input
                                                id="username"
                                                type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                placeholder="Enter username"
                                                className="w-full pl-10 pr-4 py-3 bg-black border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-colors"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Password Field */}
                                    <div className="space-y-4">
                                        <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                            <input
                                                id="password"
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Enter password"
                                                className="w-full pl-10 pr-4 py-3 bg-black border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-colors"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Role Selection */}
                                    <div className="space-y-4">
                                        <label className="block text-sm font-medium text-slate-300">
                                            Assign Role
                                        </label>
                                        <Listbox value={selectedRole} onChange={(value) => setSelectedRole(value)}>
                                            <div className="relative">
                                                <Listbox.Button className="relative w-full pl-10 pr-10 py-3 bg-black border border-slate-600 rounded-lg text-left focus:outline-none focus:border-sky-500 transition-colors">
                                                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                                    <span className={`block truncate ${selectedRole ? 'text-white' : 'text-slate-400'}`}>
                                                        {selectedRole || 'None'}
                                                    </span>
                                                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                        <ChevronsUpDown className="h-5 w-5 text-slate-400" aria-hidden="true" />
                                                    </span>
                                                </Listbox.Button>
                                                <Transition
                                                    as={Fragment}
                                                    leave="transition ease-in duration-100"
                                                    leaveFrom="opacity-100"
                                                    leaveTo="opacity-0"
                                                >
                                                    <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-black border border-slate-700 py-1 shadow-lg focus:outline-none">
                                                        <Listbox.Option
                                                            className={({ active }) =>
                                                                `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-sky-500/10 text-sky-400' : 'text-slate-400'
                                                                }`
                                                            }
                                                            value={""}
                                                        >
                                                            {({ selected, active }) => (
                                                                <>
                                                                    <span className={`block truncate ${selected ? 'font-medium text-sky-400' : ''}`}>
                                                                        None
                                                                    </span>
                                                                    {selected ? (
                                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sky-400">
                                                                            <Check className="h-5 w-5" aria-hidden="true" />
                                                                        </span>
                                                                    ) : null}
                                                                </>
                                                            )}
                                                        </Listbox.Option>
                                                        {roles.map((role) => (
                                                            <Listbox.Option
                                                                key={role}
                                                                className={({ active }) =>
                                                                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-sky-500/10 text-sky-400' : 'text-slate-400'
                                                                    }`
                                                                }
                                                                value={role}
                                                            >
                                                                {({ selected, active }) => (
                                                                    <>
                                                                        <span className={`block truncate ${selected ? 'font-medium text-sky-400' : ''}`}>
                                                                            {role}
                                                                        </span>
                                                                        {selected ? (
                                                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sky-400">
                                                                                <Check className="h-5 w-5" aria-hidden="true" />
                                                                            </span>
                                                                        ) : null}
                                                                    </>
                                                                )}
                                                            </Listbox.Option>
                                                        ))}
                                                    </Listbox.Options>
                                                </Transition>
                                            </div>
                                        </Listbox>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-end space-x-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 text-slate-400 hover:text-white border border-slate-600 hover:border-slate-500 rounded-lg transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading || !username.trim() || !password.trim()}
                                            className="px-6 py-2 bg-sky-500/20 border border-sky-500/30 text-white rounded-lg font-medium transition-all duration-200 hover:bg-sky-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    <span>Adding...</span>
                                                </>
                                            ) : (
                                                <span>Add User</span>
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