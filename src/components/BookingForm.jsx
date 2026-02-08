import React, { useEffect, useState } from "react";

const DEFAULT_CONFIG = {
  upiId: "ShutterSync@upi",
  payeeName: "ShutterSync",
  amount: "5000",
  whatsappNumber: "8370993562",
  mailId: "bichatrophotography@gmail.com",
};

function PhonePeLogo({ className, width = 48, height = 48, ...rest }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={width}
      height={height}
      viewBox="0 0 48 48"
      className={className}
      {...rest}
    >
      <path
        fill="#4527a0"
        d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5	V37z"
      ></path>
      <path
        fill="#fff"
        d="M32.267,20.171c0-0.681-0.584-1.264-1.264-1.264h-2.334l-5.35-6.25	c-0.486-0.584-1.264-0.778-2.043-0.584l-1.848,0.584c-0.292,0.097-0.389,0.486-0.195,0.681l5.836,5.666h-8.851	c-0.292,0-0.486,0.195-0.486,0.486v0.973c0,0.681,0.584,1.506,1.264,1.506h1.972v4.305c0,3.502,1.611,5.544,4.723,5.544	c0.973,0,1.378-0.097,2.35-0.486v3.112c0,0.875,0.681,1.556,1.556,1.556h0.786c0.292,0,0.584-0.292,0.584-0.584V21.969h2.812	c0.292,0,0.486-0.195,0.486-0.486V20.171z M26.043,28.413c-0.584,0.292-1.362,0.389-1.945,0.389c-1.556,0-2.097-0.778-2.097-2.529	v-4.305h4.043V28.413z"
      ></path>
    </svg>
  );
}

function GPayLogo({ className, width = 48, height = 48, ...rest }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={width}
      height={height}
      viewBox="0 0 48 48"
      className={className}
      {...rest}
    >
      <path
        fill="#e64a19"
        d="M42.858,11.975c-4.546-2.624-10.359-1.065-12.985,3.481L23.25,26.927	c-1.916,3.312,0.551,4.47,3.301,6.119l6.372,3.678c2.158,1.245,4.914,0.506,6.158-1.649l6.807-11.789	C48.176,19.325,46.819,14.262,42.858,11.975z"
      ></path>
      <path
        fill="#fbc02d"
        d="M35.365,16.723l-6.372-3.678c-3.517-1.953-5.509-2.082-6.954,0.214l-9.398,16.275	c-2.624,4.543-1.062,10.353,3.481,12.971c3.961,2.287,9.024,0.93,11.311-3.031l9.578-16.59	C38.261,20.727,37.523,17.968,35.365,16.723z"
      ></path>
      <path
        fill="#43a047"
        d="M36.591,8.356l-4.476-2.585c-4.95-2.857-11.28-1.163-14.137,3.787L9.457,24.317	c-1.259,2.177-0.511,4.964,1.666,6.22l5.012,2.894c2.475,1.43,5.639,0.582,7.069-1.894l9.735-16.86	c2.017-3.492,6.481-4.689,9.974-2.672L36.591,8.356z"
      ></path>
      <path
        fill="#1e88e5"
        d="M19.189,13.781l-4.838-2.787c-2.158-1.242-4.914-0.506-6.158,1.646l-5.804,10.03	c-2.857,4.936-1.163,11.252,3.787,14.101l3.683,2.121l4.467,2.573l1.939,1.115c-3.442-2.304-4.535-6.92-2.43-10.555l1.503-2.596	l5.504-9.51C22.083,17.774,21.344,15.023,19.189,13.781z"
      ></path>
    </svg>
  );
}

function PaytmLogo({ className, width = 48, height = 48, ...rest }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={width}
      height={height}
      viewBox="0 0 48 48"
      className={className}
      {...rest}
    >
      <path
        fill="#0d47a1"
        d="M5.446 18.01H.548c-.277 0-.502.167-.503.502L0 30.519c-.001.3.196.45.465.45.735 0 1.335 0 2.07 0C2.79 30.969 3 30.844 3 30.594 3 29.483 3 28.111 3 27l2.126.009c1.399-.092 2.335-.742 2.725-2.052.117-.393.14-.733.14-1.137l.11-2.862C7.999 18.946 6.949 18.181 5.446 18.01zM4.995 23.465C4.995 23.759 4.754 24 4.461 24H3v-3h1.461c.293 0 .534.24.534.535V23.465zM13.938 18h-3.423c-.26 0-.483.08-.483.351 0 .706 0 1.495 0 2.201C10.06 20.846 10.263 21 10.552 21h2.855c.594 0 .532.972 0 1H11.84C10.101 22 9 23.562 9 25.137c0 .42.005 1.406 0 1.863-.008.651-.014 1.311.112 1.899C9.336 29.939 10.235 31 11.597 31h4.228c.541 0 1.173-.474 1.173-1.101v-8.274C17.026 19.443 15.942 18.117 13.938 18zM14 27.55c0 .248-.202.45-.448.45h-1.105C12.201 28 12 27.798 12 27.55v-2.101C12 25.202 12.201 25 12.447 25h1.105C13.798 25 14 25.202 14 25.449V27.55zM18 18.594v5.608c.124 1.6 1.608 2.798 3.171 2.798h1.414c.597 0 .561.969 0 .969H19.49c-.339 0-.462.177-.462.476v2.152c0 .226.183.396.422.396h2.959c2.416 0 3.592-1.159 3.591-3.757v-8.84c0-.276-.175-.383-.342-.383h-2.302c-.224 0-.355.243-.355.422v5.218c0 .199-.111.316-.29.316H21.41c-.264 0-.409-.143-.409-.396v-5.058C21 18.218 20.88 18 20.552 18c-.778 0-1.442 0-2.22 0C18.067 18 18 18.263 18 18.594L18 18.594z"
      ></path>
      <path
        fill="#00adee"
        d="M27.038 20.569v-2.138c0-.237.194-.431.43-.431H28c1.368-.285 1.851-.62 2.688-1.522.514-.557.966-.704 1.298-.113L32 18h1.569C33.807 18 34 18.194 34 18.431v2.138C34 20.805 33.806 21 33.569 21H32v9.569C32 30.807 31.806 31 31.57 31h-2.14C29.193 31 29 30.807 29 30.569V21h-1.531C27.234 21 27.038 20.806 27.038 20.569L27.038 20.569zM42.991 30.465c0 .294-.244.535-.539.535h-1.91c-.297 0-.54-.241-.54-.535v-6.623-1.871c0-1.284-2.002-1.284-2.002 0v8.494C38 30.759 37.758 31 37.461 31H35.54C35.243 31 35 30.759 35 30.465V18.537C35 18.241 35.243 18 35.54 18h1.976c.297 0 .539.241.539.537v.292c1.32-1.266 3.302-.973 4.416.228 2.097-2.405 5.69-.262 5.523 2.375 0 2.916-.026 6.093-.026 9.033 0 .294-.244.535-.538.535h-1.891C45.242 31 45 30.759 45 30.465c0-2.786 0-5.701 0-8.44 0-1.307-2-1.37-2 0v8.44H42.991z"
      ></path>
    </svg>
  );
}

import {
  PenTool,
  FileSignature,
  QrCode,
  ChevronUp,
  ChevronDown,
  Check,
  Copy,
  Phone,
} from "lucide-react";
import { GlassCard, Input, Button } from "./UI";

export default function BookingForm({ config = DEFAULT_CONFIG, onSuccess }) {
  const [name, setName] = useState("");
  const [agree, setAgree] = useState(true); // Default true as it's checked in Agreement step
  const [enabled, setEnabled] = useState(false);
  const [showWa, setShowWa] = useState(false);
  const [waHref, setWaHref] = useState("#");
  const [loading, setLoading] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const upiUrl = `upi://pay?${new URLSearchParams({
    pa: config.upiId,
    pn: config.payeeName,
    am: config.amount,
    cu: "INR",
    tn: `Booking-${name.replace(/\s+/g, "")}`,
  }).toString()}`;

  useEffect(() => {
    setEnabled(name.trim().length > 2 && agree);
  }, [name, agree]);

  async function payVia(app) {
    setLoading(true);
    const url =
      app === "generic" ? upiUrl : upiUrl.replace("upi://", `${app}://`);

    await new Promise((r) => setTimeout(r, 700));
    if (typeof window !== "undefined") window.location.href = url;

    const text = `Hi, I am ${name}. I have just initiated the payment of ₹${config.amount} for the booking. Here is the screenshot/confirmation.`;
    setWaHref(
      `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(text)}`,
    );
    setShowWa(true);
    setLoading(false);
    if (onSuccess) onSuccess();
  }

  return (
    <GlassCard className="p-6 md:p-8 border-purple-500/20 animate-in zoom-in-95 duration-700">
      <div className="mb-6 md:mb-8">
        <label
          htmlFor="clientName"
          className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-purple-400 ml-1 mb-2 block"
        >
          Confirm Booking Name
        </label>
        <Input
          id="clientName"
          icon={PenTool}
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          className="text-lg"
          placeholder="e.g. Rahul Chatterjee"
          textOnly
          maxLength={100}
        />
      </div>

      <div className="flex justify-between items-center p-6 bg-purple-600/10 rounded-2xl border border-purple-500/20 mb-8">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-purple-400">
            Total Investment
          </p>
          <p className="text-3xl font-black text-white">₹{config.amount}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
            Status
          </p>
          <p className="text-xs font-bold text-white flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Awaiting Deposit
          </p>
        </div>
      </div>

      <div
        id="payment-section"
        className={`${enabled ? "opacity-100" : "opacity-40 pointer-events-none filter blur-[1px]"} transition-all duration-700`}
      >
        <p className="text-[10px] font-bold text-center text-purple-400/60 uppercase tracking-[0.3em] mb-6">
          Choose Payment Method
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            disabled={!enabled || loading}
            onClick={() => payVia("phonepe")}
            className="flex flex-col items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 text-white py-4 px-4 rounded-2xl font-bold transition-all duration-300 active:scale-95 group"
          >
            <PhonePeLogo className="w-8 h-8 grayscale group-hover:grayscale-0 transition-all" />
            <span className="text-[10px] uppercase tracking-widest opacity-60">
              PhonePe
            </span>
          </button>

          <button
            disabled={!enabled || loading}
            onClick={() => payVia("gpay")}
            className="flex flex-col items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 text-white py-4 px-4 rounded-2xl font-bold transition-all duration-300 active:scale-95 group"
          >
            <GPayLogo className="w-8 h-8 grayscale group-hover:grayscale-0 transition-all" />
            <span className="text-[10px] uppercase tracking-widest opacity-60">
              G-Pay
            </span>
          </button>

          <button
            disabled={!enabled || loading}
            onClick={() => payVia("paytm")}
            className="flex flex-col items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 text-white py-4 px-4 rounded-2xl font-bold transition-all duration-300 active:scale-95 group"
          >
            <PaytmLogo className="w-8 h-8 grayscale group-hover:grayscale-0 transition-all" />
            <span className="text-[10px] uppercase tracking-widest opacity-60">
              Paytm
            </span>
          </button>
        </div>

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => setShowQr(!showQr)}
            className="text-[10px] font-black text-purple-400 hover:text-purple-300 uppercase tracking-[0.3em] flex items-center gap-2 transition-colors"
          >
            {showQr ? <ChevronUp size={14} /> : <QrCode size={14} />}
            {showQr ? "Hide QR Code" : "Scan QR to Pay"}
          </button>

          {showQr && (
            <div className="p-4 bg-white rounded-3xl shadow-2xl animate-in zoom-in duration-500">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`}
                alt="UPI QR Code"
                className="w-48 h-48"
              />
              <p className="text-[10px] text-black font-bold text-center mt-2 opacity-40">
                SCAN WITH ANY UPI APP
              </p>
            </div>
          )}

          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5 mt-2">
            <span className="text-[10px] text-purple-400/50 font-mono">
              {config.upiId}
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(config.upiId);
                alert("UPI ID Copied!");
              }}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              title="Copy UPI ID"
            >
              <Copy size={14} className="text-purple-400" />
            </button>
          </div>
        </div>
      </div>

      {showWa && (
        <div
          id="whatsapp-section"
          className="text-center bg-emerald-500/10 rounded-2xl p-8 border border-emerald-500/20 animate-in slide-in-from-bottom-8 duration-500"
        >
          <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-500/20">
            <Check size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Confirm Booking</h3>
          <p className="text-sm text-purple-200/50 mb-6">
            Once payment is complete, please share the receipt screenshot on
            WhatsApp to finalize.
          </p>
          <a
            id="wa-link"
            href={waHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-emerald-600/20 transition-all hover:-translate-y-1 active:scale-95"
          >
            <Phone size={20} />
            Open WhatsApp
          </a>
        </div>
      )}
    </GlassCard>
  );
}
