'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface ErrorProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
}

export default function Error({ isOpen, onClose, message }: ErrorProps) {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[9999]" onClose={onClose}>
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
                                    <Dialog.Title className="text-xl font-bold text-white flex items-center space-x-3">
                                        <AlertCircle className="w-6 h-6 text-red-500" />
                                        <span>Error</span>
                                    </Dialog.Title>
                                    <button
                                        onClick={onClose}
                                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <p className="text-slate-300">{message}</p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end p-6 pt-0">
                                    <button
                                        onClick={onClose}
                                        className="px-4 py-2 bg-sky-500/20 border border-sky-500/30 text-white rounded-lg font-medium transition-all duration-200 hover:bg-sky-500/30"
                                    >
                                        Close
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};
