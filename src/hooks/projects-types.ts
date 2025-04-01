
export type Project = {
  id: string;
  project_id: string;
  name: string;
  status: string;
  type: string;
  isPinned: boolean;
  is_pinned: boolean;
  priority: string;
  progress: number;
  category: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  created_at?: string;
  updated_at?: string;
  team?: Array<{ name: string; initials: string; color?: string; }>;
  // New fields
  customer?: string;
  contact_person?: string;
  budget?: number;
  address?: string;
  project_name?: string;
};
