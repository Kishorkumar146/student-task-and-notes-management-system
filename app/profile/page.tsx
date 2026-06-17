"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const supabase = createClient();

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.push("/login");
        return;
      }
      setUser(data.user);
      setLoading(false);
    }
    loadUser();
  }, [router]);

  async function handleSignOut() {
    setSigningOut(true);
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  const initials = (user.email ?? "?").slice(0, 2).toUpperCase();
  const joinedDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="w-full max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your account details
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-semibold text-lg">
              {initials}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">
                {user.email}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Member since {joinedDate}
              </p>
            </div>
          </div>

          <div className="space-y-3 border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Email</span>
              <span className="text-slate-900 font-medium">{user.email}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">User ID</span>
              <span className="text-slate-900 font-mono text-xs">
                {user.id}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Joined</span>
              <span className="text-slate-900 font-medium">
                {joinedDate}
              </span>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="w-full py-2.5 mt-6 bg-red-50 hover:bg-red-100 disabled:opacity-60 text-red-600 text-sm font-medium rounded-lg transition-colors"
          >
            {signingOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </div>
    </div>
  );
}