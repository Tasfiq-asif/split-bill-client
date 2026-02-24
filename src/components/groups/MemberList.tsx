"use client";

import { useState } from "react";
import { Copy, Check, Shield, User } from "lucide-react";

interface Membership {
  id: string;
  userId: string;
  role: string;
  user: { id: string; email: string; name: string };
  joinedAt: string;
}

interface MemberListProps {
  memberships: Membership[];
  inviteCode: string;
}

export function MemberList({ memberships, inviteCode }: MemberListProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Invite section */}
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
    </div>
  );
}
