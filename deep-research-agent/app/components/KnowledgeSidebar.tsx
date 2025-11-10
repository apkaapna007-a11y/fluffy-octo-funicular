'use client';

import { motion } from 'framer-motion';
import { KnowledgeEntry } from '@/lib/types';

interface KnowledgeSidebarProps {
  knowledge: KnowledgeEntry[];
  isVisible: boolean;
}

export default function KnowledgeSidebar({ knowledge, isVisible }: KnowledgeSidebarProps) {
  if (!isVisible || knowledge.length === 0) return null;

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-80 flex-shrink-0 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 
                 overflow-y-auto h-screen sticky top-0"
    >
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <svg
            className="w-5 h-5 text-blue-600 dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Knowledge Memory
          </h2>
        </div>

        <div className="space-y-4">
          {knowledge
            .sort((a, b) => b.relevance - a.relevance)
            .map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Relevance
                      </span>
                      <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden max-w-[60px]">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${entry.relevance * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-4 mb-3">
                  {entry.content}
                </p>

                {entry.sources && entry.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Sources ({entry.sources.length})
                    </div>
                    <div className="space-y-1">
                      {entry.sources.slice(0, 2).map((source, idx) => (
                        <div key={idx} className="text-xs">
                          {source.url ? (
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {source.title}
                            </a>
                          ) : (
                            <span className="text-gray-600 dark:text-gray-400">
                              {source.title}
                            </span>
                          )}
                        </div>
                      ))}
                      {entry.sources.length > 2 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          +{entry.sources.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
        </div>
      </div>
    </motion.aside>
  );
}
