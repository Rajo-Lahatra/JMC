export type ServiceLine = 'TLS' | 'GCS' | 'LT' | 'Advisory';

export type MissionStage =
  | 'opportunite'
  | 'lettre_envoyee'
  | 'lettre_signee'
  | 'staff_traitement'
  | 'revue_manager'
  | 'revue_associes'
  | 'livrable_envoye';

export type MissionStatus = 'pending' | 'active' | 'completed';

export type CollaboratorGrade = 'Partner' | 'Associate' | 'Intern';

export interface Collaborator {
  id: string;
  first_name: string;
  last_name: string;
  grade: CollaboratorGrade;
  created_at: string;
  updated_at: string;
}

export interface Mission {
  id: string;
  service: ServiceLine;
  title: string;
  client_name: string;
  description: string | null;
  stage: MissionStage;
  situation_state: string | null;
  situation_actions: string | null;
  honoraires: number;
  status: MissionStatus;
  due_date: string | null;
  partner_id: string | null;
  created_at: string;
  updated_at: string;
}
