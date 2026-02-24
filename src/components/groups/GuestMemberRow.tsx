"use client";

import { useState } from "react";
import { UserRound, Link2, X, CheckCircle2, ChevronDown, Loader2, AlertCircle } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { removeGuestMember, claimGuestMember, GuestMember } from "@/store/slices/groupSlice";

interface MemberOption {
  userId: string;
  name: string;
  email: string;
}

interface GuestMemberRowProps {
  guest: GuestMember;
  groupId: string;
  availableMembers: MemberOption[]; // real members not yet claimed
  isAdmin?: boolean;
}

export function GuestMemberRow({ guest, groupId, availableMembers, isAdmin }: GuestMemberRowProps) {
  const dispatch = useAppDispatch();

  const [linkOpen, setLinkOpen] = useState(false);
  const [linkTarget, setLinkTarget] = useState("");
  const [linkStatus, setLinkStatus] = useState<"idle" | "linking" | "error">("idle");
  const [linkError, setLinkError] = useState("");

  const [deleteStatus, setDeleteStatus] = useState<"idle" | "confirm" | "deleting">("idle");

  const handleLink = async () => {
    if (!linkTarget) return;
    setLinkStatus("linking");
    setLinkError("");
    try {
      await dispatch(claimGuestMember({ groupId, guestId: guest.id, userId: linkTarget })).unwrap();
      setLinkOpen(false);
      setLinkTarget("");
      setLinkStatus("idle");
    } catch (err: unknown) {
      setLinkStatus("error");
      setLinkError(typeof err === "string" ? err : "Failed to link guest");
    }
  };

  const handleDelete = async () => {
    if (deleteStatus === "confirm") {
      setDeleteStatus("deleting");
      try {
        await dispatch(removeGuestMember({ groupId, guestId: guest.id })).unwrap();
      } catch {
        setDeleteStatus("idle");
      }
    } else {
      setDeleteStatus("confirm");
      setTimeout(() => setDeleteStatus((s) => (s === "confirm" ? "idle" : s)), 3000);
    }
  };

  const isClaimed = !!guest.claimedByUserId;

  return (
    <div className="rounded-xl border border-dashed border-white/[0.12] bg-white/[0.02] overflow-hidden">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          {/* Dashed-ring guest avatar */}
          <div className="h-9 w-9 rounded-full border-2 border-dashed border-[#475569] flex items-center justify-center bg-[#1C1F35] shrink-0">
            <UserRound className="h-4 w-4 text-[#64748B]" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-medium text-white text-sm">{guest.name}</p>
              {!isClaimed && (
                <span className="text-xs text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-full">
                  Guest
                </span>
              )}
            </div>
            {isClaimed && guest.claimedBy && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                <p className="text-xs text-emerald-400">
                  → {guest.claimedBy.name || guest.claimedBy.email}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Admin actions — only for unclaimed guests */}
        {isAdmin && !isClaimed && (
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => {
                setLinkOpen((v) => !v);
                setLinkError("");
                setLinkTarget("");
                setLinkStatus("idle");
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 transition-all cursor-pointer"
            >
              <Link2 className="h-3 w-3" />
              Link
              <ChevronDown className={`h-3 w-3 transition-transform ${linkOpen ? "rotate-180" : ""}`} />
            </button>

            <button
              onClick={handleDelete}
              disabled={deleteStatus === "deleting"}
              title={deleteStatus === "confirm" ? "Click again to confirm" : "Remove guest"}
              className={`flex items-center justify-center h-7 w-7 rounded-lg transition-all cursor-pointer disabled:opacity-50 ${
                deleteStatus === "confirm"
                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                  : "text-[#64748B] hover:text-red-400 hover:bg-red-500/10 border border-transparent"
              }`}
            >
              {deleteStatus === "deleting" ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <X className="h-3 w-3" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Inline link picker */}
      {linkOpen && isAdmin && !isClaimed && (
        <div className="px-3 pb-3 pt-0 border-t border-white/[0.06] mt-0">
          <p className="text-xs text-[#64748B] mb-2 pt-2">
            Link <span className="text-white">&quot;{guest.name}&quot;</span> to:
          </p>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <select
                value={linkTarget}
                onChange={(e) => {
                  setLinkTarget(e.target.value);
                  setLinkError("");
                  setLinkStatus("idle");
                }}
                className="w-full appearance-none bg-white/[0.05] border border-white/[0.1] text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer pr-7"
              >
                <option value="" className="bg-[#1C1F35]">Select member…</option>
                {availableMembers.map((m) => (
                  <option key={m.userId} value={m.userId} className="bg-[#1C1F35]">
                    {m.name || m.email}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-[#64748B] pointer-events-none" />
            </div>

            <button
              onClick={handleLink}
              disabled={!linkTarget || linkStatus === "linking"}
              className="flex items-center gap-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap"
            >
              {linkStatus === "linking" ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                "Confirm"
              )}
            </button>

            <button
              onClick={() => {
                setLinkOpen(false);
                setLinkTarget("");
                setLinkError("");
                setLinkStatus("idle");
              }}
              className="px-3 py-2 text-[#64748B] hover:text-white rounded-lg text-xs transition-colors cursor-pointer whitespace-nowrap"
            >
              Cancel
            </button>
          </div>

          {linkStatus === "error" && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-red-400">
              <AlertCircle className="h-3 w-3 shrink-0" />
              <span>{linkError}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
