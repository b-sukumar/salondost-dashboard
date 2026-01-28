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

export default function Dashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [staff, setStaff] = useState<Stylist[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStaff = async () => {
    const { data } = await supabase.from('staff').select('*');
    if (data) setStaff(data);
  };

  async function fetchData() {
    setLoading(true);
    const { data: servicesData } = await supabase.from('services').select('*');
    const { data: bookingsData } = await supabase.from('bookings').select('*');
    if (servicesData) setServices(servicesData);
    if (bookingsData) setBookings(bookingsData);
    setLoading(false);
  }

  useEffect(() => {
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

    return { totalCollection, pendingBookingsCount: pendingBookings.length, pendingRevenue };
  }, [bookings, services]);

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
    <main className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 p-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-orange-600 p-2 rounded-lg">
              <Scissors className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 leading-none">SalonDost</h1>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">SalonDost Live</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/customers">
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-full"
              >
                <Users size={20} />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-full"
              onClick={() => {
                fetchStaff();
                fetchData();
              }}
            >
              <RefreshCw size={20} />
            </Button>
            <div className="bg-slate-100 px-3 py-1 rounded-full text-slate-600 font-bold text-sm">
              Jan 28, 2026
            </div>
          </div>
        </div>
      </header>

      <div className="p-4">
        {/* Stats */}
        <StatsBar
          totalCollection={stats.totalCollection}
          pendingBookings={stats.pendingBookingsCount}
          pendingRevenue={stats.pendingRevenue}
        />

        {/* Section Title */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">Queue Status</h2>
          <span className="text-sm font-medium text-slate-500">Swipe → to see more</span>
        </div>

        {/* Grid */}
        <StylistGrid
          stylists={staff}
          bookings={bookings}
          services={services}
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
