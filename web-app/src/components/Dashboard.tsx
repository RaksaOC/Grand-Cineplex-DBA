'use client';

import api from '@/config/api';
import { DashboardData } from '@/types/DashboardData';
import { Users, Shield, Database, DatabaseBackup, Table, View, CloudLightning, Cog } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Dashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState<DashboardData>({
        numOfUsers: 0,
        numOfRoles: 0,
        databaseSize: 0,
        totalBackups: 0,
        numOfTables: 0,
        numOfViews: 0,
        numOfIndexes: 0,
        numOfTriggers: 0,
        recentActivities: [],
    });

    const stats = [
        {
            title: 'Users',
            value: dashboardData.numOfUsers,
            icon: <Users className='text-white' />,
        },
        {
            title: 'Roles',
            value: dashboardData.numOfRoles,
            icon: <Shield className='text-white' />,
        },
        {
            title: 'Database Size',
            value: dashboardData.databaseSize,
            icon: <Database className='text-white' />,
        },
        {
            title: 'Total Backups',
            value: dashboardData.totalBackups,
            icon: <DatabaseBackup className='text-white' />,
        },
        {
            title: 'Tables',
            value: dashboardData.numOfTables,
            icon: <Table className='text-white' />,
        },
        {
            title: 'Views',
            value: dashboardData.numOfViews,
            icon: <View className='text-white' />,
        },
        {
            title: 'Indexes',
            value: dashboardData.numOfIndexes,
            icon: <CloudLightning className='text-white' />,
        },
        {
            title: 'Triggers',
            value: dashboardData.numOfTriggers,
            icon: <Cog className='text-white' />,
        }
    ]

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/dashboard');
                const data = response.data;
                setDashboardData(data);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (isLoading) {
        return (
            <div className="space-y-6 animate-pulse">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="h-8 w-32 bg-slate-700 rounded"></div>
                        <div className="h-4 w-48 bg-slate-700 rounded mt-1"></div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, index) => (
                        <div key={index} className="bg-black border border-slate-700 rounded-xl p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <div className="h-4 w-20 bg-slate-700 rounded"></div>
                                    <div className="h-6 w-16 bg-slate-700 rounded"></div>
                                </div>
                                <div className="w-12 h-12 rounded-lg bg-slate-700"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Activity */}
                <div className="bg-black border border-slate-700 rounded-xl">
                    <div className="p-6 border-b border-slate-700">
                        <div className="h-6 w-32 bg-slate-700 rounded"></div>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {[...Array(5)].map((_, index) => (
                                <div key={index} className="flex space-x-4">
                                    <div className="h-4 w-24 bg-slate-700 rounded"></div>
                                    <div className="h-4 w-32 bg-slate-700 rounded"></div>
                                    <div className="h-4 w-20 bg-slate-700 rounded"></div>
                                    <div className="h-4 w-40 bg-slate-700 rounded"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                    <p className="text-slate-400 mt-1">Database administration overview</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    return (
                        <div key={index} className="bg-black border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
                                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                                </div>
                                <div className={`w-12 h-12 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center`}>
                                    {stat.icon}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <div className="bg-black border border-slate-700 rounded-xl">
                <div className="p-6 border-b border-slate-700">
                    <h2 className="text-xl font-bold text-white">Recent Activity</h2>
                </div>
                <div className="p-6">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left border-b border-slate-700">
                                <th className="pb-3 text-white font-bold">Username</th>
                                <th className="pb-3 text-white font-bold">IP Address</th>
                                <th className="pb-3 text-white font-bold">Status</th>
                                <th className="pb-3 text-white font-bold">Start Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboardData.recentActivities.map((activity, index) => (
                                <tr key={index} className="border-b border-slate-700 hover:bg-slate-900/50 transition-colors">
                                    <td className="py-4 text-white">{activity.usename}</td>
                                    <td className="py-4 text-slate-400">{activity.ip}</td>
                                    <td className="py-4 text-slate-400">{activity.status}</td>
                                    <td className="py-4 text-slate-400">{activity.backend_start.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
