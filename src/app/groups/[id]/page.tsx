"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchGroupById, updateGroup } from "@/store/slices/groupSlice";
import { fetchExpenses, deleteExpense } from "@/store/slices/expenseSlice";
import { fetchBalances, fetchSimplifiedDebts, fetchPayments } from "@/store/slices/transactionSlice";
import { useAuth } from "@/context/AuthContext";
import { ExpenseList } from "@/components/expenses/ExpenseList";
import { ExpenseModal } from "@/components/expenses/ExpenseModal";
import { BalanceSummary } from "@/components/groups/BalanceSummary";
import { SimplifyDebts } from "@/components/groups/SimplifyDebts";
import { MemberList } from "@/components/groups/MemberList";
import { CategoryManager } from "@/components/groups/CategoryManager";
import { PaymentHistory } from "@/components/groups/PaymentHistory";
import { GROUP_TYPES, TYPE_BADGE_CLASS } from "@/utils/groupTypes";
import {
  Receipt, ArrowLeft, Plus, Users, DollarSign,
  BarChart3, Settings, Copy, Check, CreditCard,
} from "lucide-react";

type Tab = "summary" | "expenses" | "members" | "payments" | "settings";

export default function GroupDetail() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.id as string;
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const { currentGroup, isLoading } = useAppSelector((state) => state.groups);
  const { balances: allBalances, settlements } = useAppSelector((state) => state.transactions);
  const { expenses } = useAppSelector((state) => state.expenses);

  const balances = allBalances[groupId] ?? [];

  const [activeTab, setActiveTab] = useState<Tab>("summary");
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showSimplify, setShowSimplify] = useState(false);
  const [copied, setCopied] = useState(false);

  // Settings form state
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState("trip");
  const [editDescription, setEditDescription] = useState("");
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [settingsError, setSettingsError] = useState("");

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
      dispatch(fetchPayments(groupId));
    }
  }, [isAuthenticated, groupId, dispatch]);

  // Populate settings form when group loads
  useEffect(() => {
    if (currentGroup) {
      setEditName(currentGroup.name);
      setEditType(currentGroup.type ?? "trip");
      setEditDescription(currentGroup.description ?? "");
    }
  }, [currentGroup]);

  const currentMembership = currentGroup?.memberships.find((m) => m.user.id === user?.id);
  const isAdmin = currentMembership?.role === "admin";

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

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsError("");
    setSettingsSaved(false);
    try {
      await dispatch(
        updateGroup({
          id: groupId,
          name: editName,
          type: editType,
          description: editDescription || null,
        })
      ).unwrap();
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
    } catch (err: unknown) {
      setSettingsError(typeof err === "string" ? err : "Failed to save settings");
    }
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
    { key: "summary",  label: "Summary",  icon: <BarChart3 className="h-4 w-4" /> },
    { key: "expenses", label: "Expenses", icon: <DollarSign className="h-4 w-4" /> },
    { key: "members",  label: "Members",  icon: <Users className="h-4 w-4" /> },
    { key: "payments", label: "Payments", icon: <CreditCard className="h-4 w-4" /> },
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
                <div className="flex items-center gap-2 mt-0.5">
                  {currentGroup.type && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        TYPE_BADGE_CLASS[currentGroup.type] ?? TYPE_BADGE_CLASS.trip
                      }`}
                    >
                      {currentGroup.type}
                    </span>
                  )}
                  <p className="text-xs text-[#64748B]">
                    {currentGroup.currency} · {currentGroup.memberships.length} members
                  </p>
                </div>
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
            <div className="bg-white/[0.04] p-1 rounded-xl inline-flex flex-wrap gap-0.5">
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
              <ExpenseList
                expenses={expenses.slice(0, 5)}
                currentUserId={user?.id}
                isAdmin={isAdmin}
                onDelete={(id) => dispatch(deleteExpense(id))}
              />
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
            <ExpenseList
              expenses={expenses}
              currentUserId={user?.id}
              isAdmin={isAdmin}
              onDelete={(id) => dispatch(deleteExpense(id))}
            />
          </div>
        )}

        {activeTab === "members" && (
          <div className="animate-fade-in">
            <MemberList
              memberships={currentGroup.memberships}
              guestMembers={currentGroup.guestMembers ?? []}
              inviteCode={currentGroup.inviteCode}
              groupId={groupId}
              isAdmin={isAdmin}
            />
          </div>
        )}

        {activeTab === "payments" && (
          <div className="animate-fade-in">
            <PaymentHistory />
          </div>
        )}

        {activeTab === "settings" && (
          <div className="bg-[#1C1F35] border border-white/[0.08] rounded-2xl p-6 animate-fade-in">
            <h3 className="text-base font-semibold text-white mb-5">Group Settings</h3>

            {isAdmin ? (
              <>
              <form onSubmit={handleSaveSettings} className="space-y-5">
                {/* Type tiles */}
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-2">Group Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {GROUP_TYPES.map((t) => (
                      <button
                        type="button"
                        key={t.key}
                        onClick={() => setEditType(t.key)}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                          editType === t.key
                            ? "border-indigo-500 bg-indigo-500/10 text-white"
                            : "border-white/[0.08] bg-white/[0.02] text-[#94A3B8] hover:bg-white/[0.05] hover:text-white"
                        }`}
                      >
                        <t.Icon className="h-4 w-4" />
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">Group Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/[0.1] text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-sm"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">
                    Description{" "}
                    <span className="text-[#64748B] font-normal">(optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/[0.1] text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors text-sm resize-none"
                  />
                </div>

                {settingsError && (
                  <p className="text-red-400 text-sm">{settingsError}</p>
                )}
                {settingsSaved && (
                  <p className="text-emerald-400 text-sm">Changes saved.</p>
                )}

                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </form>

              <CategoryManager
                groupId={groupId}
                customCategories={currentGroup.customCategories ?? []}
              />
              </>
            ) : (
              /* Read-only for non-admins */
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-1">Group Name</label>
                  <p className="text-white text-sm">{currentGroup.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-1">Type</label>
                  <p className="text-white text-sm capitalize">{currentGroup.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-1">Currency</label>
                  <p className="text-white text-sm">{currentGroup.currency}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-1">Created By</label>
                  <p className="text-white text-sm">{currentGroup.createdBy.name}</p>
                </div>
              </div>
            )}

            {/* Always-visible section */}
            <div className="mt-6 pt-5 border-t border-white/[0.08] space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1">Invite Code</label>
                <p className="text-indigo-300 font-mono text-sm">{currentGroup.inviteCode}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1">Export</label>
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/groups/${groupId}/export`}
                  className="text-indigo-400 hover:text-indigo-300 transition-colors text-sm"
                  target="_blank"
                  rel="noreferrer"
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
          participants={[
            ...currentGroup.memberships.map((m) => ({
              id: m.user.id,
              name: m.user.name || m.user.email,
              email: m.user.email,
              type: "member" as const,
            })),
            ...(currentGroup.guestMembers ?? []).map((g) => ({
              id: g.id,
              name: g.name,
              type: "guest" as const,
            })),
          ]}
          currentUserId={user?.id || ""}
          currency={currentGroup.currency}
          customCategories={currentGroup.customCategories}
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
          onClose={() => {
            setShowSimplify(false);
            dispatch(fetchPayments(groupId));
          }}
        />
      )}
    </div>
  );
}
