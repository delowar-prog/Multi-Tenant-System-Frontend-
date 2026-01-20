"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Home() {
    // Mock stats for superadmin
    const stats = [
        { title: "Total Tenants", value: 25, icon: "🏢" },
        { title: "Total Admins", value: 10, icon: "👑" },
        { title: "Active Subscriptions", value: 18, icon: "📈" },
        { title: "Total Revenue", value: "$50,000", icon: "💰" },
    ];

    // Mock chart data
    const chartData = [
        { name: 'Jan', revenue: 4000 },
        { name: 'Feb', revenue: 3000 },
        { name: 'Mar', revenue: 5000 },
        { name: 'Apr', revenue: 4500 },
        { name: 'May', revenue: 6000 },
    ];

    return (
        <div className="p-4 text-slate-900 dark:text-slate-100 sm:p-6">
            {/* Dashboard Cards */}
            <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <div key={index} className="rounded-lg bg-white p-6 shadow-sm dark:bg-slate-800">
                        <div className="flex items-center">
                            <div className="text-2xl">{stat.icon}</div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.title}</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart */}
            <div className="mb-8 rounded-lg bg-white p-6 shadow-sm dark:bg-slate-800">
                <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Monthly Revenue</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="revenue" fill="#10b981" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
