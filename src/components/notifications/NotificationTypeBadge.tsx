// components/notifications/Badges.tsx
import { Bell, Mail, MessageSquare } from "lucide-react";
import type { JSX } from "react";
import type { Notification } from "../../types/notifications"; // adjust path
import { cn } from "../../utils"; // adjust path

/** Union type for the badge */
export type NotificationType = Notification["type"];

/** Optional: audience role type */
export type AudienceRole = "landlord" | "tenant";

/** A small, colored badge that represents a notification's delivery type. */
export function NotificationTypeBadge({ type }: { type: NotificationType }) {
  const map: Record<NotificationType, { icon: JSX.Element; cls: string; text: string }> = {
    email: {
      icon: <Mail className="h-3.5 w-3.5" />,
      cls: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
      text: "Email",
    },
    whatsapp: {
      icon: <MessageSquare className="h-3.5 w-3.5" />,
      cls: "bg-green-50 text-green-700 ring-1 ring-green-200",
      text: "WhatsApp",
    },
    notification: {
      icon: <Bell className="h-3.5 w-3.5" />,
      cls: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
      text: "In-App",
    },
  };

  const { icon, cls, text } = map[type];

  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium", cls)}>
      {icon}
      {text}
    </span>
  );
}

/** A small pill for audience targeting (landlord / tenant). */
export function RolePill({ role }: { role: AudienceRole }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
      {role}
    </span>
  );
}
