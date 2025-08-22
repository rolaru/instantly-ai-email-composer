export interface Email {
  id: string;
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  body: string;
  created_at?: string;
  updated_at?: string;
}