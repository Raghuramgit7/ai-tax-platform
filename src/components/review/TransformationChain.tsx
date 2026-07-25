import { ArrowDown, Calculator } from 'lucide-react';
import type { Transformation } from '@/types';

interface TransformationChainProps {
  transformations: Transformation[];
}

export function TransformationChain({ transformations }: TransformationChainProps) {
  if (transformations.length === 0) return null;

  const sorted = [...transformations].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
        <Calculator size={12} />
        Transformations
      </h4>
      {sorted.map((tx, index) => (
        <div key={tx.id}>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-blue-700 uppercase">
                Step {index + 1}: {tx.operation}
              </span>
            </div>

            {/* Inputs */}
            <div className="space-y-1 mb-2">
              {tx.inputs.map((input, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">{input.label}</span>
                  <span className="font-mono text-gray-900">
                    ${input.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Formula */}
            <div className="pt-2 border-t border-blue-200">
              <p className="text-xs font-mono text-blue-800">{tx.formula}</p>
            </div>

            {/* Output */}
            <div className="mt-1 flex items-center justify-between">
              <span className="text-xs text-gray-500">Result:</span>
              <span className="text-sm font-bold text-blue-900">
                ${tx.output.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Arrow between steps */}
          {index < sorted.length - 1 && (
            <div className="flex justify-center py-1">
              <ArrowDown size={14} className="text-gray-300" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
