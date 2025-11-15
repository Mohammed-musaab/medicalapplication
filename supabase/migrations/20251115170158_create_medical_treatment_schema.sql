/*
  # Medical Treatment Recommendation System Schema

  1. New Tables
    - `treatments`
      - `id` (uuid, primary key)
      - `name` (text) - Treatment name
      - `category` (text) - Treatment category (medication, therapy, surgery, etc.)
      - `effectiveness_score` (integer) - Base effectiveness score (0-100)
      - `side_effects_score` (integer) - Side effects severity (0-100, lower is better)
      - `cost_score` (integer) - Cost level (0-100, lower is better)
      - `description` (text) - Treatment description
      - `created_at` (timestamptz)
    
    - `patient_conditions`
      - `id` (uuid, primary key)
      - `condition_name` (text) - Medical condition name
      - `severity` (integer) - Condition severity (0-100)
      - `description` (text)
      - `created_at` (timestamptz)
    
    - `recommendations`
      - `id` (uuid, primary key)
      - `patient_name` (text) - Patient name
      - `condition_id` (uuid, foreign key to patient_conditions)
      - `age` (integer) - Patient age
      - `allergies` (text[]) - List of allergies
      - `current_medications` (text[]) - Current medications
      - `recommended_treatment_id` (uuid, foreign key to treatments)
      - `optimization_score` (numeric) - Final Hill Climbing score
      - `iterations` (integer) - Number of Hill Climbing iterations
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add public read policies for treatments and patient_conditions
    - Add authenticated user policies for recommendations
*/

CREATE TABLE IF NOT EXISTS treatments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  effectiveness_score integer NOT NULL CHECK (effectiveness_score >= 0 AND effectiveness_score <= 100),
  side_effects_score integer NOT NULL CHECK (side_effects_score >= 0 AND side_effects_score <= 100),
  cost_score integer NOT NULL CHECK (cost_score >= 0 AND cost_score <= 100),
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS patient_conditions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  condition_name text UNIQUE NOT NULL,
  severity integer NOT NULL CHECK (severity >= 0 AND severity <= 100),
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name text NOT NULL,
  condition_id uuid REFERENCES patient_conditions(id) NOT NULL,
  age integer NOT NULL CHECK (age > 0),
  allergies text[] DEFAULT '{}',
  current_medications text[] DEFAULT '{}',
  recommended_treatment_id uuid REFERENCES treatments(id) NOT NULL,
  optimization_score numeric NOT NULL,
  iterations integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view treatments"
  ON treatments FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view patient conditions"
  ON patient_conditions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view recommendations"
  ON recommendations FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create recommendations"
  ON recommendations FOR INSERT
  WITH CHECK (true);

INSERT INTO patient_conditions (condition_name, severity, description) VALUES
  ('Hypertension', 70, 'High blood pressure requiring medical intervention'),
  ('Type 2 Diabetes', 80, 'Chronic metabolic disorder affecting blood sugar levels'),
  ('Chronic Pain', 60, 'Persistent pain lasting more than 3 months'),
  ('Depression', 65, 'Mental health disorder affecting mood and behavior'),
  ('Asthma', 55, 'Respiratory condition causing breathing difficulties')
ON CONFLICT (condition_name) DO NOTHING;

INSERT INTO treatments (name, category, effectiveness_score, side_effects_score, cost_score, description) VALUES
  ('Lisinopril', 'Medication', 85, 20, 15, 'ACE inhibitor for hypertension, well-tolerated and cost-effective'),
  ('Amlodipine', 'Medication', 80, 25, 20, 'Calcium channel blocker for high blood pressure'),
  ('Metformin', 'Medication', 90, 30, 10, 'First-line medication for Type 2 Diabetes'),
  ('Insulin Therapy', 'Medication', 95, 40, 60, 'Highly effective insulin treatment for diabetes management'),
  ('Physical Therapy', 'Therapy', 75, 5, 45, 'Non-invasive treatment for chronic pain management'),
  ('Cognitive Behavioral Therapy', 'Therapy', 80, 0, 70, 'Evidence-based psychotherapy for depression'),
  ('SSRIs (Sertraline)', 'Medication', 85, 35, 25, 'Selective serotonin reuptake inhibitor for depression'),
  ('Inhaled Corticosteroids', 'Medication', 88, 15, 30, 'Controller medication for asthma'),
  ('Albuterol Inhaler', 'Medication', 75, 10, 20, 'Quick-relief medication for asthma symptoms'),
  ('Lifestyle Modification', 'Lifestyle', 70, 0, 5, 'Diet and exercise program for overall health improvement')
ON CONFLICT DO NOTHING;