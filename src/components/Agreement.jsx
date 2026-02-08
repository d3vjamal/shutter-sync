import React from 'react';
import { Check, ShieldCheck, FileText, Info } from 'lucide-react';
import { GlassCard } from './UI';

export default function Agreement({ pkg, onAgree, agreed }) {
  if (!pkg) return null;

  return (
    <GlassCard className="p-0 overflow-hidden border-purple-500/20 shadow-2xl">
      {/* Header */}
      <div className="px-8 py-6 bg-gradient-to-r from-purple-600/10 to-indigo-600/10 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-500/20 rounded-xl text-purple-400">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Service Commitment</h2>
            <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest opacity-60">Digital Agreement • Ref: {pkg._id?.slice(-6) || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 md:p-12 space-y-10">
        {/* Intro */}
        <div className="space-y-4">
          <p className="text-lg text-white font-medium">Agreement for <span className="text-purple-400">{pkg.name}</span></p>
          {pkg.clientName && (
            <p className="text-sm text-blue-400 font-bold tracking-tight -mt-2 uppercase tracking-widest opacity-80">
              Exclusively Prepared for {pkg.clientName}
            </p>
          )}
          <p className="text-sm text-purple-200/50 leading-relaxed">
            This document serves as a binding agreement for the professional photography services described below.
            By signing, you agree to the investment and service scope outlined by <span className="text-white font-bold">{pkg.photographerName || 'the Photographer'}</span>.
          </p>
        </div>

        {/* Service Scope Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-[11px] font-black text-purple-400 uppercase tracking-widest px-1">
              <FileText size={14} />
              <span>Agreed Services</span>
            </div>
            <div className="space-y-3">
              {pkg.services?.map((service, idx) => (
                <div key={idx} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-purple-500/30 transition-all">
                  <div className="p-1 bg-emerald-500/20 text-emerald-400 rounded-full group-hover:scale-110 transition-transform">
                    <Check size={12} strokeWidth={4} />
                  </div>
                  <span className="text-sm text-white/80 group-hover:text-white transition-colors capitalize">{service}</span>
                </div>
              ))}
              {(!pkg.services || pkg.services.length === 0) && (
                <p className="text-xs text-purple-300/30 italic">No specific services listed.</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 text-[11px] font-black text-purple-400 uppercase tracking-widest px-1">
              <Info size={14} />
              <span>Financial Terms</span>
            </div>
            <div className="p-8 bg-purple-600/10 rounded-3xl border border-purple-500/20 space-y-4">
              <div>
                <p className="text-[10px] text-purple-400/60 font-bold uppercase tracking-widest">Total Valuation</p>
                <p className="text-4xl font-black text-white">₹{pkg.amount}</p>
              </div>
              <div className="pt-4 border-t border-purple-500/10 space-y-3">
                <p className="text-[11px] text-purple-200/60 leading-relaxed italic">
                  "A non-refundable deposit is required to secure the dates. Final payment is due upon delivery of the gallery."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* General T&C Simplified */}
        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">General Terms of Service</h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            {['Artist holds full copyright of session media', 'Gallery delivery within 30-45 business days', 'Travel & stay covered by client for outstation', 'Raw files delivered after full payment'].map((term, i) => (
              <li key={i} className="flex items-start gap-2 text-[11px] text-purple-200/40">
                <div className="w-1 h-1 rounded-full bg-purple-500 mt-1.5 flex-shrink-0"></div>
                <span>{term}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Signature Area */}
      <div className="p-8 bg-white/5 border-t border-white/10">
        <label className="flex items-center gap-4 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => onAgree && onAgree(e.target.checked)}
              className="checkbox-custom w-8 h-8 rounded-xl flex-shrink-0"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors uppercase tracking-tight">Authorize Signature</p>
            <p className="text-[11px] text-purple-200/40 tracking-tight leading-tight">By checking this box, I electronically sign and agree to the professional contract terms outlined above.</p>
          </div>
        </label>
      </div>
    </GlassCard>
  );
}
