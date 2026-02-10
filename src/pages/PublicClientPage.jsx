import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ClientView from "../components/ClientView";

export default function PublicClientPage() {
  const { id } = useParams();
  // Pass id with proper format, or skip if not available
  const assignment = useQuery(api.assignments.get, id ? { id } : "skip");
  const [agreed, setAgreed] = useState(false);

  if (!id)
    return <div className="max-w-3xl mx-auto p-8">Invalid assignment ID</div>;
  if (assignment === undefined) return <LoadingSpinner />;
  if (!assignment)
    return <div className="max-w-3xl mx-auto p-8">Assignment not found</div>;

  const handlePaymentSuccess = (pkg) => {
    toast.success(
      "Payment initiated successfully! We'll confirm details soon.",
    );
  };

  return (
    <ClientView
      pkg={assignment}
      onInitiatePayment={handlePaymentSuccess}
      agreed={agreed}
      setAgreed={setAgreed}
    />
  );
}
