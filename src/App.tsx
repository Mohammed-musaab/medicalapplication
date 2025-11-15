import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { supabase, Treatment, PatientCondition } from './lib/supabase';
import { hillClimbingOptimization, PatientProfile } from './lib/hillClimbing';
import { PatientForm, PatientFormData } from './components/PatientForm';
import { RecommendationResult } from './components/RecommendationResult';

type OptimizationState = {
  treatment: Treatment;
  score: number;
  iterations: number;
  scoreHistory: number[];
} | null;

function App() {
  const [conditions, setConditions] = useState<PatientCondition[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<OptimizationState>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [conditionsRes, treatmentsRes] = await Promise.all([
      supabase.from('patient_conditions').select('*').order('condition_name'),
      supabase.from('treatments').select('*').order('name'),
    ]);

    if (conditionsRes.data) setConditions(conditionsRes.data);
    if (treatmentsRes.data) setTreatments(treatmentsRes.data);
  };

  const handleSubmit = async (formData: PatientFormData) => {
    setIsLoading(true);
    setResult(null);

    try {
      const selectedCondition = conditions.find(
        (c) => c.id === formData.conditionId
      );

      if (!selectedCondition) {
        alert('Please select a valid condition');
        return;
      }

      const patientProfile: PatientProfile = {
        age: formData.age,
        conditionSeverity: selectedCondition.severity,
        allergies: formData.allergies,
        currentMedications: formData.currentMedications,
        prioritizeEffectiveness: formData.prioritizeEffectiveness,
        prioritizeSafety: formData.prioritizeSafety,
        prioritizeCost: formData.prioritizeCost,
      };

      const optimizationResult = hillClimbingOptimization(
        treatments,
        patientProfile,
        100
      );

      await supabase.from('recommendations').insert({
        patient_name: formData.patientName,
        condition_id: formData.conditionId,
        age: formData.age,
        allergies: formData.allergies,
        current_medications: formData.currentMedications,
        recommended_treatment_id: optimizationResult.treatment.id,
        optimization_score: optimizationResult.score,
        iterations: optimizationResult.iterations,
      });

      setResult(optimizationResult);
    } catch (error) {
      console.error('Error generating recommendation:', error);
      alert('Failed to generate recommendation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Activity className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Medical Treatment Optimizer
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            AI-powered treatment recommendations using Hill Climbing optimization
            algorithm to find the best treatment based on effectiveness, safety,
            and cost.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Patient Information
            </h2>
            <PatientForm
              conditions={conditions}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>

          <div>
            {result ? (
              <RecommendationResult
                treatment={result.treatment}
                score={result.score}
                iterations={result.iterations}
                scoreHistory={result.scoreHistory}
              />
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center h-full flex flex-col items-center justify-center">
                <Activity className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  No Recommendation Yet
                </h3>
                <p className="text-gray-500">
                  Fill out the patient form to get an optimized treatment
                  recommendation
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            How Hill Climbing Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-lg font-bold text-blue-900 mb-2">
                1. Initial State
              </div>
              <p className="text-gray-700 text-sm">
                Start with a random treatment from the available options
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-lg font-bold text-blue-900 mb-2">
                2. Explore Neighbors
              </div>
              <p className="text-gray-700 text-sm">
                Evaluate all alternative treatments and calculate their scores
                based on patient profile
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-lg font-bold text-blue-900 mb-2">
                3. Climb to Peak
              </div>
              <p className="text-gray-700 text-sm">
                Move to better treatment if found, repeat until no improvement
                is possible
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
