"use client";

import { DollarSign, Calendar } from "lucide-react";
import type { Expense } from "@/store/slices/expenseSlice";

interface ExpenseListProps {
  expenses: Expense[];
}

const categoryColors: Record<string, string> = {
  food: "bg-orange-500/15 text-orange-300",
  transport: "bg-blue-500/15 text-blue-300",
  accommodation: "bg-purple-500/15 text-purple-300",
  activities: "bg-emerald-500/15 text-emerald-300",
  general: "bg-slate-500/15 text-slate-300",
};

export function ExpenseList({ expenses }: ExpenseListProps) {
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
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] rounded-xl p-4 transition-all animate-slide-up"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-white text-sm">
                  {expense.description || "Untitled expense"}
                </h4>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    categoryColors[expense.category] || categoryColors.general
                  }`}
                >
                  {expense.category}
                </span>
              </div>
              <p className="text-[#94A3B8] text-sm mt-1">
                Paid by{" "}
                <span className="font-medium text-[#F1F5F9]">{expense.payer.name}</span>
                {" "}·{" "}
                Split {expense.splitType} among {expense.splits.length} people
              </p>
              <div className="flex items-center text-[#64748B] text-xs mt-1">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(expense.date).toLocaleDateString()}
              </div>
            </div>
            <div className="text-right ml-4">
              <p className="font-semibold text-white text-lg">
                {expense.currency} {parseFloat(expense.amount).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
