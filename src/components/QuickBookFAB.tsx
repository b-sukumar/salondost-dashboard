"use client";

import { useState } from "react";
import { Plus, User, Phone, Scissors, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { Stylist, Service } from "@/lib/types";

interface QuickBookFABProps {
    stylists: Stylist[];
    services: Service[];
}

export function QuickBookFAB({ stylists, services }: QuickBookFABProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        clientName: "",
        clientPhone: "",
        serviceId: "",
        stylistId: "",
    });

    const handleSubmit = async () => {
        if (!formData.clientName || !formData.serviceId || !formData.stylistId) return;

        setIsSubmitting(true);

        const { error } = await supabase.from('bookings').insert([
            {
                client_name: formData.clientName,
                client_phone: formData.clientPhone,
                service_id: formData.serviceId,
                staff_id: formData.stylistId,
                booking_time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                booking_date: new Date().toISOString().split('T')[0],
                status: 'Pending',
            }
        ]);

        setIsSubmitting(false);

        if (error) {
            console.error("Error creating booking:", error);
            alert("Failed to create booking. Please try again.");
            return;
        }

        setFormData({
            clientName: "",
            clientPhone: "",
            serviceId: "",
            stylistId: "",
        });
        setIsOpen(false);
    };

    return (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
                <Button
                    size="icon"
                    className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl bg-orange-600 hover:bg-orange-700 active:scale-95 transition-all z-50 border-4 border-white"
                >
                    <Plus size={32} strokeWidth={3} />
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader className="pb-2">
                        <DrawerTitle className="text-2xl font-bold text-slate-900">New Booking</DrawerTitle>
                        <DrawerDescription>Add a new customer to the Daily Khata</DrawerDescription>
                    </DrawerHeader>

                    <div className="p-4 space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <User size={16} /> Client Name
                            </label>
                            <Input
                                placeholder="Enter client name"
                                className="h-12 text-lg"
                                value={formData.clientName}
                                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <Phone size={16} /> Client Phone
                            </label>
                            <Input
                                placeholder="Enter phone number"
                                className="h-12 text-lg"
                                type="tel"
                                value={formData.clientPhone}
                                onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    <Scissors size={16} /> Service
                                </label>
                                <Select
                                    onValueChange={(value) => setFormData({ ...formData, serviceId: value })}
                                    value={formData.serviceId}
                                >
                                    <SelectTrigger className="h-12">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {services.map((s) => (
                                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    <Users size={16} /> Stylist
                                </label>
                                <Select
                                    onValueChange={(value) => setFormData({ ...formData, stylistId: value })}
                                    value={formData.stylistId}
                                >
                                    <SelectTrigger className="h-12">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {stylists.map((s) => (
                                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <DrawerFooter className="pt-2">
                        <Button
                            className="h-14 text-lg font-bold bg-orange-600 hover:bg-orange-700"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating..." : "Create Booking"}
                        </Button>
                        <DrawerClose asChild>
                            <Button variant="outline" className="h-12" disabled={isSubmitting}>Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
