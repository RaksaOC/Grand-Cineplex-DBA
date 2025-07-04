'use client'

import { useState, useRef, useEffect } from 'react';
import { Terminal } from 'lucide-react';
import axios from 'axios';

interface CommandHistory {
    command: string;
    result: any;
    timestamp: Date;
}

export default function Console() {
    const [commandHistory, setCommandHistory] = useState<CommandHistory[]>([]);
    const [currentCommand, setCurrentCommand] = useState('');
    const [commandIndex, setCommandIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const consoleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (consoleRef.current) {
            consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
        }
    }, [commandHistory]);

    const handleCommand = async (command: string) => {
        try {
            if (command.trim() === '') {
                return;
            }
            setIsLoading(true);
            const response = await axios.post('/api/console', { command: command });

            const newEntry: CommandHistory = {
                command,
                result: response.data,
                timestamp: new Date()
            };

            setCommandHistory(prev => [...prev, newEntry]);
            setCurrentCommand('');
            setCommandIndex(0);
            consoleRef.current?.focus();
        } catch (error) {
            if (error.response && error.response.data) {
                const newEntry: CommandHistory = {
                    command,
                    result: error.response.data.error,
                    timestamp: new Date()
                };
                setCommandHistory(prev => [...prev, newEntry]);
            } else {
                const newEntry: CommandHistory = {
                    command,
                    result: "Error executing command",
                    timestamp: new Date()
                };
                setCommandHistory(prev => [...prev, newEntry]);
            }
            setCurrentCommand('');
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isLoading) {
            handleCommand(currentCommand);
            focusInput();
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

    const focusInput = () => {
        console.log("focusInput");
        inputRef.current?.focus();
    };

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
                    <div className="flex items-center space-x-3">
                        <Terminal className="w-5 h-5 text-sky-400" />
                        <h2 className="text-lg font-semibold text-white">Grand Cineplex Database Console</h2>
                    </div>
                </div>

                {/* Console Output */}
                <div
                    ref={consoleRef}
                    className="h-[calc(100vh-290px)] overflow-y-auto p-4 font-mono text-sm bg-black"
                    onClick={focusInput}
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
                            <div className={`whitespace-pre-wrap pl-6 ${typeof entry.result === 'string' && entry.result === 'No results found' ? 'text-gray-500' : 'text-red-400'}`}>
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
                            onFocus={focusInput}
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