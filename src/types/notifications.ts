export interface CreateNotification {
  title: string;
  message: string;
  type: "email" | "whatsapp";
  estate_id: number | null;
  url: string;
  is_read: 0 | 1;
  created_by: number; // current user id
  roles: ("landlord" | "tenant")[]; // audience derived from select
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: "email" | "whatsapp" | "notification";
  estate_id: number | null;
  url?: string;
  is_read: 0 | 1;
  created_by: number;
  created_at: string;
  updated_at?: string;
  read_at?: string | null;
  roles?: ("landlord" | "tenant")[];
}
