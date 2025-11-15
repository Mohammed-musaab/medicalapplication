import { useState, useEffect } from 'react';
import { PatientCondition } from '../lib/supabase';

type PatientFormProps = {
  conditions: PatientCondition[];
  onSubmit: (data: PatientFormData) => void;
  isLoading: boolean;
};

export type PatientFormData = {
  patientName: string;
  conditionId: string;
  age: number;
  allergies: string[];
  currentMedications: string[];
  prioritizeEffectiveness: boolean;
  prioritizeSafety: boolean;
  prioritizeCost: boolean;
};

export function PatientForm({ conditions, onSubmit, isLoading }: PatientFormProps) {
  const [formData, setFormData] = useState<PatientFormData>({
    patientName: '',
    conditionId: '',
    age: 30,
    allergies: [],
    currentMedications: [],
    prioritizeEffectiveness: true,
    prioritizeSafety: false,
    prioritizeCost: false,
  });

  const [allergyInput, setAllergyInput] = useState('');
  const [medicationInput, setMedicationInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addAllergy = () => {
    if (allergyInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        allergies: [...prev.allergies, allergyInput.trim()],
      }));
      setAllergyInput('');
    }
  };

  const removeAllergy = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index),
    }));
  };

  const addMedication = () => {
    if (medicationInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        currentMedications: [...prev.currentMedications, medicationInput.trim()],
      }));
      setMedicationInput('');
    }
  };

  const removeMedication = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      currentMedications: prev.currentMedications.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Patient Name
        </label>
        <input
          type="text"
          required
          value={formData.patientName}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, patientName: e.target.value }))
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter patient name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Medical Condition
        </label>
        <select
          required
          value={formData.conditionId}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, conditionId: e.target.value }))
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select a condition</option>
          {conditions.map((condition) => (
            <option key={condition.id} value={condition.id}>
              {condition.condition_name} (Severity: {condition.severity})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Age
        </label>
        <input
          type="number"
          required
          min="1"
          max="120"
          value={formData.age}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, age: parseInt(e.target.value) }))
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Allergies
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={allergyInput}
            onChange={(e) => setAllergyInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Add allergy"
          />
          <button
            type="button"
            onClick={addAllergy}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.allergies.map((allergy, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm flex items-center gap-2"
            >
              {allergy}
              <button
                type="button"
                onClick={() => removeAllergy(index)}
                className="hover:text-red-900"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Medications
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={medicationInput}
            onChange={(e) => setMedicationInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMedication())}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Add medication"
          />
          <button
            type="button"
            onClick={addMedication}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.currentMedications.map((medication, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
            >
              {medication}
              <button
                type="button"
                onClick={() => removeMedication(index)}
                className="hover:text-blue-900"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Treatment Priorities
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.prioritizeEffectiveness}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  prioritizeEffectiveness: e.target.checked,
                }))
              }
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm text-gray-700">Prioritize Effectiveness</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.prioritizeSafety}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  prioritizeSafety: e.target.checked,
                }))
              }
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm text-gray-700">Prioritize Safety</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.prioritizeCost}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  prioritizeCost: e.target.checked,
                }))
              }
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm text-gray-700">Prioritize Low Cost</span>
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Finding Optimal Treatment...' : 'Get Recommendation'}
      </button>
    </form>
  );
}
