import { Activity, TrendingUp, DollarSign, AlertCircle } from 'lucide-react';
import { Treatment } from '../lib/supabase';

type RecommendationResultProps = {
  treatment: Treatment;
  score: number;
  iterations: number;
  scoreHistory: number[];
};

export function RecommendationResult({
  treatment,
  score,
  iterations,
  scoreHistory,
}: RecommendationResultProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Recommended Treatment
        </h2>
        <p className="text-gray-600">
          Optimized using Hill Climbing algorithm
        </p>
      </div>

      <div className="bg-blue-50 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{treatment.name}</h3>
            <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {treatment.category}
            </span>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">
              {score.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Optimization Score</div>
          </div>
        </div>
        <p className="text-gray-700">{treatment.description}</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-700">
              Effectiveness
            </span>
          </div>
          <div className="text-2xl font-bold text-green-600">
            {treatment.effectiveness_score}
          </div>
          <div className="w-full bg-green-200 rounded-full h-2 mt-2">
            <div
              className="bg-green-600 h-2 rounded-full"
              style={{ width: `${treatment.effectiveness_score}%` }}
            />
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-gray-700">
              Side Effects
            </span>
          </div>
          <div className="text-2xl font-bold text-orange-600">
            {treatment.side_effects_score}
          </div>
          <div className="w-full bg-orange-200 rounded-full h-2 mt-2">
            <div
              className="bg-orange-600 h-2 rounded-full"
              style={{ width: `${treatment.side_effects_score}%` }}
            />
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Cost</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {treatment.cost_score}
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${treatment.cost_score}%` }}
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-gray-700" />
          <span className="font-medium text-gray-900">
            Algorithm Performance
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600">Iterations</div>
            <div className="text-xl font-bold text-gray-900">{iterations}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Score Improvement</div>
            <div className="text-xl font-bold text-gray-900">
              {scoreHistory.length > 1
                ? `+${(scoreHistory[scoreHistory.length - 1] - scoreHistory[0]).toFixed(1)}`
                : '0.0'}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-sm font-medium text-gray-700 mb-2">
          Score Progression
        </div>
        <div className="flex items-end gap-1 h-16">
          {scoreHistory.map((histScore, index) => {
            const maxScore = Math.max(...scoreHistory);
            const heightPercent = (histScore / maxScore) * 100;
            return (
              <div
                key={index}
                className="flex-1 bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                style={{ height: `${heightPercent}%` }}
                title={`Iteration ${index + 1}: ${histScore.toFixed(1)}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
