"use client";

import { useState } from "react";
import {
  Copy, Check, Shield, User, Mail, Send, CheckCircle2,
  AlertCircle, Loader2, UserRoundPlus, X,
} from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { sendGroupInvite, addGuestMember, GuestMember } from "@/store/slices/groupSlice";
import { GuestMemberRow } from "./GuestMemberRow";

interface Membership {
  id: string;
  userId: string;
  role: string;
  user: { id: string; email: string; name: string };
  joinedAt: string;
}

interface MemberListProps {
  memberships: Membership[];
  guestMembers: GuestMember[];
  inviteCode: string;
  groupId: string;
  isAdmin?: boolean;
}

export function MemberList({ memberships, guestMembers, inviteCode, groupId, isAdmin }: MemberListProps) {
  const dispatch = useAppDispatch();
  const [copied, setCopied] = useState(false);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteStatus, setInviteStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [inviteError, setInviteError] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [addStatus, setAddStatus] = useState<"idle" | "adding" | "error">("idle");
  const [addError, setAddError] = useState("");

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteStatus("sending");
    setInviteError("");
    try {
      await dispatch(sendGroupInvite({ groupId, email: inviteEmail })).unwrap();
      setInviteStatus("sent");
      setInviteEmail("");
      setTimeout(() => setInviteStatus("idle"), 4000);
    } catch (err: unknown) {
      setInviteStatus("error");
      setInviteError(typeof err === "string" ? err : "Failed to send invite");
    }
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    setAddStatus("adding");
    setAddError("");
    try {
      await dispatch(addGuestMember({ groupId, name: guestName.trim() })).unwrap();
      setGuestName("");
      setShowAddForm(false);
      setAddStatus("idle");
    } catch (err: unknown) {
      setAddStatus("error");
      setAddError(typeof err === "string" ? err : "Failed to add guest");
    }
  };

  // Members whose userId is NOT already claimed by a guest in this group
  const claimedUserIds = new Set(guestMembers.map((g) => g.claimedByUserId).filter(Boolean));
  const availableForLink = memberships
    .filter((m) => !claimedUserIds.has(m.userId))
    .map((m) => ({ userId: m.userId, name: m.user.name, email: m.user.email }));

  return (
    <div className="space-y-5">
      {/* Invite by Email — admin only */}
      {isAdmin && (
        <div className="bg-[#1C1F35] border border-white/[0.08] rounded-2xl p-6">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/15 flex items-center justify-center">
              <Mail className="h-4 w-4 text-indigo-400" />
            </div>
            <h3 className="text-base font-semibold text-white">Invite by Email</h3>
          </div>
          <p className="text-sm text-[#94A3B8] mb-4 pl-[42px]">
            Enter an email address to send them the group invite code directly.
          </p>

          <form onSubmit={handleSendInvite} className="pl-[42px]">
            <div className="flex items-center gap-2">
              <input
                type="email"
                required
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="friend@example.com"
                disabled={inviteStatus === "sending"}
                className="flex-1 bg-white/[0.05] border border-white/[0.1] text-white placeholder-[#475569] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={inviteStatus === "sending" || !inviteEmail}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap"
              >
                {inviteStatus === "sending" ? (
                  <><Loader2 className="h-4 w-4 animate-spin" />Sending…</>
                ) : (
                  <><Send className="h-4 w-4" />Send</>
                )}
              </button>
            </div>
            {inviteStatus === "sent" && (
              <div className="flex items-center gap-2 mt-3 text-sm text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Invite sent successfully.</span>
              </div>
            )}
            {inviteStatus === "error" && (
              <div className="flex items-center gap-2 mt-3 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{inviteError || "Could not send invite. Try again."}</span>
              </div>
            )}
          </form>
        </div>
      )}

      {/* Invite code section */}
      <div className="bg-[#1C1F35] border border-white/[0.08] rounded-2xl p-6">
        <h3 className="text-base font-semibold text-white mb-2">Invite Members</h3>
        <p className="text-sm text-[#94A3B8] mb-4">
          Share this invite code with friends to let them join the group.
        </p>
        <div className="flex items-center gap-2">
          <code className="flex-1 bg-white/[0.05] font-mono text-indigo-300 text-sm rounded-xl px-4 py-2">
            {inviteCode}
          </code>
          <button
            onClick={handleCopy}
            className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-all cursor-pointer"
          >
            {copied ? <Check className="h-4 w-4 mr-1.5" /> : <Copy className="h-4 w-4 mr-1.5" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Members list */}
      <div className="bg-[#1C1F35] border border-white/[0.08] rounded-2xl p-6">
        <h3 className="text-base font-semibold text-white mb-4">
          Members ({memberships.length})
        </h3>
        <div className="space-y-3">
          {memberships.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between bg-white/[0.03] border border-white/[0.06] rounded-xl p-3"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-white text-sm">{m.user.name || m.user.email}</p>
                  <p className="text-[#64748B] text-xs">{m.user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {m.role === "admin" && (
                  <span className="flex items-center text-xs text-amber-300 bg-amber-500/15 px-2 py-1 rounded-full">
                    <Shield className="h-3 w-3 mr-1" />
                    Admin
                  </span>
                )}
                <span className="text-[#64748B] text-xs">
                  {new Date(m.joinedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guest Members section */}
      <div className="bg-[#1C1F35] border border-white/[0.08] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-white">
            Guest Members ({guestMembers.length})
          </h3>
          {isAdmin && !showAddForm && (
            <button
              onClick={() => { setShowAddForm(true); setAddError(""); setAddStatus("idle"); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 transition-all cursor-pointer"
            >
              <UserRoundPlus className="h-3.5 w-3.5" />
              Add Guest
            </button>
          )}
        </div>

        {guestMembers.length === 0 && !showAddForm && (
          <p className="text-sm text-[#64748B] py-2">
            No guests yet.{isAdmin ? " Add a guest placeholder for someone without an account." : ""}
          </p>
        )}

        {guestMembers.length > 0 && (
          <div className="space-y-2 mb-4">
            {guestMembers.map((g) => (
              <GuestMemberRow
                key={g.id}
                guest={g}
                groupId={groupId}
                availableMembers={availableForLink}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}

        {/* Inline add form */}
        {isAdmin && showAddForm && (
          <form onSubmit={handleAddGuest} className="mt-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                required
                autoFocus
                value={guestName}
                onChange={(e) => { setGuestName(e.target.value); setAddError(""); setAddStatus("idle"); }}
                placeholder="Guest name…"
                maxLength={100}
                disabled={addStatus === "adding"}
                className="flex-1 bg-white/[0.05] border border-white/[0.1] text-white placeholder-[#475569] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={addStatus === "adding" || !guestName.trim()}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap"
              >
                {addStatus === "adding" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
              </button>
              <button
                type="button"
                onClick={() => { setShowAddForm(false); setGuestName(""); setAddError(""); setAddStatus("idle"); }}
                className="flex items-center justify-center h-10 w-10 text-[#64748B] hover:text-white rounded-xl transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {addStatus === "error" && (
              <div className="flex items-center gap-2 mt-3 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{addError}</span>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
