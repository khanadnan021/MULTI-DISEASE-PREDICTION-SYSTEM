import React from 'react';
import { PredictionResult } from '../types';
import { Users, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

interface EnsembleVotingBreakdownProps {
  result: PredictionResult;
}

export const EnsembleVotingBreakdown: React.FC<EnsembleVotingBreakdownProps> = ({ result }) => {
  const TOTAL_TREES = 120; // Trained with n_estimators=120
  const posProb = result.probabilities.positive;
  const negProb = result.probabilities.negative;

  const positiveVotes = Math.round(posProb * TOTAL_TREES);
  const negativeVotes = TOTAL_TREES - positiveVotes;

  const isPositive = result.is_positive;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-blue-600" />
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Random Forest Ensemble Consensus (100 Decision Trees)
          </h3>
        </div>
        <span className="text-[11px] text-slate-500 font-mono">
          Bagging Ensemble (n_estimators=100, max_depth=6)
        </span>
      </div>

      {/* Voting distribution bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-bold">
          <div className="flex items-center space-x-1.5 text-blue-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Negative (Healthy): {negativeVotes} Trees ({(negProb * 100).toFixed(1)}%)</span>
          </div>
          <div className="flex items-center space-x-1.5 text-rose-700">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Positive (Disease): {positiveVotes} Trees ({(posProb * 100).toFixed(1)}%)</span>
          </div>
        </div>

        {/* Dual Colored Split Bar */}
        <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
          <div
            className="h-full bg-blue-500 transition-all duration-700"
            style={{ width: `${Math.max(1, negProb * 100)}%` }}
            title={`Negative Votes: ${(negProb * 100).toFixed(1)}%`}
          ></div>
          <div
            className="h-full bg-rose-500 transition-all duration-700"
            style={{ width: `${Math.max(1, posProb * 100)}%` }}
            title={`Positive Votes: ${(posProb * 100).toFixed(1)}%`}
          ></div>
        </div>
      </div>

      {/* Visual Dot Cluster of 120 Trees */}
      <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span className="font-semibold">Simulated Decision Tree Voting Grid (120 Trees):</span>
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-xs bg-blue-500 inline-block"></span>
              <span>Healthy Vote ({negativeVotes})</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-xs bg-rose-500 inline-block"></span>
              <span>Disease Vote ({positiveVotes})</span>
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 pt-1 max-h-20 overflow-y-auto">
          {Array.from({ length: TOTAL_TREES }).map((_, i) => {
            const isTreePos = i < positiveVotes;
            return (
              <span
                key={i}
                title={`Tree #${i + 1}: ${isTreePos ? 'Positive (Disease)' : 'Negative (Healthy)'}`}
                className={`w-2 h-2 rounded-xs transition-transform hover:scale-150 cursor-help ${
                  isTreePos ? 'bg-rose-500' : 'bg-blue-500'
                }`}
              ></span>
            );
          })}
        </div>

        <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
          <strong>Ensemble Voting Concept:</strong> Instead of relying on a single fallible decision tree, 
          the Random Forest averages votes from all 120 independent trees. Here,{' '}
          <strong className={isPositive ? 'text-rose-600' : 'text-blue-600'}>
            {isPositive ? `${positiveVotes} of 120 trees (${(posProb * 100).toFixed(1)}%)` : `${negativeVotes} of 120 trees (${(negProb * 100).toFixed(1)}%)`}
          </strong>{' '}
          confirmed the final verdict, providing high statistical confidence.
        </p>
      </div>
    </div>
  );
};
