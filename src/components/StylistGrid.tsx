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

    return (
        <ScrollArea className="w-full whitespace-nowrap rounded-md pb-4">
            <div className="flex w-max space-x-4 p-1">
                {stylists.map((stylist) => (
                    <div key={stylist.id} className="w-[280px] shrink-0">
                        <div className="bg-slate-100 p-3 rounded-t-lg border-x border-t border-slate-200 flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-800 text-lg">{stylist.name}</h3>
                            <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-xs font-bold">
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
