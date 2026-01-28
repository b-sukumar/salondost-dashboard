"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Sparkles, Image as ImageIcon, Wand2, Download, ArrowLeft, Loader2, PartyPopper, Calendar, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { redirect } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const occasions = [
    { value: "Wedding", label: "Wedding", icon: Star },
    { value: "Festive", label: "Festive", icon: PartyPopper },
    { value: "Weekend", label: "Weekend", icon: Zap },
    { value: "Anniversary", label: "Anniversary", icon: Calendar },
];

export default function MarketingPage() {
    const [occasion, setOccasion] = useState<string>("");
    const [discount, setDiscount] = useState<string>("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedPreview, setGeneratedPreview] = useState<string | null>(null);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) redirect('/login');
        };
        checkUser();
    }, []);

    const handleGenerate = () => {
        if (!occasion || !discount) {
            toast.error("Please select an occasion and enter a discount");
            return;
        }

        setIsGenerating(true);
        setGeneratedPreview(null);

        // Mock AI generation delay
        setTimeout(() => {
            setIsGenerating(false);
            setGeneratedPreview("https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=2069&auto=format&fit=crop");
            toast.success("Marketing poster generated successfully!");
        }, 3000);
    };

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
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            AI Marketing Studio <Sparkles className="text-orange-600" size={28} />
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">Create stunning posters for your salon using AI</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Campaign Creator Sidebar */}
                <Card className="lg:col-span-1 border-none shadow-xl bg-white rounded-3xl overflow-hidden p-6">
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-black text-slate-900 mb-2">Campaign Creator</h2>
                            <p className="text-sm text-slate-500">Configure your special offer details</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Occasion</label>
                                <Select onValueChange={setOccasion}>
                                    <SelectTrigger className="h-14 border-slate-200 rounded-2xl focus:ring-orange-500">
                                        <SelectValue placeholder="Select Occasion" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-slate-200">
                                        {occasions.map((occ) => (
                                            <SelectItem key={occ.value} value={occ.value} className="focus:bg-orange-50 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <occ.icon size={16} className="text-orange-600" />
                                                    {occ.label}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Discount %</label>
                                <div className="relative">
                                    <Input
                                        type="number"
                                        placeholder="e.g. 20"
                                        value={discount}
                                        onChange={(e) => setDiscount(e.target.value)}
                                        className="h-14 border-slate-200 rounded-2xl focus:ring-orange-500 pr-12"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-slate-400">%</div>
                                </div>
                            </div>

                            <Button
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                className="w-full h-14 bg-slate-900 hover:bg-black text-white font-black text-lg rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 mt-4"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        GENERATING...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 size={20} className="text-orange-400" />
                                        GENERATE POSTER
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Preview Area */}
                <Card className="lg:col-span-2 border-none shadow-xl bg-slate-50 rounded-3xl overflow-hidden min-h-[500px] flex flex-col">
                    <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                        <span className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                            <ImageIcon size={16} className="text-slate-400" /> Poster Preview
                        </span>
                        {generatedPreview && (
                            <Button variant="ghost" className="text-orange-600 font-bold flex gap-2">
                                <Download size={16} /> Download
                            </Button>
                        )}
                    </div>

                    <div className="flex-1 p-8 flex items-center justify-center relative">
                        {isGenerating ? (
                            <div className="text-center space-y-4 animate-pulse">
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto">
                                    <Wand2 size={48} className="text-orange-600 animate-bounce" />
                                </div>
                                <p className="font-black text-slate-900">AI is designing your poster...</p>
                            </div>
                        ) : generatedPreview ? (
                            <div className="relative group max-w-md w-full animate-in fade-in zoom-in duration-500">
                                <div className="absolute inset-0 bg-orange-600 blur-2xl opacity-10 group-hover:opacity-20 transition-all rounded-3xl"></div>
                                <div className="relative bg-white p-4 rounded-3xl border border-slate-100 shadow-2xl">
                                    <img
                                        src={generatedPreview}
                                        alt="Generated Poster"
                                        className="w-full h-auto rounded-2xl shadow-inner mb-4"
                                    />
                                    <div className="p-4 bg-slate-900 rounded-2xl text-white">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Limited Time Offer</p>
                                                <h3 className="text-2xl font-black">{occasion} Special</h3>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-4xl font-black text-orange-500">{discount}%</div>
                                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 text-right">Discount</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center space-y-4 text-slate-400">
                                <div className="bg-white/50 p-8 rounded-full border-2 border-dashed border-slate-200 inline-block">
                                    <ImageIcon size={48} className="opacity-20" />
                                </div>
                                <div className="max-w-xs mx-auto">
                                    <p className="font-black text-slate-300">Nothing here yet</p>
                                    <p className="text-xs font-medium mt-1 text-slate-500 uppercase tracking-wider">Fill in the campaign details and click generate to see the magic!</p>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </main>
    );
}
