// Client-facing translations: English (en) and Bengali (bn)
// Function values are called with args via t(lang, key, ...args)

export const TR = {
  en: {
    // Layout
    clientPortal: "Client Portal",
    invalidLink: "Invalid assignment link.",
    notFound: "Assignment not found.",
    paymentInitiated: "Payment initiated! We'll confirm details soon.",

    // Steps
    stepDiscovery: "Discovery",
    stepAgreement: "Agreement",
    stepReservation: "Reservation",

    // Step 1 – Overview
    signatureCollection: "Signature Collection",
    ref: "Ref",
    experienceInclusions: "Experience Inclusions",
    assignedArtist: "Assigned Artist",
    proceedAgreement: "Proceed to Agreement",
    signaturePortal: "Signature Experience Portal",
    curatedFor: (name) => `Exclusively curated for ${name}`,
    quote: `"We don't just take pictures, we curate visual legacies that stand the test of time."`,

    // Step 2 – Agreement button
    continueReservation: "Continue to Secure Reservation",

    // Step 3 – Payment header
    finalStep: "Final Step",
    secureReservation: "Secure Reservation",
    secureGateway: "Complete the transaction via our secure digital payment gateway",

    // Agreement card
    serviceCommitment: "Service Commitment",
    digitalAgreement: "Digital Service Agreement",
    servicesFor: (title) => `Professional Photography Services for ${title}`,
    reservedFor: (name) => `Reserved exclusively for ${name}`,
    bindingText: (photographer) =>
      `This document serves as a binding agreement for the professional photography services described below. By signing, you agree to the service cost and service scope outlined by ${photographer}.`,
    agreedServices: "Agreed Services",
    serviceCost: "Service Cost",
    totalValuation: "Total Valuation",
    reservationNote: `"A non refundable reservation fee is required to secure the requested dates. The remaining balance is payable upon successful delivery of the final secure gallery."`,
    termsOfService: "Terms of Service",
    authorizeSignature: "Authorize Digital Signature",
    authorizeDesc:
      "By checking this box, I electronically authenticate and authorize this commitment. I am bound by the professional terms, conditions, and financial obligations outlined in this service proposal.",
    noServices: "No specific services listed in this engagement.",

    // BookingForm
    authorizeIdentity: "Authorize Client Identity",
    enterFullName: "Enter your full name",
    packageTotal: "Package Total",
    currentStatus: "Current Status",
    awaitingDeposit: "Awaiting Deposit",
    selectAmount: "Select Payment Amount",
    amountToPay: "Amount to Pay",
    chooseGateway: "Choose Transfer Gateway",
    scanQr: "Scan Visual Terminal",
    concealQr: "Conceal QR Code",
    scanAnyUpi: "Scan with any verified UPI application",
    upiCopied: "UPI ID Copied",
    submissionRequired: "Submission Required",
    transferMsg: (name, amount, pct, full) =>
      `Hi, I am ${name}. I have just initiated the payment of ₹${amount} (${pct}% of ₹${full}) for the booking. Here is the screenshot/confirmation.`,
    transferDesc:
      "Transfer initiated. To finalize your reservation, please share a digital receipt or screenshot via our secure WhatsApp channel.",
    initWhatsapp: "Initialize WhatsApp Dispatch",
  },

  bn: {
    // Layout
    clientPortal: "ক্লায়েন্ট পোর্টাল",
    invalidLink: "অবৈধ অ্যাসাইনমেন্ট লিংক।",
    notFound: "অ্যাসাইনমেন্ট পাওয়া যায়নি।",
    paymentInitiated: "পেমেন্ট শুরু হয়েছে! শীঘ্রই নিশ্চিত করা হবে।",

    // Steps
    stepDiscovery: "বিবরণ",
    stepAgreement: "চুক্তি",
    stepReservation: "বুকিং",

    // Step 1 – Overview
    signatureCollection: "বিশেষ সংগ্রহ",
    ref: "রেফ",
    experienceInclusions: "অন্তর্ভুক্ত সেবাসমূহ",
    assignedArtist: "নিযুক্ত ফটোগ্রাফার",
    proceedAgreement: "চুক্তিতে এগিয়ে যান",
    signaturePortal: "বিশেষ অভিজ্ঞতা পোর্টাল",
    curatedFor: (name) => `${name}-এর জন্য বিশেষভাবে তৈরি`,
    quote: `"আমরা শুধু ছবি তুলি না — আমরা এমন দৃশ্যমান স্মৃতি তৈরি করি যা কালের পরীক্ষায় অটুট থাকে।"`,

    // Step 2 – Agreement button
    continueReservation: "নিরাপদ বুকিংয়ে এগিয়ে যান",

    // Step 3 – Payment header
    finalStep: "শেষ ধাপ",
    secureReservation: "নিরাপদ বুকিং",
    secureGateway:
      "আমাদের নিরাপদ ডিজিটাল পেমেন্ট গেটওয়ের মাধ্যমে পেমেন্ট সম্পন্ন করুন",

    // Agreement card
    serviceCommitment: "সেবা প্রতিশ্রুতি",
    digitalAgreement: "ডিজিটাল সেবা চুক্তি",
    servicesFor: (title) => `${title}-এর জন্য পেশাদার ফটোগ্রাফি সেবা`,
    reservedFor: (name) => `${name}-এর জন্য বিশেষভাবে সংরক্ষিত`,
    bindingText: (photographer) =>
      `এই দলিলটি নিচে বর্ণিত পেশাদার ফটোগ্রাফি সেবার জন্য একটি বাধ্যবাধক চুক্তি। স্বাক্ষর করে, আপনি ${photographer} কর্তৃক নির্ধারিত সেবার মূল্য ও পরিধিতে সম্মতি দিচ্ছেন।`,
    agreedServices: "সম্মত সেবাসমূহ",
    serviceCost: "সেবার মূল্য",
    totalValuation: "মোট মূল্য",
    reservationNote: `"তারিখ নিশ্চিত করতে একটি অফেরতযোগ্য বায়না প্রয়োজন। চূড়ান্ত ফটো গ্যালারি ডেলিভারির পর বাকি অর্থ পরিশোধ করতে হবে।"`,
    termsOfService: "সেবার শর্তাবলী",
    authorizeSignature: "ডিজিটাল স্বাক্ষর অনুমোদন",
    authorizeDesc:
      "এই বক্সে টিক দিয়ে, আমি ইলেকট্রনিকভাবে এই প্রতিশ্রুতি নিশ্চিত ও অনুমোদন করছি। এই সেবা প্রস্তাবে বর্ণিত পেশাদার শর্তাবলী ও আর্থিক বাধ্যবাধকতা মানতে আমি বাধ্য।",
    noServices: "এই চুক্তিতে কোনো নির্দিষ্ট সেবা উল্লেখ নেই।",

    // BookingForm
    authorizeIdentity: "আপনার পরিচয় নিশ্চিত করুন",
    enterFullName: "আপনার পুরো নাম লিখুন",
    packageTotal: "মোট প্যাকেজ মূল্য",
    currentStatus: "বর্তমান অবস্থা",
    awaitingDeposit: "বায়নার অপেক্ষায়",
    selectAmount: "পেমেন্টের পরিমাণ নির্বাচন করুন",
    amountToPay: "পরিশোধযোগ্য পরিমাণ",
    chooseGateway: "পেমেন্ট পদ্ধতি বেছে নিন",
    scanQr: "QR কোড স্ক্যান করুন",
    concealQr: "QR কোড লুকান",
    scanAnyUpi: "যেকোনো UPI অ্যাপ দিয়ে স্ক্যান করুন",
    upiCopied: "UPI আইডি কপি হয়েছে",
    submissionRequired: "কনফার্মেশন প্রয়োজন",
    transferMsg: (name, amount, pct, full) =>
      `আমি ${name}। বুকিং-এর জন্য ₹${amount} (₹${full}-এর ${pct}%) পেমেন্ট শুরু করেছি। স্ক্রিনশট/কনফার্মেশন সংযুক্ত।`,
    transferDesc:
      "পেমেন্ট শুরু হয়েছে। বুকিং চূড়ান্ত করতে, WhatsApp-এ পেমেন্টের স্ক্রিনশট বা রসিদ পাঠান।",
    initWhatsapp: "WhatsApp-এ পাঠান",
  },
};

/** Resolve a translation key for the given language, falling back to English. */
export function t(lang, key, ...args) {
  const dict = TR[lang] ?? TR.en;
  const val = dict[key] ?? TR.en[key] ?? key;
  return typeof val === "function" ? val(...args) : val;
}
