"use client";

import { useState } from "react";
import Link from "next/link";
import { UserCircle2, LogOut, LayoutDashboard, ChevronDown, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { AuthModal } from "@/components/auth/AuthModal";
import { cn } from "@/lib/utils";

export function AccountMenu({ compact = false }: { compact?: boolean }) {
  const { user, loading, configured, isAdmin, logout } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // If Firebase isn't configured yet, don't render an account control at all.
  if (!configured) return null;
  if (loading) {
    return <div className="h-9 w-20 animate-pulse rounded-full bg-navy/5" />;
  }

  if (!user) {
    return (
      <>
        <Button
          variant={compact ? "outline" : "ghost"}
          size="sm"
          onClick={() => setModalOpen(true)}
          className={compact ? "w-full" : ""}
        >
          <UserCircle2 />
          Sign In
        </Button>
        <AuthModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    );
  }

  const label = user.displayName || user.email?.split("@")[0] || "Account";

  if (compact) {
    return (
      <div className="flex flex-col gap-2">
        <Link href="/dashboard" className="w-full">
          <Button variant="outline" size="lg" className="w-full">
            <LayoutDashboard />
            My Applications
          </Button>
        </Link>
        {isAdmin && (
          <Link href="/admin" className="w-full">
            <Button variant="navy" size="lg" className="w-full">
              <Shield />
              Admin Panel
            </Button>
          </Link>
        )}
        <Button
          variant="ghost"
          size="lg"
          onClick={() => logout()}
          className="w-full"
        >
          <LogOut />
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full border border-navy/10 bg-white/70 py-1.5 pl-2 pr-2.5 text-sm font-semibold text-navy transition-colors hover:bg-navy/5"
      >
        <span className="grid size-6 place-items-center rounded-full bg-navy text-[11px] text-gold-300">
          {label.charAt(0).toUpperCase()}
        </span>
        <span className="max-w-[8rem] truncate">{label}</span>
        <ChevronDown
          className={cn(
            "size-3.5 text-navy/40 transition-transform",
            menuOpen && "rotate-180",
          )}
        />
      </button>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-navy/10 bg-white p-1.5 shadow-card">
            <Link
              href="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-slatebg"
            >
              <LayoutDashboard className="size-4 text-gold-600" />
              My Applications
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-slatebg"
              >
                <Shield className="size-4 text-gold-600" />
                Admin Panel
              </Link>
            )}
            <button
              onClick={() => {
                setMenuOpen(false);
                logout();
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-navy transition-colors hover:bg-slatebg"
            >
              <LogOut className="size-4 text-navy/40" />
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
