'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Table, Database, Key, AlertCircle } from 'lucide-react';
import { Table as TableType, TableColumn } from '@/app/types/Schema';
import axios from 'axios';

export default function Schema() {
    const [tables, setTables] = useState<TableType[]>([]);
    const [expandedTables, setExpandedTables] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [rowCount, setRowCount] = useState(0);

    // Mock data for demonstration
    useEffect(() => {
        const fetchTables = async () => {
            try {
                const response = await axios.get("/api/schema");
                const data = response.data;
                setTables(data.map((table: TableType) => ({
                    name: table.name,
                    columns: table.columns.map((column: TableColumn) => ({
                        column_name: column.column_name,
                        data_type: column.data_type,
                    })),
                })));
                setRowCount(data.reduce((sum, table) => sum + table.rowCount, 0));
            } catch (error) {
                console.error("Error fetching tables:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTables();
    }, []);

    const toggleTable = (tableName: string) => {
        setExpandedTables(prev =>
            prev.includes(tableName)
                ? prev.filter(name => name !== tableName)
                : [...prev, tableName]
        );
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <div className="h-8 w-48 bg-slate-700 rounded"></div>
                    <div className="h-5 w-64 bg-slate-700/50 rounded mt-1"></div>
                </div>

                {/* Schema Overview */}
                <div className="flex items-center space-x-3 mb-4">
                    <div className="h-6 w-6 bg-slate-700 rounded"></div>
                    <div className="h-7 w-40 bg-slate-700 rounded"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-black border border-slate-600 rounded-lg p-4">
                            <div className="h-8 bg-slate-700 rounded w-16"></div>
                            <div className="h-4 bg-slate-700/50 rounded w-24 mt-2"></div>
                        </div>
                    ))}
                </div>

                <div className='w-full h-0.5 bg-slate-700'></div>

                {/* Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-black border border-slate-700 rounded-xl p-6">
                            <div className="flex items-center space-x-3">
                                <div className="h-5 w-5 bg-slate-700 rounded"></div>
                                <div className="h-5 w-5 bg-slate-700 rounded"></div>
                                <div>
                                    <div className="h-6 w-32 bg-slate-700 rounded"></div>
                                    <div className="h-4 w-24 bg-slate-700/50 rounded mt-2"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Database Schema</h1>
                <p className="text-slate-400 mt-1">Monitor and manage database schema</p>
            </div>

            {/* Schema Overview */}
            <div className="flex items-center space-x-3 mb-4">
                <Database className="w-6 h-6 text-sky-400" />
                <h2 className="text-xl font-semibold text-white">Schema Overview</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-black border border-slate-600 rounded-lg p-4">
                    <div className="text-2xl font-bold text-white">{tables.length}</div>
                    <div className="text-sm text-slate-400">Total Tables</div>
                </div>
                <div className="bg-black border border-slate-600 rounded-lg p-4">
                    <div className="text-2xl font-bold text-white">
                        {tables.reduce((sum, table) => sum + table.columns.length, 0)}
                    </div>
                    <div className="text-sm text-slate-400">Total Columns</div>
                </div>
                <div className="bg-black border border-slate-600 rounded-lg p-4">
                    <div className="text-2xl font-bold text-white">
                        {rowCount.toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-400">Total Rows</div>
                </div>
            </div>

            <div className='w-full h-0.5 bg-slate-700'></div>

            {/* Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                {tables.map((table) => {
                    const isExpanded = expandedTables.includes(table.name);
                    return (
                        <div key={table.name} className="bg-black border border-slate-700 rounded-xl overflow-hidden flex flex-col">
                            {/* Table Header */}
                            <button
                                onClick={() => toggleTable(table.name)}
                                className="w-full p-6 text-left hover:bg-slate-800/50 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        {isExpanded ? (
                                            <ChevronDown className="w-5 h-5 text-slate-400" />
                                        ) : (
                                            <ChevronRight className="w-5 h-5 text-slate-400" />
                                        )}
                                        <Table className="w-5 h-5 text-sky-400" />
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">{table.name}</h3>
                                            <p className="text-sm text-slate-400">{table.columns.length} columns</p>
                                        </div>
                                    </div>
                                </div>
                            </button>

                            {/* Table Columns */}
                            <div className={`border-t border-slate-700 transition-[max-height,opacity] duration-300 ease-in-out ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'} overflow-y-auto`}>
                                <div className="p-6">
                                    <div className="space-y-3">
                                        {table.columns.map((column) => (
                                            <div key={column.column_name} className="flex items-center w-full justify-between p-3 bg-slate-800/30 rounded-lg">
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <span className="text-sm text-sky-400">{column.column_name}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-xs text-slate-400">{column.data_type}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}   