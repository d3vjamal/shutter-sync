import React from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function AdminDashboardPage() {
  // Fetch all photographers
  const photographers = useQuery(api.photographers.listAll);
  const toggleActive = useMutation(api.photographers.toggleActive);

  if (photographers === undefined) return <div className="p-8">Loading...</div>;
  if (!photographers) return <div className="p-8">No photographers found.</div>;

  const handleToggle = (id, current) => {
    toggleActive({ id, active: !current });
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      <div className="mb-6 flex items-center gap-4">
        <span className="text-lg font-semibold">Total Photographers:</span>
        <span className="text-2xl font-bold text-primary">
          {photographers.length}
        </span>
      </div>
      <div className="bg-card rounded-xl shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Photographer List</h3>
        <ul className="divide-y">
          {photographers.map((p) => (
            <li key={p._id} className="flex items-center justify-between py-3">
              <span className="font-medium">{p.name}</span>
              <button
                onClick={() => handleToggle(p._id, p.active)}
                className={`px-4 py-1 rounded-full text-xs font-bold border transition-colors ${p.active ? "bg-green-100 text-green-700 border-green-300" : "bg-red-100 text-red-700 border-red-300"}`}
              >
                {p.active ? "Active" : "Inactive"}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
