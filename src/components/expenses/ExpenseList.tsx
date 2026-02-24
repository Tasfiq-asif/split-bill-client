"use client";

import { DollarSign, Calendar, Trash2 } from "lucide-react";
import type { Expense } from "@/store/slices/expenseSlice";

interface ExpenseListProps {
  expenses: Expense[];
  currentUserId?: string;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

const categoryColors: Record<string, string> = {
  general: "bg-slate-500/15 text-slate-300",
  food: "bg-orange-500/15 text-orange-300",
  transport: "bg-blue-500/15 text-blue-300",
  accommodation: "bg-purple-500/15 text-purple-300",
  entertainment: "bg-emerald-500/15 text-emerald-300",
  shopping: "bg-pink-500/15 text-pink-300",
  utilities: "bg-yellow-500/15 text-yellow-300",
  rent: "bg-violet-500/15 text-violet-300",
  groceries: "bg-lime-500/15 text-lime-300",
  health: "bg-red-500/15 text-red-300",
  education: "bg-cyan-500/15 text-cyan-300",
  gifts: "bg-rose-500/15 text-rose-300",
  services: "bg-teal-500/15 text-teal-300",
  subscriptions: "bg-indigo-500/15 text-indigo-300",
  other: "bg-zinc-500/15 text-zinc-300",
};

const defaultCategoryColor = "bg-amber-500/15 text-amber-300";

export function ExpenseList({ expenses, currentUserId, isAdmin, onDelete }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-10">
        <DollarSign className="h-10 w-10 text-[#64748B] mx-auto mb-2" />
        <p className="text-[#94A3B8] text-sm">No expenses yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => {
        const payerName = expense.guestPayer
          ? `${expense.guestPayer.name} (guest)`
          : expense.payer.name;

        return (
          <div
            key={expense.id}
            className="group bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] rounded-xl p-4 transition-all animate-slide-up"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-white text-sm">
                    {expense.description || "Untitled expense"}
                  </h4>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      categoryColors[expense.category] || defaultCategoryColor
                    }`}
                  >
                    {expense.category}
                  </span>
                </div>
                <p className="text-[#94A3B8] text-sm mt-1">
                  Paid by{" "}
                  <span className="font-medium text-[#F1F5F9]">{payerName}</span>
                  {" "}·{" "}
                  Split {expense.splitType} among {expense.splits.length} people
                </p>
                <div className="flex items-center text-[#64748B] text-xs mt-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(expense.date).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <div className="text-right">
                  <p className="font-semibold text-white text-lg">
                    {expense.currency} {parseFloat(expense.amount).toFixed(2)}
                  </p>
                </div>
                {onDelete && (expense.payerId === currentUserId || isAdmin) && (
                  <button
                    onClick={() => onDelete(expense.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-[#64748B] hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
                    title="Delete expense"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
