import React from "react";
import type { Notification } from "../../types/notifications";

export type NotificationFilters = {
    type: "all" | Notification["type"];
};

type FiltersBarProps = {
    value: NotificationFilters;
    onChange: (next: NotificationFilters) => void;
    /** When true, shows the “across all estates” hint on the right */
    showEstateColumn?: boolean;
    /** Optional extra class names for outer wrapper */
    className?: string;
};

export default function FiltersBar({
    value,
    onChange,
    showEstateColumn = false,
    className = "",
}: FiltersBarProps) {
    return (
        <div
            className={
                "flex flex-col gap-3 md:flex-row md:items-center md:justify-between " +
                className
            }
        >
            <div className="flex items-center gap-2">
                <label htmlFor="notif-type" className="sr-only">
                    Notification type
                </label>
                <select
                    id="notif-type"
                    value={value.type}
                    onChange={(e) =>
                        onChange({
                            ...value,
                            type: e.target.value as NotificationFilters["type"],
                        })
                    }
                    className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">All types</option>
                    <option value="notification">In-App</option>
                    <option value="email">Email</option>
                    <option value="whatsapp">WhatsApp</option>
                </select>
            </div>

            {showEstateColumn && (
                <p className="text-xs text-slate-500">
                    Showing notifications across all estates.
                </p>
            )}
        </div>
    );
}
