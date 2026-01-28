"use client";

import { useState, useEffect } from "react";
import { User, Phone, Plus, Search, ChevronLeft, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { Customer } from "@/lib/types";
import Link from "next/link";
import { toast } from "sonner";
import { redirect } from "next/navigation";

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [newCustomer, setNewCustomer] = useState({ name: "", phone: "" });

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) redirect('/login');
        };
        checkUser();

        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('customers')
            .select('*')
            .order('name', { ascending: true });

        if (error) {
            console.error("Error fetching customers:", error);
            toast.error("Failed to load customers");
        } else {
            setCustomers(data || []);
        }
        setLoading(false);
    };

    const handleAddCustomer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCustomer.name || !newCustomer.phone) return;

        const { data, error } = await supabase
            .from('customers')
            .insert([{ name: newCustomer.name, phone: newCustomer.phone }])
            .select();

        if (error) {
            console.error("Error adding customer:", error);
            toast.error("Failed to add customer");
        } else {
            setCustomers([...customers, data[0]].sort((a, b) => a.name.localeCompare(b.name)));
            setNewCustomer({ name: "", phone: "" });
            setIsAdding(false);
            toast.success("Customer added successfully");
        }
    };

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery)
    );

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <header className="sticky top-0 bg-white border-b border-slate-200 px-4 py-4 z-40">
                <div className="flex items-center gap-4 max-w-2xl mx-auto">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ArrowLeft className="w-6 h-6 text-slate-600" />
                        </Button>
                    </Link>
                    <h1 className="text-xl font-bold text-slate-900">Customers</h1>
                    <div className="ml-auto">
                        <Button
                            onClick={() => setIsAdding(!isAdding)}
                            className="bg-orange-600 hover:bg-orange-700 rounded-full h-10 px-4"
                        >
                            <Plus className="w-5 h-5 mr-1" /> Add
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-2xl mx-auto p-4 space-y-6">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input
                        placeholder="Search name or phone..."
                        className="pl-10 h-12 bg-white border-slate-200 rounded-xl shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Add Form */}
                {isAdding && (
                    <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-lg animate-in fade-in slide-in-from-top-4 duration-200">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">New Customer</h2>
                        <form onSubmit={handleAddCustomer} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-600 flex items-center gap-2">
                                    <User size={16} /> Name
                                </label>
                                <Input
                                    placeholder="Full Name"
                                    required
                                    value={newCustomer.name}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                                    className="h-12 border-slate-200 focus:ring-orange-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-600 flex items-center gap-2">
                                    <Phone size={16} /> Phone Number
                                </label>
                                <Input
                                    placeholder="+91"
                                    type="tel"
                                    required
                                    value={newCustomer.phone}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                                    className="h-12 border-slate-200 focus:ring-orange-500"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button
                                    type="submit"
                                    className="flex-1 bg-orange-600 hover:bg-orange-700 h-12 text-lg font-bold"
                                >
                                    Save Customer
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsAdding(false)}
                                    className="h-12 px-6 border-slate-200"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Customer List */}
                <div className="space-y-3">
                    {loading ? (
                        <div className="text-center py-10 text-slate-500">Loading customers...</div>
                    ) : filteredCustomers.length > 0 ? (
                        filteredCustomers.map((customer) => (
                            <div
                                key={customer.id}
                                className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between group active:scale-[0.98] transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-lg">
                                        {customer.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">{customer.name}</h3>
                                        <p className="text-sm text-slate-500 flex items-center gap-1">
                                            <Phone size={12} /> {customer.phone}
                                        </p>
                                    </div>
                                </div>
                                <a
                                    href={`tel:${customer.phone}`}
                                    className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-orange-100 hover:text-orange-600 transition-colors"
                                >
                                    <Phone size={18} />
                                </a>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                            <User className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                            <p className="text-slate-500 font-medium">No customers found</p>
                            <Button
                                variant="link"
                                onClick={() => setIsAdding(true)}
                                className="text-orange-600"
                            >
                                Add your first client
                            </Button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
