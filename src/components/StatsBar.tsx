import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Clock, Users, IndianRupee, Heart } from "lucide-react";

interface StatsBarProps {
    totalCollection: number; // Collected
    pendingRevenue: number;  // Pending
    queueCount: number;      // Number of pending bookings
    totalClients: number;    // Total customers
    retentionRate: number;
    newClientsPercent: number;
}

export function StatsBar({
    totalCollection,
    pendingRevenue,
    queueCount,
    totalClients,
    retentionRate,
    newClientsPercent
}: StatsBarProps) {
    const stats = [
        {
            label: "Total Today",
            value: `₹${totalCollection.toLocaleString('en-IN')}`,
            subtext: "Collected",
            icon: IndianRupee,
            color: "text-green-600",
            bg: "bg-green-50"
        },
        {
            label: "Retention",
            value: `${retentionRate}%`,
            subtext: "Returning clients",
            icon: Heart,
            color: "text-pink-600",
            bg: "bg-pink-50",
            extra: (
                <div className="mt-3 space-y-1.5">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                        <span className="text-slate-900">New {newClientsPercent}%</span>
                        <span className="text-orange-600">Old {100 - newClientsPercent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                        <div
                            className="h-full bg-slate-900 transition-all duration-500"
                            style={{ width: `${newClientsPercent}%` }}
                        />
                        <div
                            className="h-full bg-orange-600 transition-all duration-500"
                            style={{ width: `${100 - newClientsPercent}%` }}
                        />
                    </div>
                </div>
            )
        },
        {
            label: "Queue Count",
            value: queueCount.toString(),
            subtext: "Active bookings",
            icon: Clock,
            color: "text-amber-600",
            bg: "bg-amber-50"
        },
        {
            label: "Total Clients",
            value: totalClients.toString(),
            subtext: "Saved clients",
            icon: Users,
            color: "text-purple-600",
            bg: "bg-purple-50"
        }
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
                <Card key={i} className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                    <CardContent className="p-4 md:p-6">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</span>
                            <div className={`${stat.bg} ${stat.color} p-2 rounded-lg`}>
                                <stat.icon size={18} />
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl font-black text-slate-900 mb-1">
                                {stat.value}
                            </div>
                            <p className="text-[11px] text-slate-400 font-medium">{stat.subtext}</p>
                            {stat.extra}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
