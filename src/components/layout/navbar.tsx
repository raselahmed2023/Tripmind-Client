"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Menu,
  X,
  MapPin,
  Compass,
  Route,
  Map,
  Bell,
  Shield,
  Loader2,
  CheckCheck,
} from "lucide-react";
import { Button } from "@/components/ui";
import {
  useAuth,
  useSubscription,
  useUnreadNotificationCount,
  useRecentNotifications,
  useMarkNotificationRead,
} from "@/hooks";
import { UserMenu } from "@/components/auth/user-menu";
import { CreditsDisplay } from "@/features/itinerary";
import { cn } from "@/utils";

interface NavLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const loggedOutLinks: NavLink[] = [
  { href: "/", label: "Home", icon: <MapPin className="h-4 w-4" /> },
  { href: "/explore", label: "Explore", icon: <Compass className="h-4 w-4" /> },
  { href: "/pricing", label: "Pricing", icon: <Route className="h-4 w-4" /> },
  { href: "/about", label: "About", icon: <Route className="h-4 w-4" /> },
];

const loggedInLinks: NavLink[] = [
  { href: "/dashboard", label: "Dashboard", icon: <MapPin className="h-4 w-4" /> },
  { href: "/explore", label: "Explore", icon: <Compass className="h-4 w-4" /> },
  { href: "/planner", label: "AI Trip Planner", icon: <Route className="h-4 w-4" /> },
  { href: "/trips", label: "My Trips", icon: <Map className="h-4 w-4" /> },
  { href: "/pricing", label: "Pricing", icon: <Compass className="h-4 w-4" /> },
];

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: unreadCount } = useUnreadNotificationCount();
  const { data: recentData } = useRecentNotifications(5);
  const markRead = useMarkNotificationRead();

  const recentNotifications = recentData?.data ?? [];

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open, handleClickOutside]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
  }, []);

  const handleMarkRead = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      markRead.mutate(id);
    },
    [markRead]
  );

  return (
    <div className="relative" ref={dropdownRef} onKeyDown={handleKeyDown}>
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-[var(--radius-md)] p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Bell className="h-5 w-5" />
        {unreadCount !== undefined && unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-[var(--radius-xl)] border border-slate-200 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className="text-xs text-primary-500 hover:text-primary-600 font-medium"
            >
              View All
            </Link>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {recentNotifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell className="mx-auto h-8 w-8 text-slate-300" />
                <p className="mt-2 text-sm text-slate-500">No notifications yet</p>
              </div>
            ) : (
              recentNotifications.map((notification) => {
                const notifId = notification._id;
                return (
                  <Link
                    key={notifId}
                    href={notification.link || "/notifications"}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-start gap-3 px-4 py-3 transition-colors hover:bg-slate-50",
                      !notification.read && "bg-primary-50/30"
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <p className={cn(
                        "text-sm line-clamp-1",
                        !notification.read ? "font-semibold text-slate-900" : "text-slate-700"
                      )}>
                        {notification.title}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">
                        {notification.message}
                      </p>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={(e) => handleMarkRead(notifId, e)}
                        className="mt-0.5 shrink-0 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-primary-500"
                        aria-label="Mark as read"
                      >
                        <CheckCheck className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </Link>
                );
              })
            )}
          </div>

          {recentNotifications.length > 0 && (
            <div className="border-t border-slate-100 px-4 py-2">
              <Link
                href="/notifications"
                onClick={() => setOpen(false)}
                className="block text-center text-xs font-medium text-primary-500 hover:text-primary-600"
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout, isLoggingOut } = useAuth();
  const { data: subscription } = useSubscription();
  const pathname = usePathname();

  const navLinks = isAuthenticated ? loggedInLinks : loggedOutLinks;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <MapPin className="h-6 w-6 text-primary-500" />
          <span className="text-xl font-bold text-slate-900">TripMind</span>
        </Link>

        <nav className="hidden lg:flex lg:items-center lg:gap-1" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-1.5 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-primary-50 text-primary-600"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
          {isAuthenticated && isAdmin && (
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-1.5 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-colors",
                pathname === "/admin"
                  ? "bg-accent-50 text-accent-600"
                  : "text-accent-600 hover:bg-accent-50"
              )}
            >
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          )}
        </nav>

        <div className="hidden lg:flex lg:items-center lg:gap-3">
          {isAuthenticated ? (
            <>
              {subscription && (
                <CreditsDisplay
                  remaining={subscription.aiCreditsRemaining}
                  total={subscription.aiCreditsTotal}
                />
              )}
              <NotificationBell />
              <UserMenu />
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          {isAuthenticated && <NotificationBell />}
          <button
            className="rounded-[var(--radius-sm)] p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white">
          <nav className="space-y-1 px-4 pb-4 pt-2" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-primary-50 text-primary-600"
                    : "text-slate-700 hover:bg-slate-50"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            {isAuthenticated && isAdmin && (
              <Link
                href="/admin"
                className={cn(
                  "flex items-center gap-2 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-medium transition-colors",
                  pathname === "/admin"
                    ? "bg-accent-50 text-accent-600"
                    : "text-accent-600 hover:bg-accent-50"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            )}
          </nav>

          <div className="border-t border-slate-200 px-4 pb-4 pt-2">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-500 text-sm font-medium text-white">
                      {user?.name
                        ?.split(" ")
                        .map((p) => p[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {user?.name}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {user?.email}
                    </p>
                  </div>
                </div>
                {subscription && (
                  <div className="px-3 py-1">
                    <CreditsDisplay
                      remaining={subscription.aiCreditsRemaining}
                      total={subscription.aiCreditsTotal}
                      size="sm"
                    />
                  </div>
                )}
                <div className="flex gap-2">
                  <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      Profile
                    </Button>
                  </Link>
                  <Link href="/settings" onClick={() => setMobileMenuOpen(false)} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      Settings
                    </Button>
                  </Link>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                  leftIcon={
                    isLoggingOut ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                    )
                  }
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout.mutate();
                  }}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? "Signing out..." : "Sign out"}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full">
                    Log in
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
