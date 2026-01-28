import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Booking, Stylist, Service } from "@/lib/types";
import { AppointmentCard } from "./AppointmentCard";

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
        <ScrollArea className="w-full whitespace-nowrap rounded-md pb-4">
            <div className="flex w-max space-x-4 p-1">
                {stylists.map((stylist) => (
                    <div key={stylist.id} className="w-[280px] shrink-0">
                        <div className="bg-white p-3 rounded-t-xl border-x border-t border-slate-200 flex items-center justify-between mb-4 shadow-sm">
                            <div className="flex items-center gap-2">
                                <div className={`h-10 w-10 ${getAvatarColor(stylist.name)} rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-sm shrink-0`}>
                                    {getInitials(stylist.name)}
                                </div>
                                <h3 className="font-bold text-slate-900 text-lg leading-tight">{stylist.name}</h3>
                            </div>
                            <span className="bg-orange-50 text-orange-600 px-2 py-1 rounded-lg text-xs font-black border border-orange-100">
                                {bookings.filter(b => b.staff_id === stylist.id).length}
                            </span>
                        </div>

                        <div className="flex flex-col min-h-[400px]">
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
                                <div className="flex flex-col items-center justify-center p-8 bg-slate-50 border border-dashed border-slate-200 rounded-lg text-slate-400">
                                    <span className="text-sm">No bookings yet</span>
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
