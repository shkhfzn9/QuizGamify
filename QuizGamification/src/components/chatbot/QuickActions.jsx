// src/components/chatbot/QuickActions.jsx
import React from 'react';
import { TrendingUp, Target, Award, BookOpen } from 'lucide-react';

const QuickActions = ({ onActionClick, userData }) => {
  const actions = [
    {
      id: 'performance',
      label: 'My Performance',
      icon: TrendingUp,
      prompt: 'Analyze my quiz performance and tell me my strengths and weaknesses',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'recommendations',
      label: 'Quiz Recommendations',
      icon: Target,
      prompt: 'Recommend the best quizzes for me to take next based on my performance',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'improvement',
      label: 'How to Improve',
      icon: Award,
      prompt: 'Give me tips on how to improve my quiz scores and ranking',
      color: 'from-purple-500 to-violet-500'
    },
    {
      id: 'study-plan',
      label: 'Study Plan',
      icon: BookOpen,
      prompt: 'Create a personalized study plan to help me improve in my weak areas',
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="p-3 border-t border-gray-100 dark:border-gray-700">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick Actions:</p>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => {
          const IconComponent = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => onActionClick(action.prompt)}
              className={`p-2 rounded-lg bg-gradient-to-r ${action.color} bg-opacity-10 
                         hover:bg-opacity-20 transition-all duration-200 text-left
                         border border-transparent hover:border-gray-200 dark:hover:border-gray-600`}
            >
              <div className="flex items-center gap-2">
                <IconComponent size={14} className="text-gray-600 dark:text-gray-300" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                  {action.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
