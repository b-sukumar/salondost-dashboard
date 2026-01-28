"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Scissors, LayoutDashboard, Users, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/" },
    { name: "Customers", icon: Users, href: "/customers" },
    { name: "Payments", icon: Scissors, href: "/payments" }, // Example
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        toast.info("Signed out successfully");
        router.push("/login");
        router.refresh();
    };

    return (
        <aside className="w-64 bg-slate-900 h-screen fixed left-0 top-0 flex flex-col text-white hidden lg:flex">
            <div className="p-6 flex items-center gap-3">
                <div className="bg-orange-600 p-2 rounded-lg">
                    <Scissors className="text-white" size={24} />
                </div>
                <h1 className="text-xl font-black tracking-tight">SalonDost</h1>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-orange-600 text-white shadow-lg shadow-orange-900/20"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <item.icon size={20} className={cn(isActive ? "text-white" : "text-slate-500 group-hover:text-white")} />
                            <span className="font-semibold text-sm">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white w-full transition-all duration-200"
                >
                    <LogOut size={20} />
                    <span className="font-semibold text-sm">Logout</span>
                </button>
            </div>
        </aside>
    );
}

export function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 h-16 flex items-center justify-around px-2 z-50">
            {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center gap-1 min-w-[64px]",
                            isActive ? "text-orange-600" : "text-slate-400"
                        )}
                    >
                        <item.icon size={20} />
                        <span className="text-[10px] font-bold uppercase tracking-tighter">{item.name}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
