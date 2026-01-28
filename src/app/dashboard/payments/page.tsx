"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Booking, Stylist, Service } from "@/lib/types";
import { IndianRupee, Download, Calendar, User, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { redirect } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

export default function PaymentsPage() {
    const [bookings, setBookings] = useState<(Booking & { staff_name: string; service_name: string; amount: number })[]>([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) redirect('/login');
        };
        checkUser();
        fetchPaymentData();
    }, []);

    const fetchPaymentData = async () => {
        setLoading(true);

        // Fetch bookings, staff, and services to join data
        const [
            { data: bookingsData },
            { data: staffData },
            { data: servicesData }
        ] = await Promise.all([
            supabase.from('bookings').select('*').eq('status', 'Completed').order('booking_date', { ascending: false }),
            supabase.from('staff').select('*'),
            supabase.from('services').select('*')
        ]);

        if (bookingsData && staffData && servicesData) {
            const enrichedBookings = bookingsData.map(booking => {
                const staff = staffData.find(s => s.id === booking.staff_id);
                const service = servicesData.find(s => s.id === booking.service_id);
                return {
                    ...booking,
                    staff_name: staff?.name || 'Unknown',
                    service_name: service?.name || 'Unknown',
                    amount: service?.price || 0
                };
            });

            setBookings(enrichedBookings);
            const total = enrichedBookings.reduce((sum, b) => sum + b.amount, 0);
            setTotalRevenue(total);
        }

        setLoading(false);
    };

    const exportToCSV = () => {
        if (bookings.length === 0) {
            toast.error("No data to export");
            return;
        }

        const headers = ["Date", "Client", "Service", "Stylist", "Amount"];
        const rows = bookings.map(b => [
            b.booking_date,
            b.client_name,
            b.service_name,
            b.staff_name,
            `₹${b.amount}`
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);

        link.setAttribute("href", url);
        link.setAttribute("download", `SalonDost_Payments_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success("Payment history exported!");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-bold">Loading Ledger...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="p-4 lg:p-10 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="rounded-xl lg:hidden">
                            <ArrowLeft size={24} />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Payments & Billing</h1>
                        <p className="text-slate-500 font-medium mt-1">Track your daily revenue and collections</p>
                    </div>
                </div>
                <Button
                    onClick={exportToCSV}
                    className="bg-slate-900 hover:bg-black text-white h-12 px-6 rounded-xl font-bold flex gap-2 shadow-lg transition-all active:scale-95"
                >
                    <Download size={18} />
                    Export CSV
                </Button>
            </div>

            {/* Revenue Summary Card */}
            <Card className="border-none shadow-xl bg-orange-600 text-white rounded-[2rem] overflow-hidden">
                <CardContent className="p-8 md:p-12 relative overflow-hidden">
                    <div className="relative z-10">
                        <span className="text-sm font-bold uppercase tracking-widest opacity-80">Total Revenue Collected</span>
                        <div className="text-5xl md:text-7xl font-black mt-2 tracking-tighter">
                            ₹{totalRevenue.toLocaleString('en-IN')}
                        </div>
                        <div className="flex items-center gap-2 mt-6 bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-md">
                            <Calendar size={16} />
                            <span className="text-sm font-bold">Historical data across all records</span>
                        </div>
                    </div>
                    {/* Decorative element */}
                    <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                </CardContent>
            </Card>

            {/* Transactions Table */}
            <div className="space-y-4">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Recent Transactions</h2>
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="p-4 text-xs font-black uppercase text-slate-400 tracking-widest">Date</th>
                                <th className="p-4 text-xs font-black uppercase text-slate-400 tracking-widest">Client</th>
                                <th className="p-4 text-xs font-black uppercase text-slate-400 tracking-widest">Stylist</th>
                                <th className="p-4 text-xs font-black uppercase text-slate-400 tracking-widest">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {bookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-slate-900 text-sm">{booking.booking_date}</div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{booking.booking_time}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-xs font-black">
                                                {booking.client_name.charAt(0)}
                                            </div>
                                            <span className="font-bold text-slate-700 text-sm">{booking.client_name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-slate-600 text-sm">{booking.staff_name}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-black text-orange-600 text-lg">₹{booking.amount}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {bookings.length === 0 && (
                        <div className="p-20 text-center">
                            <IndianRupee className="mx-auto text-slate-200 mb-4" size={48} />
                            <p className="text-slate-500 font-bold">No completed transactions found</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
