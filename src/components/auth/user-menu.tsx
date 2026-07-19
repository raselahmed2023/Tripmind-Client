"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut, User, ChevronDown, Shield, LayoutDashboard, Settings } from "lucide-react";
import { useAuth } from "@/hooks";
import { Badge } from "@/components/ui";
import { cn } from "@/utils";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function UserMenu() {
  const { user, isAdmin, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-2 rounded-[var(--radius-md)] px-2 py-1.5 transition-colors",
          "hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
          open && "bg-slate-100"
        )}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {user.avatar ? (
          <Image
            src={user.avatar}
            alt={user.name}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-sm font-medium text-white">
            {getInitials(user.name)}
          </div>
        )}
        <span className="hidden text-sm font-medium text-slate-700 md:block">
          {user.name}
        </span>
        <ChevronDown
          className={cn(
            "hidden h-4 w-4 text-slate-400 transition-transform md:block",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-[var(--radius-lg)] border border-slate-200 bg-white py-1 shadow-lg">
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="text-sm font-medium text-slate-900">{user.name}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
            {isAdmin && (
              <Badge variant="primary" className="mt-1.5">
                <Shield className="mr-1 h-3 w-3" />
                Admin
              </Badge>
            )}
          </div>
          <div className="py-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              onClick={() => setOpen(false)}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              onClick={() => setOpen(false)}
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              onClick={() => setOpen(false)}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </div>
          <div className="border-t border-slate-100 py-1">
            <button
              onClick={() => {
                setOpen(false);
                logout.mutate();
              }}
              disabled={logout.isPending}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" />
              {logout.isPending ? "Signing out..." : "Sign out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
