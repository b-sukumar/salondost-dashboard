import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Booking, Stylist, Service } from "@/lib/types";
import { AppointmentCard } from "./AppointmentCard";
import { Clock } from "lucide-react";

interface StylistGridProps {
    stylists: Stylist[];
    bookings: Booking[];
    services: Service[];
}

export function StylistGrid({ stylists, bookings, services }: StylistGridProps) {
    const getServiceName = (serviceId: string) => {
        return services.find(s => s.id === serviceId)?.name || 'Unknown Service';
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const getAvatarColor = (name: string) => {
        const colors = [
            'bg-blue-500', 'bg-purple-500', 'bg-pink-500',
            'bg-orange-500', 'bg-teal-500', 'bg-indigo-500'
        ];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <ScrollArea className="w-full whitespace-nowrap rounded-2xl pb-4">
            <div className="flex w-max space-x-6 p-1">
                {stylists.map((stylist) => (
                    <div key={stylist.id} className="w-[300px] shrink-0">
                        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between mb-6 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className={`h-12 w-12 ${getAvatarColor(stylist.name)} rounded-full flex items-center justify-center text-white font-bold border-4 border-white shadow-sm shrink-0`}>
                                    {getInitials(stylist.name)}
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-900 text-lg leading-tight">{stylist.name}</h3>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Staff On Duty</p>
                                </div>
                            </div>
                            <span className="bg-slate-50 text-slate-900 w-8 h-8 flex items-center justify-center rounded-full text-sm font-black border border-slate-100">
                                {bookings.filter(b => b.staff_id === stylist.id).length}
                            </span>
                        </div>

                        <div className="flex flex-col min-h-[400px] gap-4">
                            {bookings
                                .filter(b => b.staff_id === stylist.id)
                                .map((booking) => (
                                    <AppointmentCard
                                        key={booking.id}
                                        booking={booking}
                                        serviceName={getServiceName(booking.service_id)}
                                    />
                                ))}
                            {bookings.filter(b => b.staff_id === stylist.id).length === 0 && (
                                <div className="flex flex-col items-center justify-center p-12 bg-white border border-dashed border-slate-200 rounded-2xl text-slate-400 shadow-sm">
                                    <div className="bg-slate-50 p-4 rounded-full mb-3">
                                        <Clock size={24} className="text-slate-200" />
                                    </div>
                                    <span className="text-sm font-bold tracking-tight">No active bookings</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <ScrollBar orientation="horizontal" className="h-2" />
        </ScrollArea>
    );
}
