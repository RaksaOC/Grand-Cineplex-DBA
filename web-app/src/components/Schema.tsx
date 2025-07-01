'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Table, Database, Key, AlertCircle } from 'lucide-react';

interface Column {
    name: string;
    dataType: string;
    isNullable: boolean;
    isPrimaryKey: boolean;
    isUnique: boolean;
    defaultValue?: string;
}

interface TableSchema {
    name: string;
    columns: Column[];
    rowCount: number;
}

export default function Schema() {
    const [tables, setTables] = useState<TableSchema[]>([]);
    const [expandedTables, setExpandedTables] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Mock data for demonstration
    useEffect(() => {
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

        setTimeout(() => {
            setTables(mockTables);
            setIsLoading(false);
        }, 1000);
    }, []);

    const toggleTable = (tableName: string) => {
        setExpandedTables(prev =>
            prev.includes(tableName)
                ? prev.filter(name => name !== tableName)
                : [...prev, tableName]
        );
    };

    const getConstraintBadge = (column: Column) => {
        if (column.isPrimaryKey) {
            return <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-medium">PK</span>;
        }
        if (column.isUnique) {
            return <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-medium">UNIQUE</span>;
        }
        if (!column.isNullable) {
            return <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-xs font-medium">NOT NULL</span>;
        }
        return null;
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Database Schema</h1>
                    <p className="text-slate-400 mt-1">Monitor and manage database schema</p>
                </div>
                <div className="space-y-4 animate-pulse">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-black border border-slate-700 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-6 w-32 bg-slate-700 rounded"></div>
                                <div className="h-6 w-20 bg-slate-700 rounded"></div>
                            </div>
                            <div className="space-y-2">
                                {[...Array(4)].map((_, j) => (
                                    <div key={j} className="h-4 bg-slate-700 rounded w-full"></div>
                                ))}
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
            <div className="bg-black border border-slate-700 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                    <Database className="w-6 h-6 text-sky-400" />
                    <h2 className="text-xl font-semibold text-white">Schema Overview</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-4">
                        <div className="text-2xl font-bold text-white">{tables.length}</div>
                        <div className="text-sm text-slate-400">Total Tables</div>
                    </div>
                    <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-4">
                        <div className="text-2xl font-bold text-white">
                            {tables.reduce((sum, table) => sum + table.columns.length, 0)}
                        </div>
                        <div className="text-sm text-slate-400">Total Columns</div>
                    </div>
                    <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-4">
                        <div className="text-2xl font-bold text-white">
                            {tables.reduce((sum, table) => sum + table.rowCount, 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-400">Total Rows</div>
                    </div>
                </div>
            </div>

            {/* Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                {tables.map((table) => {
                    const isExpanded = expandedTables.includes(table.name);
                    return (
                        <div key={table.name} className="bg-black border border-slate-700 rounded-xl overflow-hidden">
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
                                            <p className="text-sm text-slate-400">{table.columns.length} columns • {table.rowCount.toLocaleString()} rows</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="bg-sky-500/20 text-sky-400 px-3 py-1 rounded-full text-sm font-medium">
                                            {table.columns.filter(col => col.isPrimaryKey).length} PK
                                        </span>
                                    </div>
                                </div>
                            </button>

                            {/* Table Columns */}
                            {isExpanded && (
                                <div className="border-t border-slate-700">
                                    <div className="p-6">
                                        <div className="space-y-3">
                                            {table.columns.map((column, index) => (
                                                <div key={column.name} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                                                            <span className="text-xs font-medium text-slate-300">{index + 1}</span>
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center space-x-2">
                                                                <span className="font-medium text-white">{column.name}</span>
                                                                {getConstraintBadge(column)}
                                                            </div>
                                                            <div className="flex items-center space-x-2 mt-1">
                                                                <span className="text-sm text-slate-400">{column.dataType}</span>
                                                                {column.defaultValue && (
                                                                    <span className="text-xs text-slate-500 bg-slate-700 px-2 py-1 rounded">
                                                                        DEFAULT: {column.defaultValue}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        {column.isPrimaryKey && <Key className="w-4 h-4 text-red-400" />}
                                                        {!column.isNullable && <AlertCircle className="w-4 h-4 text-orange-400" />}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}   