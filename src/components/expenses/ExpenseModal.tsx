"use client";

import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { createExpense } from "@/store/slices/expenseSlice";
import { X } from "lucide-react";

interface UserRef {
  id: string;
  email: string;
  name: string;
}

interface ExpenseModalProps {
  groupId: string;
  members: UserRef[];
  currency: string;
  onClose: () => void;
}

export function ExpenseModal({ groupId, members, currency, onClose }: ExpenseModalProps) {
  const dispatch = useAppDispatch();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [splitType, setSplitType] = useState("equal");
  const [selectedMembers, setSelectedMembers] = useState<string[]>(members.map((m) => m.id));
  const [splitValues, setSplitValues] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleMember = (id: string) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

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

    if (selectedMembers.length === 0) {
      setError("Select at least one member");
      setIsSubmitting(false);
      return;
    }

    const splits = selectedMembers.map((memberId) => ({
      memberId,
      value: splitType !== "equal" ? parseFloat(splitValues[memberId] || "0") : undefined,
    }));

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
        })
      ).unwrap();
      onClose();
    } catch (err: unknown) {
      setError(typeof err === "string" ? err : "Failed to create expense");
    } finally {
      setIsSubmitting(false);
    }
  };

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
              className="w-full bg-white/[0.05] border border-white/[0.1] text-white placeholder:text-[#64748B] rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-sm"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/[0.05] border border-white/[0.1] text-white placeholder:text-[#64748B] rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-sm"
              placeholder="What was this for?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white/[0.05] border border-white/[0.1] text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-sm"
              style={{ backgroundColor: "#141625" }}
            >
              <option value="general">General</option>
              <option value="food">Food</option>
              <option value="transport">Transport</option>
              <option value="accommodation">Accommodation</option>
              <option value="activities">Activities</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">Split Type</label>
            <select
              value={splitType}
              onChange={(e) => setSplitType(e.target.value)}
              className="w-full bg-white/[0.05] border border-white/[0.1] text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-sm"
              style={{ backgroundColor: "#141625" }}
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
              {members.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(member.id)}
                    onChange={() => toggleMember(member.id)}
                    className="h-4 w-4 rounded border-white/[0.2] bg-white/[0.05] text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="flex-1 text-sm text-white">{member.name || member.email}</span>
                  {splitType !== "equal" && selectedMembers.includes(member.id) && (
                    <input
                      type="number"
                      step="0.01"
                      value={splitValues[member.id] || ""}
                      onChange={(e) =>
                        setSplitValues((prev) => ({ ...prev, [member.id]: e.target.value }))
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
