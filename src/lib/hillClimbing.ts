import { Treatment } from './supabase';

export type PatientProfile = {
  age: number;
  conditionSeverity: number;
  allergies: string[];
  currentMedications: string[];
  prioritizeEffectiveness: boolean;
  prioritizeSafety: boolean;
  prioritizeCost: boolean;
};

export type OptimizationResult = {
  treatment: Treatment;
  score: number;
  iterations: number;
  scoreHistory: number[];
};

export function calculateTreatmentScore(
  treatment: Treatment,
  patient: PatientProfile
): number {
  const weights = {
    effectiveness: patient.prioritizeEffectiveness ? 0.5 : 0.33,
    safety: patient.prioritizeSafety ? 0.5 : 0.33,
    cost: patient.prioritizeCost ? 0.5 : 0.33,
  };

  const normalizedWeights = normalizeWeights(weights);

  const effectivenessScore = treatment.effectiveness_score;
  const safetyScore = 100 - treatment.side_effects_score;
  const costScore = 100 - treatment.cost_score;

  const ageFactor = patient.age > 65 ? 0.9 : 1.0;
  const severityFactor = 1 + (patient.conditionSeverity / 200);

  const baseScore =
    effectivenessScore * normalizedWeights.effectiveness +
    safetyScore * normalizedWeights.safety +
    costScore * normalizedWeights.cost;

  return baseScore * ageFactor * severityFactor;
}

function normalizeWeights(weights: {
  effectiveness: number;
  safety: number;
  cost: number;
}): { effectiveness: number; safety: number; cost: number } {
  const total = weights.effectiveness + weights.safety + weights.cost;
  return {
    effectiveness: weights.effectiveness / total,
    safety: weights.safety / total,
    cost: weights.cost / total,
  };
}

export function hillClimbingOptimization(
  treatments: Treatment[],
  patient: PatientProfile,
  maxIterations: number = 100
): OptimizationResult {
  if (treatments.length === 0) {
    throw new Error('No treatments available');
  }

  let currentTreatment = treatments[Math.floor(Math.random() * treatments.length)];
  let currentScore = calculateTreatmentScore(currentTreatment, patient);
  let iterations = 0;
  const scoreHistory: number[] = [currentScore];

  while (iterations < maxIterations) {
    iterations++;

    const neighbors = treatments.filter((t) => t.id !== currentTreatment.id);

    if (neighbors.length === 0) break;

    let bestNeighbor = neighbors[0];
    let bestNeighborScore = calculateTreatmentScore(bestNeighbor, patient);

    for (const neighbor of neighbors) {
      const neighborScore = calculateTreatmentScore(neighbor, patient);
      if (neighborScore > bestNeighborScore) {
        bestNeighbor = neighbor;
        bestNeighborScore = neighborScore;
      }
    }

    scoreHistory.push(bestNeighborScore);

    if (bestNeighborScore <= currentScore) {
      break;
    }

    currentTreatment = bestNeighbor;
    currentScore = bestNeighborScore;
  }

  return {
    treatment: currentTreatment,
    score: currentScore,
    iterations,
    scoreHistory,
  };
}
