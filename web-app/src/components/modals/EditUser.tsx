'use client';

import { Dialog, Listbox, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { X, Shield, Lock, XCircle, Check, ChevronsUpDown } from 'lucide-react';
import axios from 'axios';
import Error from './Error';
import api from '@/config/api';
import { RolesData } from '@/types/RolesData';

interface EditUserProps {
    isOpen: boolean;
    onClose: () => void;
    currentUsername: string;
    onSuccess: () => void;
}

export const EditUser = ({ isOpen, onClose, currentUsername, onSuccess }: EditUserProps) => {
    const [userName, setUserName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPasswordEdit, setShowPasswordEdit] = useState(false);
    const [password, setPassword] = useState('');
    const [roles, setRoles] = useState<string[]>([]);
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (isOpen && currentUsername) {
            setUserName(currentUsername);
            setShowPasswordEdit(false);
            setPassword('');

            // Fetch the user's current role
            const fetchUserRole = async () => {
                try {
                    const response = await api.get(`/users/${currentUsername}/role`);
                    setSelectedRole(response.data.role);
                } catch (error) {
                    console.error('Failed to fetch user role:', error);
                }
            };
            fetchUserRole();
        }
    }, [isOpen, currentUsername]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await api.get('/roles');
                const data = response.data.map((role: RolesData) => role.role);
                setRoles(data);
            } catch (error) {
                setIsError(true);
                if (error.response && error.response.data) {
                    setErrorMessage(error.response.data.error);
                }
            } finally {
                setIsLoading(false);
            }
        }
        fetchRoles();
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userName.trim() || (userName.trim() === currentUsername && !password && !selectedRole)) return;

        setIsLoading(true);
        try {
            await axios.patch(`/api/users/${currentUsername}`, {
                username: userName.trim(),
                password: password || "",
                role: selectedRole || ""
            });
            onClose();
            onSuccess();
        } catch (error) {
            setIsError(true);
            // Check if error response exists and has data
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage('Failed to update user. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelPassword = () => {
        setShowPasswordEdit(false);
        setPassword('');
    };

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
                                        Edit User
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
                                    {/* User Name Field */}
                                    <div className="space-y-4">
                                        <label htmlFor="userName" className="block text-sm font-medium text-slate-300">
                                            Username
                                        </label>
                                        <div className="relative">
                                            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                            <input
                                                id="userName"
                                                type="text"
                                                value={userName}
                                                onChange={(e) => setUserName(e.target.value)}
                                                placeholder="Enter username"
                                                className="w-full pl-10 pr-4 py-3 bg-black border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-colors"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Password Section */}
                                    <div className="space-y-4">
                                        {!showPasswordEdit ? (
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswordEdit(true)}
                                                className="text-slate-400 hover:text-white text-sm flex items-center gap-2"
                                            >
                                                <Lock className="w-4 h-4" />
                                                Change Password
                                            </button>
                                        ) : (
                                            <>
                                                <div className="flex items-center justify-between">
                                                    <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                                                        New Password
                                                    </label>
                                                    <button
                                                        type="button"
                                                        onClick={handleCancelPassword}
                                                        className="text-slate-400 hover:text-white text-sm flex items-center gap-1"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                        Cancel
                                                    </button>
                                                </div>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                                    <input
                                                        id="password"
                                                        type="password"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        placeholder="Enter new password"
                                                        className="w-full pl-10 pr-4 py-3 bg-black border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-colors"
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Role Selection */}
                                    <div className="space-y-4">
                                        <label htmlFor="role" className="block text-sm font-medium text-slate-300">
                                            Role
                                        </label>
                                        <div className="relative">
                                            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                            <Listbox value={selectedRole} onChange={setSelectedRole}>
                                                <div className="relative">
                                                    <Listbox.Button className="relative w-full pl-10 pr-10 py-3 bg-black border border-slate-600 rounded-lg text-left focus:outline-none focus:border-sky-500 transition-colors">
                                                        <span className={`block truncate ${selectedRole ? 'text-white' : 'text-slate-400'}`}>
                                                            {selectedRole || 'Select a role'}
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
                                                        <Listbox.Options className="absolute z-10 mt-1 w-full bg-black border border-slate-700 rounded-lg py-1 text-base shadow-lg focus:outline-none">
                                                            {roles.map((role) => (
                                                                <Listbox.Option
                                                                    key={role}
                                                                    value={role}
                                                                    className={({ active }) =>
                                                                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-sky-500/10 text-sky-400' : 'text-slate-400'}`
                                                                    }
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
                                            disabled={isLoading || (!userName.trim() || (userName.trim() === currentUsername && !password && !selectedRole))}
                                            className="px-6 py-2 bg-sky-500/20 border border-sky-500/30 text-white rounded-lg font-medium transition-all duration-200 hover:bg-sky-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    <span>Updating...</span>
                                                </>
                                            ) : (
                                                <span>Update User</span>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
            <Error isOpen={isError} onClose={() => setIsError(false)} message={errorMessage} />
        </Transition>
    );
};

