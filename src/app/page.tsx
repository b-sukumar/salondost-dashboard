"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { StatsBar } from "@/components/StatsBar";
import { StylistGrid } from "@/components/StylistGrid";
import { QuickBookFAB } from "@/components/QuickBookFAB";
import { Scissors, RefreshCw, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Booking, Stylist, Service } from "@/lib/types";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function Dashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [staff, setStaff] = useState<Stylist[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [customerCount, setCustomerCount] = useState(0);
  const [returningPhoneNumbers, setReturningPhoneNumbers] = useState<Set<string>>(new Set());
  const [retentionStats, setRetentionStats] = useState({ rate: 0, returning: 0, new: 0 });
  const [loading, setLoading] = useState(true);

  const fetchStaff = async () => {
    const { data } = await supabase.from('staff').select('*');
    if (data) setStaff(data);
  };

  async function fetchData() {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];

    // Fetch past completed bookings to identify returning customers
    const { data: pastBookings } = await supabase
      .from('bookings')
      .select('client_phone')
      .eq('status', 'Completed')
      .lt('booking_date', today);

    const pastClients = new Set(pastBookings?.map(b => b.client_phone) || []);
    setReturningPhoneNumbers(pastClients);

    const { data: servicesData } = await supabase.from('services').select('*');
    const { data: bookingsData } = await supabase.from('bookings').select('*');
    const { count } = await supabase.from('customers').select('*', { count: 'exact', head: true });

    if (servicesData) setServices(servicesData);
    if (bookingsData) {
      setBookings(bookingsData);

      // Calculate retention for today's bookings
      const todayBookings = bookingsData.filter(b => b.booking_date === today);
      if (todayBookings.length > 0) {
        const returningToday = todayBookings.filter(b => pastClients.has(b.client_phone)).length;
        const newToday = todayBookings.length - returningToday;
        const rate = Math.round((returningToday / todayBookings.length) * 100);
        setRetentionStats({ rate, returning: returningToday, new: newToday });
      } else {
        setRetentionStats({ rate: 0, returning: 0, new: 0 });
      }
    }
    if (count !== null) setCustomerCount(count);
    setLoading(false);
  }

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) redirect('/login');
    };
    checkUser();

    fetchStaff();
    fetchData();

    // Set up real-time subscription for bookings
    const subscription = supabase
      .channel('bookings_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
        fetchData(); // Simplest way to keep sync: refetch
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const stats = useMemo(() => {
    const completedBookings = bookings.filter(b => b.status === 'Completed');
    const totalCollection = completedBookings.reduce((sum, b) => {
      const service = services.find(s => s.id === b.service_id);
      return sum + (service?.price || 0);
    }, 0);

    const pendingBookings = bookings.filter(b => b.status === 'Pending');
    const pendingRevenue = pendingBookings.reduce((sum, b) => {
      const service = services.find(s => s.id === b.service_id);
      return sum + (service?.price || 0);
    }, 0);

    return {
      totalCollection,
      pendingBookingsCount: pendingBookings.length,
      pendingRevenue,
      customerCount
    };
  }, [bookings, services, customerCount]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold">Loading Khata...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="p-4 lg:p-10 max-w-7xl mx-auto">
      {/* Welcome Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Today's Overview</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your salon's daily performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-xl border-slate-200 bg-white"
            onClick={() => {
              fetchStaff();
              fetchData();
            }}
          >
            <RefreshCw size={18} className="mr-2 text-slate-500" />
            Sync Data
          </Button>
          <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-slate-600 font-bold text-sm shadow-sm">
            {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Stats */}
      <StatsBar
        totalCollection={stats.totalCollection}
        pendingRevenue={stats.pendingRevenue}
        queueCount={stats.pendingBookingsCount}
        totalClients={stats.customerCount}
        retentionRate={retentionStats.rate}
        newClientsPercent={retentionStats.returning + retentionStats.new > 0
          ? Math.round((retentionStats.new / (retentionStats.returning + retentionStats.new)) * 100)
          : 0}
      />

      {/* Content Area */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Queue Status</h2>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
            <span>Scroll Right</span>
            <div className="w-10 h-0.5 bg-slate-200 rounded-full"></div>
          </div>
        </div>

        <StylistGrid
          stylists={staff}
          bookings={bookings}
          services={services}
          returningPhoneNumbers={returningPhoneNumbers}
        />
      </div>

      {/* FAB */}
      <QuickBookFAB
        stylists={staff}
        services={services}
      />
    </main>
  );
}
