'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlanStep } from '@/lib/types';

interface StepCardProps {
  step: PlanStep;
  index: number;
}

export default function StepCard({ step, index }: StepCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusIcon = () => {
    switch (step.status) {
      case 'completed':
        return (
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'executing':
        return (
          <svg className="animate-spin h-5 w-5 text-blue-500" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        );
      case 'failed':
        return (
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600" />
        );
    }
  };

  const getStatusColor = () => {
    switch (step.status) {
      case 'completed':
        return 'border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950';
      case 'executing':
        return 'border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950 animate-pulse-subtle';
      case 'failed':
        return 'border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950';
      default:
        return 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`rounded-xl border-2 ${getStatusColor()} overflow-hidden transition-all duration-200`}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-start gap-4 hover:bg-opacity-80 transition-all"
      >
        <div className="flex-shrink-0 mt-0.5">{getStatusIcon()}</div>
        
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Step {index + 1}
            </span>
            {step.result && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                • {step.result.executionTime}ms
              </span>
            )}
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {step.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
            {step.description}
          </p>
        </div>

        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-200 dark:border-gray-700"
          >
            <div className="px-6 py-4 space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                  Tools Used
                </h4>
                <div className="flex flex-wrap gap-2">
                  {step.tools.map((tool, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full text-xs font-medium
                               bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {step.result && (
                <>
                  {step.result.sources && step.result.sources.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                        Sources ({step.result.sources.length})
                      </h4>
                      <div className="space-y-2">
                        {step.result.sources.slice(0, 3).map((source, idx) => (
                          <div
                            key={idx}
                            className="text-sm p-3 rounded-lg bg-gray-50 dark:bg-gray-900"
                          >
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                              {source.title}
                            </div>
                            {source.url && (
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 text-xs hover:underline"
                              >
                                {source.url}
                              </a>
                            )}
                            <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                              {source.snippet}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                      Confidence
                    </h4>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 transition-all duration-500"
                          style={{ width: `${(step.result.confidence || 0) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {Math.round((step.result.confidence || 0) * 100)}%
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
