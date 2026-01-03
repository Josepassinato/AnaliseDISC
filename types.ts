
export enum ProfileType {
  DOMINANCE = 'Dominância',
  INFLUENCE = 'Influência',
  STABILITY = 'Estabilidade',
  COMPLIANCE = 'Conformidade'
}

export interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    profile: ProfileType;
  }[];
}

export interface AssessmentResult {
  scores: Record<ProfileType, number>;
  primary: ProfileType;
  secondary: ProfileType | null;
}

export interface MinistryAffinity {
  name: string;
  percentage: number;
  reason: string;
}

export interface AIAnalysis {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  communicationStyle: string;
  leadershipStyle: string;
  idealEnvironment: string;
  careerTips: string[];
  ministryFit: MinistryAffinity[];
}
