"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Settings,
  Bell,
  CreditCard,
  ExternalLink,
  FileText,
  Shield,
  LogOut,
  Loader2,
} from "lucide-react";
import { Card, CardContent, Button, Alert } from "@/components/ui";
import { useAuth } from "@/hooks";

const NOTIFICATION_PREFS_KEY = "tripmind_notification_prefs";

interface NotificationPrefs {
  emailNotifications: boolean;
  pushNotifications: boolean;
  tripReminders: boolean;
  marketingEmails: boolean;
}

const defaultPrefs: NotificationPrefs = {
  emailNotifications: true,
  pushNotifications: true,
  tripReminders: true,
  marketingEmails: false,
};

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-[var(--radius-md)] border border-slate-100 p-4">
      <div>
        <p className="text-sm font-medium text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
          checked ? "bg-primary-500" : "bg-slate-200"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

function getStoredPrefs(): NotificationPrefs {
  if (typeof window === "undefined") return defaultPrefs;
  try {
    const stored = localStorage.getItem(NOTIFICATION_PREFS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return defaultPrefs;
}

export default function SettingsPage() {
  const { logout, isLoggingOut } = useAuth();
  const [prefs, setPrefs] = useState<NotificationPrefs>(getStoredPrefs);
  const [saved, setSaved] = useState(false);

  const updatePref = (key: keyof NotificationPrefs, value: boolean) => {
    const newPrefs = { ...prefs, [key]: value };
    setPrefs(newPrefs);
    setSaved(false);
    try {
      localStorage.setItem(NOTIFICATION_PREFS_KEY, JSON.stringify(newPrefs));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-slate-900">Settings</h1>

      {saved && (
        <Alert variant="success" className="mb-6">
          Settings saved locally on this device.
        </Alert>
      )}

      {/* Notification Preferences */}
      <Card className="mb-6">
        <div className="flex items-center gap-3 border-b border-slate-100 p-6">
          <Bell className="h-5 w-5 text-slate-400" />
          <div>
            <h2 className="font-semibold text-slate-900">Notification Preferences</h2>
            <p className="text-xs text-slate-500">Stored locally on this device</p>
          </div>
        </div>
        <CardContent className="space-y-3 pt-4">
          <Toggle
            label="Email Notifications"
            description="Receive trip updates and reminders via email"
            checked={prefs.emailNotifications}
            onChange={(v) => updatePref("emailNotifications", v)}
          />
          <Toggle
            label="Push Notifications"
            description="Get notified about important trip events"
            checked={prefs.pushNotifications}
            onChange={(v) => updatePref("pushNotifications", v)}
          />
          <Toggle
            label="Trip Reminders"
            description="Reminders before your trip starts"
            checked={prefs.tripReminders}
            onChange={(v) => updatePref("tripReminders", v)}
          />
          <Toggle
            label="Marketing Emails"
            description="Receive tips, offers, and product updates"
            checked={prefs.marketingEmails}
            onChange={(v) => updatePref("marketingEmails", v)}
          />
        </CardContent>
      </Card>

      {/* Account */}
      <Card className="mb-6">
        <div className="flex items-center gap-3 border-b border-slate-100 p-6">
          <Settings className="h-5 w-5 text-slate-400" />
          <h2 className="font-semibold text-slate-900">Account</h2>
        </div>
        <CardContent className="space-y-3 pt-4">
          <Link href="/billing" className="block">
            <Button variant="outline" className="w-full justify-start" leftIcon={<CreditCard className="h-4 w-4" />}>
              Billing & Subscription
              <ExternalLink className="ml-auto h-4 w-4 text-slate-400" />
            </Button>
          </Link>
          <Link href="/profile" className="block">
            <Button variant="outline" className="w-full justify-start" leftIcon={<User className="h-4 w-4" />}>
              Edit Profile
            </Button>
          </Link>
          <Button
            variant="outline"
            className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
            leftIcon={isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            onClick={() => logout.mutate()}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Signing out..." : "Sign Out"}
          </Button>
        </CardContent>
      </Card>

      {/* Legal */}
      <Card>
        <div className="flex items-center gap-3 border-b border-slate-100 p-6">
          <Shield className="h-5 w-5 text-slate-400" />
          <h2 className="font-semibold text-slate-900">Legal</h2>
        </div>
        <CardContent className="space-y-3 pt-4">
          <Link href="/privacy" className="block">
            <Button variant="ghost" className="w-full justify-start" leftIcon={<FileText className="h-4 w-4" />}>
              Privacy Policy
            </Button>
          </Link>
          <Link href="/terms" className="block">
            <Button variant="ghost" className="w-full justify-start" leftIcon={<FileText className="h-4 w-4" />}>
              Terms of Service
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

function User(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
