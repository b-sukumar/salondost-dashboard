import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Clock } from "lucide-react";

interface StatsBarProps {
    totalCollection: number;
    pendingBookings: number;
}

export function StatsBar({ totalCollection, pendingBookings }: StatsBarProps) {
    return (
        <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4 flex flex-col justify-between h-full">
                    <div className="flex items-center justify-between text-green-700 mb-2">
                        <span className="text-sm font-medium">Daily Collection</span>
                        <TrendingUp size={20} />
                    </div>
                    <div className="text-2xl font-bold text-green-900 leading-none">
                        ₹{totalCollection.toLocaleString('en-IN')}
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-amber-50 border-amber-200">
                <CardContent className="p-4 flex flex-col justify-between h-full">
                    <div className="flex items-center justify-between text-amber-700 mb-2">
                        <span className="text-sm font-medium">Pending</span>
                        <Clock size={20} />
                    </div>
                    <div className="text-2xl font-bold text-amber-900 leading-none">
                        {pendingBookings}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
