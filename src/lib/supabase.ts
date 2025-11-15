import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Treatment = {
  id: string;
  name: string;
  category: string;
  effectiveness_score: number;
  side_effects_score: number;
  cost_score: number;
  description: string;
  created_at: string;
};

export type PatientCondition = {
  id: string;
  condition_name: string;
  severity: number;
  description: string;
  created_at: string;
};

export type Recommendation = {
  id: string;
  patient_name: string;
  condition_id: string;
  age: number;
  allergies: string[];
  current_medications: string[];
  recommended_treatment_id: string;
  optimization_score: number;
  iterations: number;
  created_at: string;
};
