"use client";

import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { addCustomCategory, removeCustomCategory } from "@/store/slices/groupSlice";
import type { CustomCategory } from "@/store/slices/groupSlice";
import { Plus, X } from "lucide-react";

interface CategoryManagerProps {
  groupId: string;
  customCategories: CustomCategory[];
}

export function CategoryManager({ groupId, customCategories }: CategoryManagerProps) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [color, setColor] = useState("#6366F1");
  const [error, setError] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) return;

    try {
      await dispatch(addCustomCategory({ groupId, name: name.trim(), color })).unwrap();
      setName("");
    } catch (err: unknown) {
      setError(typeof err === "string" ? err : "Failed to add category");
    }
  };

  const handleRemove = async (categoryId: string) => {
    try {
      await dispatch(removeCustomCategory({ groupId, categoryId })).unwrap();
    } catch (err: unknown) {
      setError(typeof err === "string" ? err : "Failed to remove category");
    }
  };

  return (
    <div className="mt-6 pt-5 border-t border-white/[0.08]">
      <h4 className="text-sm font-semibold text-white mb-3">Custom Categories</h4>

      {customCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {customCategories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-1.5 bg-white/[0.05] border border-white/[0.08] rounded-lg px-2.5 py-1.5"
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: cat.color || "#6366F1" }}
              />
              <span className="text-sm text-white">{cat.name}</span>
              <button
                onClick={() => handleRemove(cat.id)}
                className="text-[#64748B] hover:text-red-400 transition-colors ml-1 cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-red-400 text-xs mb-2">{error}</p>
      )}

      <form onSubmit={handleAdd} className="flex items-center gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          maxLength={50}
          className="flex-1 bg-white/[0.05] border border-white/[0.1] text-white placeholder:text-[#64748B] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-9 h-9 rounded-lg border border-white/[0.1] bg-transparent cursor-pointer shrink-0"
          title="Pick a color"
        />
        <button
          type="submit"
          disabled={!name.trim()}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-3 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
