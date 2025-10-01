// types.ts

export type ServiceLine = 'TLS' | 'GCS' | 'LT' | 'Advisory';

export type MissionStage =
  | 'opportunite'
  | 'lettre_envoyee'
  | 'lettre_signee'
  | 'staff_traitement'
  | 'revue_manager'
  | 'revue_associes'
  | 'livrable_envoye'
  | 'simple_suivi';

export type MissionStatus = 'pending' | 'active' | 'completed';

export type CollaboratorGrade =
  | 'Partner'
  | 'Manager'
  | 'Senior'
  | 'Senior Manager'
  | 'Junior'
  | 'Stagiaire';

export type FinancialInvoiceStage = 'none' | 'acompte' | 'totale' | 'solde';
export type FinancialRecoveryStage = 'none' | 'partiel' | 'total';

export type CollaboratorPreview = 
  Pick<Collaborator, 'id' | 'first_name' | 'last_name'>

export interface Collaborator {
  id: string;
  first_name: string;
  last_name: string;
  grade: CollaboratorGrade;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Mission {
  id: string;
  dossier_number: string;
  service: ServiceLine;
  title: string;
  client_name: string;
  description: string | null;
  stage: MissionStage;
  situation_state: string | null;
  situation_actions: string | null;
  billable: boolean;
  invoice_stage: FinancialInvoiceStage;
  recovery_stage: FinancialRecoveryStage;
  honoraires: number;
  invoice_amount?: number;   // ✅ ajouté
  recovery_amount?: number;  // ✅ ajouté
  status: MissionStatus;
  due_date: string | null;
  partner_id: string | null;
  created_by?: string;
  created_at: string;
  updated_at: string;
}
export type TimesheetEntry = {
  id: string
  mission_id: string
  collaborator_id: string
  date_worked: string
  hours_worked: number
  valorized?: boolean
}

