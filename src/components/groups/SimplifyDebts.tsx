"use client";

import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { recordPayment } from "@/store/slices/transactionSlice";
import type { Settlement } from "@/store/slices/transactionSlice";
import { X, ArrowRight, Check } from "lucide-react";

interface SimplifyDebtsProps {
  settlements: Settlement[];
  groupId: string;
  onClose: () => void;
}

export function SimplifyDebts({ settlements, groupId, onClose }: SimplifyDebtsProps) {
  const dispatch = useAppDispatch();
  const [recording, setRecording] = useState<string | null>(null);
  const [recorded, setRecorded] = useState<Set<string>>(new Set());

  const handleRecord = async (settlement: Settlement) => {
    const key = `${settlement.from.id}-${settlement.to.id}`;
    setRecording(key);
    try {
      await dispatch(
        recordPayment({
          groupId,
          toUserId: settlement.to.id,
          amount: parseFloat(settlement.amount),
        })
      ).unwrap();
      setRecorded((prev) => new Set(prev).add(key));
    } catch {
      // Error handled by redux
    } finally {
      setRecording(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#141625] border border-white/[0.1] rounded-2xl p-6 w-full max-w-md mx-4 animate-scale-in">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-base font-semibold text-white">Simplified Debts</h3>
          <button onClick={onClose} className="text-[#64748B] hover:text-white transition-colors cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        {settlements.length === 0 ? (
          <div className="text-center py-10 text-[#94A3B8] text-sm">
            Everyone is settled up!
          </div>
        ) : (
          <div className="space-y-3">
            {settlements.map((s) => {
              const key = `${s.from.id}-${s.to.id}`;
              const isRecorded = recorded.has(key);
              const isRecording = recording === key;

              return (
                <div key={key} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-sm">
                      <span className="font-medium text-white">{s.from.name}</span>
                      <ArrowRight className="h-4 w-4 mx-2 text-indigo-400" />
                      <span className="font-medium text-white">{s.to.name}</span>
                    </div>
                    <span className="text-lg font-semibold text-white">
                      {parseFloat(s.amount).toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRecord(s)}
                    disabled={isRecorded || isRecording}
                    className={`w-full text-sm py-1.5 rounded-lg transition-colors cursor-pointer ${
                      isRecorded
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-indigo-500/15 text-indigo-300 hover:bg-indigo-500/25"
                    } disabled:cursor-not-allowed`}
                  >
                    {isRecorded ? (
                      <span className="flex items-center justify-center">
                        <Check className="h-4 w-4 mr-1.5" /> Recorded
                      </span>
                    ) : isRecording ? (
                      "Recording..."
                    ) : (
                      "Record Payment"
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
