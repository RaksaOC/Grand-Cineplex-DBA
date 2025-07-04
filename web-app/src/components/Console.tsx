'use client'

import { useState, useRef, useEffect } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';
import axios from 'axios';

interface CommandHistory {
    command: string;
    result: string;
    timestamp: Date;
    isError: boolean;
}

export default function Console() {
    const [commandHistory, setCommandHistory] = useState<CommandHistory[]>([]);
    const [currentCommand, setCurrentCommand] = useState('');
    const [commandIndex, setCommandIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const consoleRef = useRef<HTMLDivElement>(null);
    const [isCopied, setIsCopied] = useState(false);

    // Auto-scroll effect
    useEffect(() => {
        if (consoleRef.current) {
            consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
        }
    }, [commandHistory]);

    // Auto-focus effect
    useEffect(() => {
        if (!isLoading) {
            inputRef.current?.focus();
        }
    }, [isLoading, commandHistory]);

    const handleCommand = async (command: string) => {
        try {
            if (command.trim() === '') {
                return;
            }

            // Handle clear command locally
            if (command.trim().toLowerCase() === 'clear') {
                setCommandHistory([]);
                setCurrentCommand('');
                return;
            }

            setIsLoading(true);
            const response = await axios.post('/api/console', { command: command });

            // Safely handle the response data
            const result = response.data?.result || response.data;
            const resultString = typeof result === 'string' ? result : JSON.stringify(result, null, 2);

            const newEntry: CommandHistory = {
                command,
                result: resultString,
                timestamp: new Date(),
                isError: false
            };

            setCommandHistory(prev => [...prev, newEntry]);
            setCurrentCommand('');
            setCommandIndex(0);
        } catch (error: any) {
            let errorMessage = "Error executing command";

            if (error?.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error?.message) {
                errorMessage = error.message;
            }

            const newEntry: CommandHistory = {
                command,
                result: errorMessage,
                timestamp: new Date(),
                isError: true
            };
            setCommandHistory(prev => [...prev, newEntry]);
            setCurrentCommand('');
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isLoading) {
            handleCommand(currentCommand);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const commands = commandHistory.map(h => h.command).reverse();
            if (commandIndex < commands.length) {
                setCurrentCommand(commands[commandIndex]);
                setCommandIndex(prev => prev + 1);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (commandIndex > 0) {
                setCommandIndex(prev => prev - 1);
                const commands = commandHistory.map(h => h.command).reverse();
                setCurrentCommand(commandIndex > 1 ? commands[commandIndex - 2] : '');
            } else {
                setCurrentCommand('');
            }
        }
    };

    const handleCopy = () => {
        if (commandHistory.length > 0) {
            navigator.clipboard.writeText(commandHistory[commandHistory.length - 1].result);
        }
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Database Console</h1>
                <p className="text-slate-400 mt-1">Execute commands and monitor database operations</p>
            </div>

            {/* Console */}
            <div className="bg-black border border-slate-700 rounded-xl overflow-hidden">
                {/* Console Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-700">
                    <div className="flex items-center justify-between  space-x-3">
                        <Terminal className="w-5 h-5 text-sky-400" />
                        <h2 className="text-lg font-semibold text-white">Grand Cineplex Database Console</h2>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button disabled={isCopied || commandHistory.length === 0} className={`text-white text-sm flex items-center gap-2 bg-sky-700/50 border border-sky-500/30  px-4 py-2 rounded-lg ${commandHistory.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={handleCopy}>
                            {
                                isCopied ?
                                    <Check className="w-4 h-4" />
                                    :
                                    <Copy className="w-4 h-4" />
                            }
                            {isCopied ? 'Copied' : 'Copy Current Result'}
                        </button>
                    </div>
                </div>

                {/* Console Output */}
                <div
                    ref={consoleRef}
                    onClick={() => {
                        inputRef.current?.focus();
                    }}
                    className="h-[calc(100vh-290px)] overflow-y-auto p-4 font-mono text-sm bg-black cursor-text"
                >
                    {/* Command History */}
                    {commandHistory.map((entry, index) => (
                        <div key={index} className="mb-4">
                            {/* Command */}
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="text-white">grand_cineplex</span>
                                <span className="text-sky-400">{'>'}</span>
                                <span className="text-sky-400">{entry.command}</span>
                            </div>
                            {/* Result */}
                            <div className={`whitespace-pre-wrap p-1 ${entry.isError ? 'text-red-400' :
                                entry.result === 'No results found' ? 'text-gray-500' :
                                    'text-green-400'
                                }`}>
                                {entry.result}
                            </div>
                        </div>
                    ))}

                    {/* Current Command Line */}
                    <div className="flex items-center space-x-2 sticky bottom-0">
                        <span className="text-white">grand_cineplex</span>
                        <span className="text-sky-400">{'>'}</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={currentCommand}
                            onChange={(e) => setCurrentCommand(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1 bg-transparent text-sky-400 outline-none border-none"
                            autoFocus
                            autoCorrect='off'
                            autoCapitalize='off'
                            spellCheck='false'
                            disabled={isLoading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}