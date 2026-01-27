import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Booking, Status } from "@/lib/types";
import { User, Scissors, MessageCircle, CheckCircle2 } from "lucide-react";
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

    return (
        <Card className="mb-3 border-l-4 border-l-orange-500 shadow-sm bg-white">
            <CardContent className="p-3">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <User className="text-slate-500" size={16} />
                        <h4 className="font-bold text-slate-900 text-lg">{booking.client_name}</h4>
                    </div>
                    <span className="text-sm font-semibold text-slate-500">{booking.booking_time}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-600 mb-4">
                    <Scissors size={14} />
                    <span className="text-sm font-medium">{serviceName}</span>
                </div>

                <div className="flex items-center justify-between gap-2">
                    <Badge className={`${statusColors[booking.status]} font-bold text-[10px] uppercase tracking-wider py-0.5`}>
                        {booking.status}
                    </Badge>

                    <div className="flex gap-2">
                        {booking.status !== 'Completed' && (
                            <>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 px-2 text-green-600 border-green-200 hover:bg-green-50"
                                    onClick={sendWhatsAppReminder}
                                >
                                    <MessageCircle size={16} className="mr-1" />
                                    <span className="text-[10px] font-bold">REPLY</span>
                                </Button>
                                <Button
                                    size="sm"
                                    className="h-8 px-2 bg-slate-900 hover:bg-slate-800 text-white"
                                    onClick={markAsCompleted}
                                >
                                    <CheckCircle2 size={16} className="mr-1" />
                                    <span className="text-[10px] font-bold">DONE</span>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
