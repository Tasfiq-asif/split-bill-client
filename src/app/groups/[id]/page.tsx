"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchGroupById } from "@/store/slices/groupSlice";
import { fetchExpenses } from "@/store/slices/expenseSlice";
import { fetchBalances, fetchSimplifiedDebts } from "@/store/slices/transactionSlice";
import { useAuth } from "@/context/AuthContext";
import { ExpenseList } from "@/components/expenses/ExpenseList";
import { ExpenseModal } from "@/components/expenses/ExpenseModal";
import { BalanceSummary } from "@/components/groups/BalanceSummary";
import { SimplifyDebts } from "@/components/groups/SimplifyDebts";
import { MemberList } from "@/components/groups/MemberList";
import {
  Receipt, ArrowLeft, Plus, Users, DollarSign,
  BarChart3, Settings, Copy, Check,
} from "lucide-react";

type Tab = "summary" | "expenses" | "members" | "settings";

export default function GroupDetail() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.id as string;
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const { currentGroup, isLoading } = useAppSelector((state) => state.groups);
  const { balances, settlements } = useAppSelector((state) => state.transactions);
  const { expenses } = useAppSelector((state) => state.expenses);

  const [activeTab, setActiveTab] = useState<Tab>("summary");
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showSimplify, setShowSimplify] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/signin");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && groupId) {
      dispatch(fetchGroupById(groupId));
      dispatch(fetchExpenses(groupId));
      dispatch(fetchBalances(groupId));
    }
  }, [isAuthenticated, groupId, dispatch]);

  const handleCopyInvite = () => {
    if (currentGroup?.inviteCode) {
      navigator.clipboard.writeText(currentGroup.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSimplify = () => {
    dispatch(fetchSimplifiedDebts(groupId));
    setShowSimplify(true);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0F1A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!currentGroup) {
    return (
      <div className="min-h-screen bg-[#0D0F1A] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#94A3B8] mb-4">Group not found</p>
          <Link href="/dashboard" className="text-indigo-400 hover:text-indigo-300 transition-colors">
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "summary", label: "Summary", icon: <BarChart3 className="h-4 w-4" /> },
    { key: "expenses", label: "Expenses", icon: <DollarSign className="h-4 w-4" /> },
    { key: "members", label: "Members", icon: <Users className="h-4 w-4" /> },
    { key: "settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0D0F1A]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0D0F1A]/90 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/dashboard" className="mr-3 text-[#64748B] hover:text-white transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <Receipt className="h-5 w-5 text-indigo-400 mr-2" />
              <div>
                <h1 className="text-base font-bold text-white">{currentGroup.name}</h1>
                <p className="text-xs text-[#64748B]">
                  {currentGroup.currency} · {currentGroup.memberships.length} members
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleCopyInvite}
                className="flex items-center text-sm text-[#94A3B8] hover:text-white border border-white/[0.08] hover:border-white/[0.15] px-3 py-1.5 rounded-xl transition-all cursor-pointer"
              >
                {copied ? <Check className="h-4 w-4 mr-1.5 text-emerald-400" /> : <Copy className="h-4 w-4 mr-1.5" />}
                {copied ? "Copied!" : "Invite Code"}
              </button>
              <button
                onClick={() => setShowExpenseModal(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl flex items-center text-sm font-medium transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Add Expense
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="pb-3">
            <div className="bg-white/[0.04] p-1 rounded-xl inline-flex">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center px-4 py-1.5 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                    activeTab === tab.key
                      ? "bg-indigo-600 text-white"
                      : "text-[#94A3B8] hover:text-white"
                  }`}
                >
                  <span className="mr-1.5">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8">
        {activeTab === "summary" && (
          <div className="space-y-6 animate-fade-in">
            <BalanceSummary balances={balances} currentUserId={user?.id} />
            <div className="flex justify-center">
              <button
                onClick={handleSimplify}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.4)]"
              >
                Simplify Debts
              </button>
            </div>
            <div className="bg-[#1C1F35] border border-white/[0.08] rounded-2xl p-6">
              <h3 className="text-base font-semibold text-white mb-4">Recent Expenses</h3>
              <ExpenseList expenses={expenses.slice(0, 5)} />
              {expenses.length > 5 && (
                <button
                  onClick={() => setActiveTab("expenses")}
                  className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm transition-colors cursor-pointer"
                >
                  View all {expenses.length} expenses
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === "expenses" && (
          <div className="bg-[#1C1F35] border border-white/[0.08] rounded-2xl p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-semibold text-white">All Expenses</h3>
              <button
                onClick={() => setShowExpenseModal(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl flex items-center text-sm font-medium transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Add Expense
              </button>
            </div>
            <ExpenseList expenses={expenses} />
          </div>
        )}

        {activeTab === "members" && (
          <div className="animate-fade-in">
            <MemberList
              memberships={currentGroup.memberships}
              inviteCode={currentGroup.inviteCode}
            />
          </div>
        )}

        {activeTab === "settings" && (
          <div className="bg-[#1C1F35] border border-white/[0.08] rounded-2xl p-6 animate-fade-in">
            <h3 className="text-base font-semibold text-white mb-5">Group Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1">Group Name</label>
                <p className="text-white text-sm">{currentGroup.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1">Currency</label>
                <p className="text-white text-sm">{currentGroup.currency}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1">Invite Code</label>
                <p className="text-indigo-300 font-mono text-sm">{currentGroup.inviteCode}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1">Created By</label>
                <p className="text-white text-sm">{currentGroup.createdBy.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1">Export</label>
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/groups/${groupId}/export`}
                  className="text-indigo-400 hover:text-indigo-300 transition-colors text-sm"
                  target="_blank"
                >
                  Download expenses as CSV
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {showExpenseModal && (
        <ExpenseModal
          groupId={groupId}
          members={currentGroup.memberships.map((m) => m.user)}
          currency={currentGroup.currency}
          onClose={() => {
            setShowExpenseModal(false);
            dispatch(fetchBalances(groupId));
          }}
        />
      )}

      {showSimplify && (
        <SimplifyDebts
          settlements={settlements}
          groupId={groupId}
          onClose={() => setShowSimplify(false)}
        />
      )}
    </div>
  );
}
