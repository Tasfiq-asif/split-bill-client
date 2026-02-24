"use client";

import { useAppSelector } from "@/store/hooks";
import { ArrowRight, CreditCard } from "lucide-react";
import type { Payment } from "@/store/slices/transactionSlice";

const METHOD_BADGE: Record<string, string> = {
  cash:   "bg-[#94A3B8]/10 text-[#94A3B8]",
  bank:   "bg-blue-500/15 text-blue-300",
  mobile: "bg-emerald-500/15 text-emerald-300",
  other:  "bg-purple-500/15 text-purple-300",
};

export function PaymentHistory() {
  const { payments, isLoading } = useAppSelector((s) => s.transactions);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="bg-[#1C1F35] border border-white/[0.08] rounded-2xl p-10 text-center">
        <CreditCard className="h-12 w-12 text-[#64748B] mx-auto mb-3" />
        <p className="text-[#94A3B8] text-sm">No payments recorded yet.</p>
        <p className="text-[#64748B] text-xs mt-1">
          Settle debts via &ldquo;Simplify Debts&rdquo; in the Summary tab.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#1C1F35] border border-white/[0.08] rounded-2xl divide-y divide-white/[0.06]">
      {payments.map((p: Payment) => (
        <div
          key={p.id}
          className="flex items-center justify-between px-5 py-4 animate-slide-up"
        >
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar initials */}
            <div className="h-9 w-9 rounded-full bg-indigo-500/15 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-indigo-300">
                {p.fromUser.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-sm text-white">
                <span className="font-medium truncate">{p.fromUser.name}</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#64748B] flex-shrink-0" />
                <span className="font-medium truncate">{p.toUser.name}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-md ${
                    METHOD_BADGE[p.method] ?? METHOD_BADGE.other
                  }`}
                >
                  {p.method}
                </span>
                {p.note && (
                  <span className="text-xs text-[#64748B] truncate">{p.note}</span>
                )}
              </div>
            </div>
          </div>
          <div className="text-right flex-shrink-0 ml-4">
            <p className="text-sm font-semibold text-emerald-400">
              {p.currency} {parseFloat(p.amount).toFixed(2)}
            </p>
            <p className="text-xs text-[#64748B] mt-0.5">
              {new Date(p.recordedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
