"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchGroups, createGroup, joinGroup } from "@/store/slices/groupSlice";
import { useAuth } from "@/context/AuthContext";
import {
  Receipt, Users, Plus, LogOut, DollarSign,
  Calendar, CreditCard, TrendingUp, X,
} from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const { user, isLoading: authLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { groups, isLoading } = useAppSelector((state) => state.groups);
  const [greeting, setGreeting] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupCurrency, setNewGroupCurrency] = useState("USD");
  const [inviteCode, setInviteCode] = useState("");
  const [modalError, setModalError] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/signin");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchGroups());
    }
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const handleSignOut = () => {
    logout();
    router.push("/");
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");
    try {
      await dispatch(createGroup({ name: newGroupName, currency: newGroupCurrency })).unwrap();
      setShowCreateModal(false);
      setNewGroupName("");
    } catch (err: unknown) {
      setModalError(typeof err === "string" ? err : "Failed to create group");
    }
  };

  const handleJoinGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");
    try {
      await dispatch(joinGroup({ inviteCode })).unwrap();
      setShowJoinModal(false);
      setInviteCode("");
    } catch (err: unknown) {
      setModalError(typeof err === "string" ? err : "Failed to join group");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0D0F1A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#0D0F1A]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0D0F1A]/90 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Receipt className="h-7 w-7 text-indigo-400 mr-2" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                SplitBill
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-[#94A3B8]">
                {greeting},{" "}
                <span className="text-indigo-400 font-medium">{user?.name}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center text-[#94A3B8] hover:text-white transition-colors text-sm cursor-pointer"
              >
                <LogOut className="h-4 w-4 mr-1.5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-[#1C1F35] border border-white/[0.08] rounded-2xl p-6 hover:-translate-y-0.5 transition-transform duration-150">
            <div className="bg-indigo-500/10 rounded-xl p-2 w-fit mb-4">
              <Users className="h-5 w-5 text-indigo-400" />
            </div>
            <p className="text-3xl font-bold text-white">{groups.length}</p>
            <p className="text-[#94A3B8] text-sm mt-1">Active Groups</p>
          </div>
          <div className="bg-[#1C1F35] border border-white/[0.08] rounded-2xl p-6 hover:-translate-y-0.5 transition-transform duration-150">
            <div className="bg-emerald-500/10 rounded-xl p-2 w-fit mb-4">
              <DollarSign className="h-5 w-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-bold text-white">
              {groups.reduce((sum, g) => sum + (g._count?.expenses ?? 0), 0)}
            </p>
            <p className="text-[#94A3B8] text-sm mt-1">Total Expenses</p>
          </div>
          <div className="bg-[#1C1F35] border border-white/[0.08] rounded-2xl p-6 hover:-translate-y-0.5 transition-transform duration-150">
            <div className="bg-red-500/10 rounded-xl p-2 w-fit mb-4">
              <CreditCard className="h-5 w-5 text-red-400" />
            </div>
            <p className="text-3xl font-bold text-white">--</p>
            <p className="text-[#94A3B8] text-sm mt-1">You Owe</p>
          </div>
          <div className="bg-[#1C1F35] border border-white/[0.08] rounded-2xl p-6 hover:-translate-y-0.5 transition-transform duration-150">
            <div className="bg-amber-500/10 rounded-xl p-2 w-fit mb-4">
              <TrendingUp className="h-5 w-5 text-amber-400" />
            </div>
            <p className="text-3xl font-bold text-white">--</p>
            <p className="text-[#94A3B8] text-sm mt-1">Owed to You</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Groups Section */}
          <div className="lg:col-span-2">
            <div className="bg-[#1C1F35] border border-white/[0.08] rounded-2xl">
              <div className="px-6 py-4 border-b border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-white">Your Groups</h2>
                  <button
                    onClick={() => { setShowCreateModal(true); setModalError(""); }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl flex items-center text-sm font-medium transition-all cursor-pointer"
                  >
                    <Plus className="h-4 w-4 mr-1.5" />
                    Create Group
                  </button>
                </div>
              </div>
              <div className="p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                  </div>
                ) : groups.length === 0 ? (
                  <div className="text-center py-10">
                    <Users className="h-14 w-14 text-[#64748B] mx-auto mb-4" />
                    <h3 className="text-base font-medium text-white mb-2">No groups yet</h3>
                    <p className="text-[#94A3B8] text-sm mb-5">
                      Create your first group to start splitting expenses with friends.
                    </p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer"
                    >
                      Create Your First Group
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {groups.map((group) => (
                      <Link
                        key={group.id}
                        href={`/groups/${group.id}`}
                        className="bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] rounded-xl p-4 transition-all cursor-pointer block"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-white text-sm">{group.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-[#94A3B8]">{group.currency}</span>
                              <span className="text-[#64748B] text-xs">·</span>
                              <span className="text-xs bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full">
                                {group.memberships.length} members
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-[#94A3B8]">
                              {group._count?.expenses ?? 0} expenses
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-5">
            <div className="bg-[#1C1F35] border border-white/[0.08] rounded-2xl p-6">
              <h3 className="text-base font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => { setShowCreateModal(true); setModalError(""); }}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl flex items-center justify-center text-sm font-medium transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Group
                </button>
                <button
                  onClick={() => { setShowJoinModal(true); setModalError(""); }}
                  className="w-full bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] text-white p-3 rounded-xl flex items-center justify-center text-sm font-medium transition-all cursor-pointer"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Join Group
                </button>
              </div>
            </div>

            <div className="bg-[#1C1F35] border border-white/[0.08] rounded-2xl p-6">
              <h3 className="text-base font-semibold text-white mb-4">Recent Activity</h3>
              <div className="text-center py-6">
                <Calendar className="h-10 w-10 text-[#64748B] mx-auto mb-2" />
                <p className="text-sm text-[#94A3B8]">No recent activity</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#141625] border border-white/[0.1] rounded-2xl p-6 w-full max-w-md mx-4 animate-scale-in">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-semibold text-white">Create Group</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-[#64748B] hover:text-white transition-colors cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            {modalError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-2 rounded-xl mb-4 text-sm">
                {modalError}
              </div>
            )}
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">Group Name</label>
                <input
                  type="text"
                  required
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/[0.1] text-white placeholder:text-[#64748B] rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-sm"
                  placeholder="e.g., Trip to Paris"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">Currency</label>
                <select
                  value={newGroupCurrency}
                  onChange={(e) => setNewGroupCurrency(e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/[0.1] text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-sm"
                  style={{ backgroundColor: "#141625" }}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="BDT">BDT</option>
                  <option value="INR">INR</option>
                  <option value="JPY">JPY</option>
                  <option value="CAD">CAD</option>
                  <option value="AUD">AUD</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer"
              >
                Create
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Join Group Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#141625] border border-white/[0.1] rounded-2xl p-6 w-full max-w-md mx-4 animate-scale-in">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-semibold text-white">Join Group</h3>
              <button onClick={() => setShowJoinModal(false)} className="text-[#64748B] hover:text-white transition-colors cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            {modalError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-2 rounded-xl mb-4 text-sm">
                {modalError}
              </div>
            )}
            <form onSubmit={handleJoinGroup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">Invite Code</label>
                <input
                  type="text"
                  required
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/[0.1] text-white placeholder:text-[#64748B] rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-sm"
                  placeholder="Paste invite code"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer"
              >
                Join
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
