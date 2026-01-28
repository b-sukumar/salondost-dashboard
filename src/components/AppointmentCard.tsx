import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Booking, Status } from "@/lib/types";
import { User, Scissors, MessageCircle, CheckCircle2, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface AppointmentCardProps {
    booking: Booking;
    serviceName: string;
}

const statusColors: Record<Status, string> = {
    'Completed': 'bg-green-100 text-green-800 border-green-200',
    'In-Progress': 'bg-amber-100 text-amber-800 border-amber-200',
    'Pending': 'bg-gray-100 text-gray-800 border-gray-200',
};

export function AppointmentCard({ booking, serviceName }: AppointmentCardProps) {
    const sendWhatsAppReminder = () => {
        const message = `Hi ${booking.client_name}, this is a reminder for your ${serviceName} at SalonDost today at ${booking.booking_time}. See you soon!`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${booking.client_phone}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    };

    const markAsCompleted = async () => {
        const { error } = await supabase
            .from('bookings')
            .update({ status: 'Completed' })
            .eq('id', booking.id);

        if (error) {
            toast.error("Failed to update status");
        } else {
            toast.success("Khata Updated!");
        }
    };

    const deleteBooking = async () => {
        if (!confirm("Are you sure you want to delete this booking?")) return;

        const { error } = await supabase
            .from('bookings')
            .delete()
            .eq('id', booking.id);

        if (error) {
            toast.error("Failed to delete booking");
        } else {
            toast.success("Booking Deleted");
        }
    };

    return (
        <Card className="mb-4 border-none shadow-md bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow border-l-4 border-l-orange-500">
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                        <div className="bg-slate-100 p-2 rounded-lg">
                            <User className="text-slate-600" size={18} />
                        </div>
                        <div>
                            <h4 className="font-black text-slate-900 text-lg leading-tight">{booking.client_name}</h4>
                            <div className="flex items-center gap-1 text-slate-500 mt-0.5">
                                <Clock size={12} />
                                <span className="text-[10px] font-bold uppercase tracking-wider">{booking.booking_time}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-orange-50/50 p-2 rounded-lg text-orange-700 mb-4 border border-orange-100/50">
                    <Scissors size={14} className="shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-wider">{serviceName}</span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <Badge className={`${statusColors[booking.status]} font-black text-[10px] uppercase tracking-tighter px-2 py-1 rounded-md border-none`}>
                        {booking.status}
                    </Badge>

                    <div className="flex gap-2">
                        {booking.status !== 'Completed' ? (
                            <>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-9 w-9 text-slate-400 border-slate-200 hover:text-red-500 hover:border-red-200 hover:bg-red-50 rounded-lg transition-colors"
                                    onClick={deleteBooking}
                                >
                                    <Trash2 size={18} />
                                </Button>
                                <Button
                                    size="sm"
                                    className="h-9 px-4 bg-orange-600 hover:bg-orange-700 text-white font-black rounded-lg shadow-sm shadow-orange-200 flex gap-2"
                                    onClick={markAsCompleted}
                                >
                                    <CheckCircle2 size={18} />
                                    <span className="text-xs">DONE</span>
                                </Button>
                            </>
                        ) : (
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-9 w-9 text-slate-300 hover:text-red-500 rounded-lg"
                                onClick={deleteBooking}
                            >
                                <Trash2 size={18} />
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
