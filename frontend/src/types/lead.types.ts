export enum LeadStatus {
  NEW = "NEW",
  CONTACTED = "CONTACTED",
  IN_PROGRESS = "IN_PROGRESS",
  WON = "WON",
  LOST = "LOST",
}

export interface Lead {
  id: string;
  name: string;
  email?: string;
  company?: string;
  status: LeadStatus;
  value?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadsResponse {
  items: Lead[];
  total: number;
  page: number;
  lastPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface Comment {
  id: string;
  text: string;
  leadId: string;
  createdAt: string;
}

export interface LeadFormValues {
  name: string;
  email?: string;
  company?: string;
  value?: number;
  status?: string;
  notes?: string;
}
