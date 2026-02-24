"use client";

import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { createExpense } from "@/store/slices/expenseSlice";
import type { CustomCategory } from "@/store/slices/groupSlice";
import { X } from "lucide-react";

const BUILT_IN_CATEGORIES = [
  { value: "general", label: "General" },
  { value: "food", label: "Food" },
  { value: "transport", label: "Transport" },
  { value: "accommodation", label: "Accommodation" },
  { value: "entertainment", label: "Entertainment" },
  { value: "shopping", label: "Shopping" },
  { value: "utilities", label: "Utilities" },
  { value: "rent", label: "Rent" },
  { value: "groceries", label: "Groceries" },
  { value: "health", label: "Health" },
  { value: "education", label: "Education" },
  { value: "gifts", label: "Gifts" },
  { value: "services", label: "Services" },
  { value: "subscriptions", label: "Subscriptions" },
  { value: "other", label: "Other" },
];

export interface Participant {
  id: string;
  name: string;
  email?: string;
  type: "member" | "guest";
}

interface ExpenseModalProps {
  groupId: string;
  participants: Participant[];
  currentUserId: string;
  currency: string;
  customCategories?: CustomCategory[];
  onClose: () => void;
}

export function ExpenseModal({ groupId, participants, currentUserId, currency, customCategories = [], onClose }: ExpenseModalProps) {
  const dispatch = useAppDispatch();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [splitType, setSplitType] = useState("equal");
  const [paidById, setPaidById] = useState(currentUserId);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(participants.map((p) => p.id));
  const [splitValues, setSplitValues] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleParticipant = (id: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const paidByParticipant = participants.find((p) => p.id === paidById);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Enter a valid positive amount");
      setIsSubmitting(false);
      return;
    }

    if (selectedParticipants.length === 0) {
      setError("Select at least one person to split with");
      setIsSubmitting(false);
      return;
    }

    const splits = selectedParticipants.map((id) => {
      const p = participants.find((pp) => pp.id === id)!;
      const base = {
        value: splitType !== "equal"
        ? (parseFloat(splitValues[id] || (splitType === "share" ? "1" : "0")) || (splitType === "share" ? 1 : 0))
        : undefined,
      };
      if (p.type === "guest") {
        return { ...base, guestMemberId: id };
      }
      return { ...base, memberId: id };
    });

    // Determine payer fields
    const payerData: { payerId?: string; guestPayerId?: string } = {};
    if (paidByParticipant?.type === "guest") {
      payerData.guestPayerId = paidById;
      // payerId defaults to current user on backend (recording user)
    } else if (paidById !== currentUserId) {
      payerData.payerId = paidById;
    }

    try {
      await dispatch(
        createExpense({
          groupId,
          amount: numAmount,
          currency,
          category,
          description: description || undefined,
          splitType,
          splits,
          ...payerData,
        })
      ).unwrap();
      onClose();
    } catch (err: unknown) {
      setError(typeof err === "string" ? err : "Failed to create expense");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectStyle = { backgroundColor: "#141625" };
  const inputClass = "w-full bg-white/[0.05] border border-white/[0.1] text-white placeholder:text-[#64748B] rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-sm";

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#141625] border border-white/[0.1] rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-base font-semibold text-white">Add Expense</h3>
          <button onClick={onClose} className="text-[#64748B] hover:text-white transition-colors cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-2 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">
              Amount ({currency})
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={inputClass}
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClass}
              placeholder="What was this for?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">Paid by</label>
            <select
              value={paidById}
              onChange={(e) => setPaidById(e.target.value)}
              className={`${inputClass}`}
              style={selectStyle}
            >
              {participants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name || p.email}{p.type === "guest" ? " (Guest)" : ""}{p.id === currentUserId ? " (You)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`${inputClass}`}
              style={selectStyle}
            >
              <optgroup label="Built-in">
                {BUILT_IN_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </optgroup>
              {customCategories.length > 0 && (
                <optgroup label="Custom">
                  {customCategories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">Split Type</label>
            <select
              value={splitType}
              onChange={(e) => setSplitType(e.target.value)}
              className={`${inputClass}`}
              style={selectStyle}
            >
              <option value="equal">Equal</option>
              <option value="exact">Exact Amounts</option>
              <option value="percent">Percentage</option>
              <option value="share">Shares</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#94A3B8] mb-2">Split Between</label>
            <div className="space-y-2">
              {participants.map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedParticipants.includes(p.id)}
                    onChange={() => toggleParticipant(p.id)}
                    className="h-4 w-4 rounded border-white/[0.2] bg-white/[0.05] text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="flex-1 text-sm text-white">
                    {p.name || p.email}
                    {p.type === "guest" && (
                      <span className="text-xs text-amber-400/80 ml-1.5">(Guest)</span>
                    )}
                  </span>
                  {splitType !== "equal" && selectedParticipants.includes(p.id) && (
                    <input
                      type="number"
                      step="0.01"
                      value={splitValues[p.id] || ""}
                      onChange={(e) =>
                        setSplitValues((prev) => ({ ...prev, [p.id]: e.target.value }))
                      }
                      className="w-24 bg-white/[0.05] border border-white/[0.1] text-white placeholder:text-[#64748B] rounded-xl px-2 py-1.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      placeholder={splitType === "percent" ? "%" : splitType === "share" ? "shares" : "amount"}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Adding..." : "Add Expense"}
          </button>
        </form>
      </div>
    </div>
  );
}
