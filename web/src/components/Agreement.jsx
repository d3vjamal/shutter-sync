import React from "react";
import { Check, ShieldCheck, FileText, Info } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { t } from "../lib/clientTranslations";

export default function Agreement({ pkg, lang = "en", onAgree, agreed }) {
  if (!pkg) return null;

  const title = pkg.title || pkg.packageName || "Photography Services";

  return (
    <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-xl overflow-hidden animate-in fade-in duration-700">
      <CardHeader className="px-8 py-8 bg-primary/[0.03] border-b border-border/5">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <ShieldCheck size={32} className="text-secondary" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-black uppercase tracking-tight text-foreground">
              {t(lang, "serviceCommitment")}
            </CardTitle>
            <CardDescription className="text-[10px] text-primary/70 font-black uppercase tracking-[0.2em]">
              {t(lang, "digitalAgreement")} • {t(lang, "ref")}: {pkg._id?.slice(-6) || "N/A"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-8 md:p-12 space-y-12">
        {/* Intro */}
        <div className="space-y-4 max-w-2xl">
          <h3 className="text-2xl font-bold tracking-tight text-foreground">
            {t(lang, "servicesFor", title)}
          </h3>
          {pkg.clientName && (
            <p className="text-[11px] text-primary font-black uppercase tracking-[0.2em] opacity-80">
              {t(lang, "reservedFor", pkg.clientName)}
            </p>
          )}
          <p className="text-sm text-muted-foreground leading-relaxed font-medium">
            {t(lang, "bindingText", pkg.photographerName || (lang === "bn" ? "ফটোগ্রাফার" : "the Photographer"))}
          </p>
        </div>

        {/* Service Scope Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.3em] px-1">
              <FileText size={16} />
              <span>{t(lang, "agreedServices")}</span>
            </div>
            <div className="space-y-3">
              {pkg.services?.map((service, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-5 bg-muted/30 rounded-2xl border border-border/5 group hover:bg-muted/50 transition-all"
                >
                  <div className="p-1 bg-primary text-primary-foreground rounded-full group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                    <Check size={12} strokeWidth={4} />
                  </div>
                  <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors capitalize">
                    {service}
                  </span>
                </div>
              ))}
              {(!pkg.services || pkg.services.length === 0) && (
                <p className="text-xs text-muted-foreground/30 italic px-2">
                  {t(lang, "noServices")}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.3em] px-1">
              <Info size={16} />
              <span>{t(lang, "serviceCost")}</span>
            </div>
            <div className="p-8 bg-primary/[0.05] rounded-3xl border border-primary/10 space-y-6 shadow-inner">
              <div className="space-y-1">
                <p className="text-[10px] text-primary/60 font-black uppercase tracking-widest ml-1">
                  {t(lang, "totalValuation")}
                </p>
                <p className="text-5xl font-black text-foreground tracking-tighter">
                  ₹{pkg.amount}
                </p>
              </div>
              <div className="pt-6 border-t border-primary/10 space-y-4">
                <p className="text-[11px] text-muted-foreground/70 leading-relaxed italic font-medium">
                  {t(lang, "reservationNote")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Terms */}
        {pkg.conditions && pkg.conditions.length > 0 && (
          <div className="p-8 bg-muted/20 rounded-2xl border border-border/5 space-y-6">
            <h4 className="text-xs font-black text-foreground uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-6 h-px bg-primary/30"></span>
              {t(lang, "termsOfService")}
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
              {pkg.conditions.map((term, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-[11px] text-muted-foreground font-semibold leading-snug"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0 animate-pulse"></div>
                  <span>{term}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-10 bg-primary/[0.03] border-t border-border/5">
        <div className="flex items-start gap-5 w-full bg-card p-6 rounded-2xl border border-border/10 shadow-lg">
          <Checkbox
            id="agreement-checkbox"
            checked={agreed}
            onCheckedChange={(checked) => onAgree && onAgree(checked === true)}
            className="w-6 h-6 rounded-lg mt-1 border-2 border-primary data-[state=checked]:bg-primary"
          />
          <div
            className="space-y-2 cursor-pointer"
            onClick={() => onAgree && onAgree(!agreed)}
          >
            <Label
              htmlFor="agreement-checkbox"
              className="text-[13px] font-black text-foreground uppercase tracking-tight cursor-pointer"
            >
              {t(lang, "authorizeSignature")}
            </Label>
            <p className="text-[11px] text-muted-foreground font-medium leading-relaxed max-w-xl">
              {t(lang, "authorizeDesc")}
            </p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
