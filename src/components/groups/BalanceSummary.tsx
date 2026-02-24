"use client";

import type { BalanceEntry } from "@/store/slices/transactionSlice";

interface BalanceSummaryProps {
  balances: BalanceEntry[];
  currentUserId?: string;
}

export function BalanceSummary({ balances, currentUserId }: BalanceSummaryProps) {
  if (balances.length === 0) {
    return (
      <div className="bg-[#1C1F35] border border-white/[0.08] rounded-2xl p-6 text-center text-[#94A3B8] text-sm">
        No balance data yet
      </div>
    );
  }

  return (
    <div className="bg-[#1C1F35] border border-white/[0.08] rounded-2xl p-6">
      <h3 className="text-base font-semibold text-white mb-4">Balances</h3>
      <div className="space-y-3">
        {balances.map((entry) => {
          const net = parseFloat(entry.net);
          const isCurrentUser = entry.memberId === currentUserId;

          return (
            <div
              key={entry.memberId}
              className={`flex items-center justify-between p-4 rounded-xl border ${
                isCurrentUser
                  ? "bg-indigo-500/10 border-indigo-500/20"
                  : "bg-white/[0.03] border-white/[0.06]"
              }`}
            >
              <div>
                <p className="font-medium text-white text-sm">
                  {entry.memberName}
                  {isCurrentUser && (
                    <span className="text-indigo-400 text-xs ml-2">(You)</span>
                  )}
                  {entry.isGuest && (
                    <span className="text-amber-400/80 text-xs ml-2">(Guest)</span>
                  )}
                </p>
                <p className="text-[#64748B] text-xs mt-0.5">
                  Paid: {parseFloat(entry.totalPaid).toFixed(2)} · Owes: {parseFloat(entry.totalOwed).toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`text-lg font-semibold ${
                    net > 0 ? "text-emerald-400" : net < 0 ? "text-red-400" : "text-[#64748B]"
                  }`}
                >
                  {net > 0 ? "+" : ""}
                  {net.toFixed(2)}
                </p>
                <p className="text-[#64748B] text-xs">
                  {net > 0 ? "gets back" : net < 0 ? "owes" : "settled"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
