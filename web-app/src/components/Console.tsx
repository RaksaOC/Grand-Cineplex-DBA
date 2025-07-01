'use client';

import { useState, useRef, useEffect } from 'react';
import { Terminal, ChevronRight } from 'lucide-react';

interface CommandHistory {
    command: string;
    output: string;
    timestamp: Date;
}

export default function Console() {
    const [commandHistory, setCommandHistory] = useState<CommandHistory[]>([]);
    const [currentCommand, setCurrentCommand] = useState('');
    const [commandIndex, setCommandIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const consoleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (consoleRef.current) {
            consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
        }
    }, [commandHistory]);

    const handleCommand = (command: string) => {
        // let output = '';

        // switch (command.toLowerCase().trim()) {
        //     case 'help':
        //         output = 'Available commands:\n• help - Show this help message\n• status - Show database status\n• version - Show system version\n• clear - Clear console history';
        //         break;
        //     case 'status':
        //         output = 'Database Status: ONLINE\nConnected Users: 12\nActive Queries: 3\nUptime: 7 days, 3 hours';
        //         break;
        //     case 'version':
        //         output = 'Grand Cineplex Database Admin v1.0.0\nPostgreSQL 15.4\nNode.js 18.17.0';
        //         break;
        //     case 'clear':
        //         setCommandHistory([]);
        //         return;
        //     case '':
        //         return;
        //     default:
        //         output = `Command not found: ${command}\nType 'help' for available commands.`;
        // }

        // const newEntry: CommandHistory = {
        //     command,
        //     output,
        //     timestamp: new Date()
        // };

        // setCommandHistory(prev => [...prev, newEntry]);
        setCurrentCommand('');
        setCommandIndex(0);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
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

    const focusInput = () => {
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
                        <h2 className="text-lg font-semibold text-white">Grand Cineplex Terminal</h2>
                    </div>
                </div>

                {/* Console Output */}
                <div
                    ref={consoleRef}
                    className="h-[calc(100vh-290px)] overflow-y-auto p-4 font-mono text-sm bg-black"
                    onClick={focusInput}
                >
                    {commandHistory.map((entry, index) => (
                        <div key={index} className="mb-4">
                            {/* Command Input */}
                            <div className="flex items-center space-x-2 text-sky-400 mb-1">
                                <span className="text-white">grand_cineplex</span>
                                <span className="text-sky-400">{'>'}</span>
                                <span>{entry.command}</span>
                            </div>

                            {/* Command Output */}
                            {entry.output && (
                                <div className="ml-6 text-slate-300 whitespace-pre-wrap">
                                    {entry.output}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Current Command Line */}
                    <div className="flex items-center space-x-2 text-sky-400">
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
                        />
                    </div>
                </div>
            </div>

            {/* Quick Commands
            <div className="bg-black border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Commands</h3>
                <div className="flex flex-wrap gap-2">
                    {['help', 'status', 'version', 'clear'].map((cmd) => (
                        <button
                            key={cmd}
                            onClick={() => handleCommand(cmd)}
                            className="px-3 py-1 bg-slate-800 border border-slate-600 text-slate-300 rounded text-sm hover:bg-slate-700 hover:border-slate-500 transition-colors"
                        >
                            {cmd}
                        </button>
                    ))}
                </div>
            </div> */}
        </div>
    );
}