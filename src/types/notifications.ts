export interface CreateNotification {
  title: string;
  message: string;
  type: "email" | "whatsapp"; 
  estate_id: number | null;
  url: string;
  is_read: 0 | 1; 
}
