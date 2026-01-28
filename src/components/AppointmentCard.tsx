import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Booking, Status } from "@/lib/types";
import { User, Scissors, MessageCircle, CheckCircle2, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
        <Card className="border border-slate-200 shadow-sm bg-white rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300">
            <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-slate-50 p-3 rounded-xl">
                            <User className="text-slate-400" size={20} />
                        </div>
                        <div>
                            <h4 className="font-black text-slate-900 text-lg leading-none">{booking.client_name}</h4>
                            <div className="flex items-center gap-1.5 text-slate-400 mt-1.5">
                                <Clock size={12} className="text-orange-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest">{booking.booking_time}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="inline-flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg text-slate-600 mb-5 border border-slate-100">
                    <Scissors size={14} className="text-orange-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{serviceName}</span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-4 border-t border-slate-100">
                    <Badge className={cn(
                        "font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full border-none shadow-none",
                        booking.status === 'Completed' ? "bg-green-100 text-green-700" :
                            booking.status === 'In-Progress' ? "bg-blue-100 text-blue-700" :
                                "bg-slate-100 text-slate-600"
                    )}>
                        {booking.status}
                    </Badge>

                    <div className="flex gap-2">
                        {booking.status !== 'Completed' ? (
                            <>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-10 w-10 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    onClick={deleteBooking}
                                >
                                    <Trash2 size={20} />
                                </Button>
                                <Button
                                    size="sm"
                                    className="h-10 px-5 bg-slate-900 hover:bg-black text-white font-black rounded-xl shadow-lg shadow-slate-200 flex gap-2 transition-all active:scale-95"
                                    onClick={markAsCompleted}
                                >
                                    <CheckCircle2 size={18} className="text-green-400" />
                                    <span className="text-xs">MARK DONE</span>
                                </Button>
                            </>
                        ) : (
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-10 w-10 text-slate-200 hover:text-red-500 rounded-xl"
                                onClick={deleteBooking}
                            >
                                <Trash2 size={20} />
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
