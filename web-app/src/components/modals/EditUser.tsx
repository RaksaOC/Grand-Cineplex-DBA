'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { X, Shield, Lock, XCircle } from 'lucide-react';
import axios from 'axios';

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

    useEffect(() => {
        if (isOpen && currentUsername) {
            setUserName(currentUsername);
            setShowPasswordEdit(false);
            setPassword('');
        }
    }, [isOpen, currentUsername]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userName.trim() || (userName.trim() === currentUsername && !password)) return;

        setIsLoading(true);
        try {
            await axios.patch(`/api/users/${currentUsername}`, {
                username: userName.trim(),
                password: password || ""
            });
            onClose();
            onSuccess();
        } catch (error) {
            console.error('Failed to update user:', error);
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
                                            disabled={isLoading || (!userName.trim() || (userName.trim() === currentUsername && !password))}
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
        </Transition>
    );
};

