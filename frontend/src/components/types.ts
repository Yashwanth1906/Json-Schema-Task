export type WriteOption = 'normal' | 'gsoc' | null;
export type DashboardOption = 'newEntry' | 'updateValue' | 'deleteValue' | null;
export type GsocDashboardOption = 'initTable' | 'addValue' | 'updateValue' | 'deleteValue' | null;

export interface NormalContent {
  content: string;
}

export interface GsocRecord {
  username: string;
  email: string;
  isCertificateIssued: string;
}

export interface NewEntryForm {
  content: string;
  position: 'start' | 'end';
}

export interface UpdateForm {
  valueToUpdate: string;
  newValue: string;
  replaceAll: boolean;
}

export interface DeleteForm {
  contentToDelete: string;
}

export interface GsocAddForm {
  username: string;
  email: string;
  isCertificateIssued: string;
}

export interface GsocUpdateForm {
  email: string;
  updateType: 'username' | 'certificate';
  newValue: string;
}

export interface GsocDeleteForm {
  email: string;
}

export interface TableStatus {
  isInitialized: boolean;
  message: string;
} 