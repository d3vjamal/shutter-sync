import React, { useState } from 'react';
import { Camera, Check, ExternalLink, ArrowRight, FileText, CreditCard, ChevronLeft } from 'lucide-react';
import { GlassCard, Button, Badge } from './UI';
import Agreement from './Agreement';
import BookingForm from './BookingForm';

const ClientView = ({ pkg, onBack, onInitiatePayment, agreed, setAgreed }) => {
    const [step, setStep] = useState(1); // 1: Overview, 2: Agreement, 3: Payment

    if (!pkg) return null;

    const steps = [
        { id: 1, label: 'Experience', icon: Camera },
        { id: 2, label: 'Legal Audit', icon: FileText },
        { id: 3, label: 'Secure Booking', icon: CreditCard },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-10 animate-in fade-in duration-1000">
            {/* Header / Stepper */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
                <div className="flex items-center gap-3">
                    {onBack && step === 1 && (
                        <button onClick={onBack} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all active:scale-95">
                            <ChevronLeft size={18} className="text-purple-400" />
                        </button>
                    )}
                    {step > 1 && (
                        <button onClick={() => setStep(step - 1)} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all active:scale-95">
                            <ChevronLeft size={18} className="text-purple-400" />
                        </button>
                    )}
                    <div>
                        <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">{pkg.name}</h2>
                        <p className="text-[10px] text-purple-400 font-bold tracking-widest uppercase opacity-60">
                            {pkg.clientName ? `Prepared for ${pkg.clientName}` : 'Client Experience Portal'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
                    {steps.map((s) => (
                        <div key={s.id} className={`flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-xl transition-all duration-500 ${step === s.id ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-purple-200/20'}`}>
                            <s.icon size={14} className="md:w-4 md:h-4" />
                            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-tighter hidden sm:block">{s.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="relative">
                {step === 1 && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-8 duration-700">
                        <div className="lg:col-span-2 space-y-8">
                            <GlassCard className="p-6 md:p-10">
                                <header className="mb-8">
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <span className="text-4xl md:text-5xl font-black text-white">₹{pkg.amount}</span>
                                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-2 md:px-3 text-[10px]">PREMIUM ACCESS</Badge>
                                    </div>
                                    <p className="text-base md:text-lg text-purple-100/60 leading-relaxed font-light">{pkg.description}</p>
                                </header>

                                <div className="space-y-6">
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-purple-400 opacity-80">What's included in your session</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {pkg.services.map((service, idx) => (
                                            <div key={idx} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-purple-500/30 transition-all">
                                                <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-full group-hover:scale-110 transition-transform">
                                                    <Check size={14} strokeWidth={3} />
                                                </div>
                                                <span className="text-sm text-white/80 group-hover:text-white transition-colors">{service}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </GlassCard>
                        </div>

                        <div className="space-y-8">
                            <GlassCard className="p-8 border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent">
                                <h3 className="text-sm font-bold text-white mb-6">Your Artist</h3>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-xl font-bold text-white">
                                        {pkg.photographerName?.charAt(0) || 'P'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">{pkg.photographerName || 'Lead Photographer'}</p>
                                        <p className="text-xs text-purple-400">{pkg.photographerContact}</p>
                                    </div>
                                </div>
                                <Button onClick={() => setStep(2)} className="w-full py-4 rounded-xl flex items-center justify-center gap-2 group">
                                    <span>Review Agreement</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </GlassCard>

                            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 italic">
                                <p className="text-xs text-purple-200/40 text-center">"Every click is a heartbeat, every frame is a memory. Let's capture your story together."</p>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-in slide-in-from-right-8 duration-700">
                        <Agreement pkg={pkg} onAgree={() => setAgreed(true)} agreed={agreed} />
                        <div className="mt-10 flex justify-end">
                            <Button onClick={() => setStep(3)} disabled={!agreed} className="px-10 py-4 rounded-2xl flex items-center gap-3 shadow-2xl shadow-purple-600/30">
                                <span>Continue to Secure Payment</span>
                                <ArrowRight size={20} />
                            </Button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-in slide-in-from-right-8 duration-700 max-w-2xl mx-auto">
                        <div className="text-center mb-10">
                            <h3 className="text-3xl font-bold heading-font text-white mb-2">Secure Booking</h3>
                            <p className="text-sm text-purple-200/60">Finalize your slot with an instant UPI deposit</p>
                        </div>
                        <BookingForm
                            config={{
                                upiId: pkg.photographerUPI || 'ShutterSync@upi',
                                payeeName: pkg.photographerName || 'ShutterSync',
                                amount: pkg.amount,
                                whatsappNumber: '8370993562', // Keeping from original
                            }}
                            onSuccess={() => onInitiatePayment(pkg)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientView;
