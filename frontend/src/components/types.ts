export interface Record {
  name: string;
  email: string;
  isCertificateIssued: string;
}

export type DashboardOption = 'newEntry' | 'updateValue' | 'deleteValue' | null;
export type WriteOption = 'normal' | 'gsoc' | null;
export type GsocDashboardOption = 'initTable' | 'addValue' | 'updateValue' | 'deleteValue' | null;

export interface NormalContentNewEntryForm {
    content : string;
    addPosition: 'start' | 'end';
}

export interface UpdateForm {
  valueToUpdate: string;
  newValue: string;
  replaceAll: boolean;
}

export interface DeleteForm {
  contentToDelete: string;
}

export interface NewEntryForm {
  name: string;
  email: string;
  isCertificateIssued: string;
  addPosition: 'start' | 'end';
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