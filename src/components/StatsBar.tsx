import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Clock } from "lucide-react";

interface StatsBarProps {
    totalCollection: number;
    pendingBookings: number;
    pendingRevenue: number;
}

export function StatsBar({ totalCollection, pendingBookings, pendingRevenue }: StatsBarProps) {
    return (
        <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4 flex flex-col justify-between h-full">
                    <div className="flex items-center justify-between text-green-700 mb-2">
                        <span className="text-sm font-medium">Daily Collection</span>
                        <TrendingUp size={20} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-green-900 leading-none mb-1">
                            ₹{totalCollection.toLocaleString('en-IN')}
                        </div>
                        <p className="text-[10px] text-green-600 font-bold uppercase tracking-tight">Today's Revenue</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-amber-50 border-amber-200">
                <CardContent className="p-4 flex flex-col justify-between h-full">
                    <div className="flex items-center justify-between text-amber-700 mb-2">
                        <span className="text-sm font-medium">Pending </span>
                        <Clock size={20} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-amber-900 leading-none mb-1">
                            ₹{pendingRevenue.toLocaleString('en-IN')}
                        </div>
                        <p className="text-[10px] text-amber-600 font-bold uppercase tracking-tight">{pendingBookings} Bookings left</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
