import React, { useState } from "react";
import {
  Camera,
  Check,
  ExternalLink,
  ArrowRight,
  FileText,
  CreditCard,
  ChevronLeft,
  User,
  Sparkles,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "./ui/card";
import { cn } from "../lib/utils";
import Agreement from "./Agreement";
import BookingForm from "./BookingForm";

const ClientView = ({ pkg, onBack, onInitiatePayment, agreed, setAgreed }) => {
  const [step, setStep] = useState(1); // 1: Overview, 2: Agreement, 3: Payment

  if (!pkg) return null;

  const steps = [
    { id: 1, label: "Discovery", icon: Camera },
    { id: 2, label: "Agreement", icon: FileText },
    { id: 3, label: "Reservation", icon: CreditCard },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 md:space-y-12 animate-in fade-in duration-1000">
      {/* Header / Stepper */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-4">
          {(onBack && step === 1) || step > 1 ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={step > 1 ? () => setStep(step - 1) : onBack}
              className="h-10 w-10 rounded-xl bg-muted/20 hover:bg-muted/40 transition-all active:scale-95"
            >
              <ChevronLeft size={20} className="text-primary" />
            </Button>
          ) : null}
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-foreground uppercase tracking-tight">
              {pkg.name}
            </h2>
            <p className="text-[10px] text-primary font-black tracking-[0.2em] uppercase opacity-70">
              {pkg.clientName
                ? `Exclusively curated for ${pkg.clientName}`
                : "Signature Experience Portal"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-muted/30 p-1.5 rounded-2xl border border-border/5 shadow-inner">
          {steps.map((s) => (
            <div
              key={s.id}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-500",
                step === s.id
                  ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-105"
                  : "text-muted-foreground/30",
              )}
            >
              <s.icon size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="relative">
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-8 duration-700">
            <div className="lg:col-span-2 space-y-8">
              <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-xl overflow-hidden">
                <CardHeader className="p-8 md:p-12 pb-4">
                  <div className="flex items-center gap-3 mb-6">
                    <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full">
                      Signature Collection
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-border/10 text-muted-foreground px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full"
                    >
                      Ref: {pkg._id?.slice(-6) || "N/A"}
                    </Badge>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl md:text-6xl font-black text-foreground tracking-tighter">
                        ₹{pkg.amount}
                      </span>
                    </div>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium">
                      {pkg.description}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="p-8 md:p-12 pt-8">
                  <div className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="h-px w-12 bg-primary/30"></div>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                        Experience Inclusions
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {pkg.services.map((service, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-4 p-5 bg-muted/20 rounded-2xl border border-border/5 group hover:bg-muted/40 transition-all border-l-4 border-l-transparent hover:border-l-primary/50"
                        >
                          <div className="p-1.5 bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/10 group-hover:rotate-12 transition-transform">
                            <Check size={14} strokeWidth={4} />
                          </div>
                          <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-tight">
                            {service}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-none shadow-xl bg-primary/[0.03] backdrop-blur-md p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity rotate-12 group-hover:rotate-0">
                  <Sparkles size={120} className="text-primary" />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 mb-8 ml-1">
                  Assigned Artist
                </h3>
                <div className="flex items-center gap-5 mb-10 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-2xl font-black text-primary-foreground shadow-2xl shadow-primary/20">
                    {pkg.photographerName?.charAt(0) || <User size={32} />}
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-black text-foreground tracking-tight">
                      {pkg.photographerName || "Lead Photographer"}
                    </p>
                    <p className="text-[11px] font-bold text-primary/70 uppercase tracking-widest">
                      {pkg.photographerContact}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setStep(2)}
                  className="w-full h-14 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 group relative z-10"
                >
                  Proceed to Agreement
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1.5 transition-transform"
                  />
                </Button>
              </Card>

              <div className="p-8 bg-muted/20 rounded-3xl border border-border/5 text-center flex flex-col items-center justify-center gap-4">
                <Camera size={24} className="text-primary/80" />
                <p className="text-[11px] text-primary text-foreground/50 font-medium italic leading-relaxed max-w-[200px]">
                  "We don't just take pictures, we curate visual legacies that
                  stand the test of time."
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in slide-in-from-right-8 duration-700 space-y-10">
            <Agreement
              pkg={pkg}
              onAgree={(checked) => setAgreed(checked)}
              agreed={agreed}
            />
            <div className="flex justify-end">
              <Button
                onClick={() => setStep(3)}
                disabled={!agreed}
                className="h-16 px-12 rounded-2xl flex items-center gap-4 font-black  tracking-[0.2em] text-[10px] shadow-2xl shadow-primary/20 disabled:opacity-30 disabled:grayscale transition-all hover:-translate-y-1"
              >
                Continue to Secure Reservation
                <CreditCard size={20} />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in slide-in-from-right-8 duration-700 max-w-2xl mx-auto space-y-10">
            <div className="text-center space-y-3">
              <Badge
                variant="outline"
                className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary px-6 py-2 border-primary/20 bg-primary/5 rounded-full"
              >
                Final Step
              </Badge>
              <h3 className="text-4xl font-black text-foreground  tracking-tight">
                Secure Reservation
              </h3>
              <p className="text-[11px] text-muted-foreground font-bold  tracking-widest opacity-60">
                Complete the transaction via our secure digital payment gateway
              </p>
            </div>
            <BookingForm
              config={{
                upiId: pkg.photographerUPI || "ShutterSync@upi",
                payeeName: pkg.photographerName || "ShutterSync",
                amount: pkg.amount,
                whatsappNumber: "8370993562",
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
