// src/components/Recipe/StepList.jsx
import React from 'react';

const StepList = ({ steps = [], onDelete, readOnly = false }) => {
  if (steps.length === 0) {
    return (
      <div className="py-4 text-center text-gray-500">
        調理手順がまだ登録されていません
      </div>
    );
  }

  return (
    <ol className="space-y-6">
      {steps.map((step, index) => (
        <li key={step.id} className="relative">
          <div className="flex">
            <div className="flex-shrink-0 mr-4">
              <div className="flex items-center justify-center bg-orange-500 rounded-full h-8 w-8 text-white font-medium">
                {step.stepNumber}
              </div>
            </div>
            <div className="flex-grow">
              <p className="text-gray-800">{step.instruction}</p>
              
              {step.imageUrls && step.imageUrls.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {step.imageUrls.map((url, imgIndex) => (
                    <img 
                      key={imgIndex}
                      src={url}
                      alt={`Step ${step.stepNumber} image ${imgIndex + 1}`}
                      className="h-20 w-20 object-cover rounded-md"
                    />
                  ))}
                </div>
              )}
              
              {step.timerDuration > 0 && (
                <div className="mt-2 inline-flex items-center text-sm bg-blue-50 px-2 py-1 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-blue-600 font-medium">{step.timerDuration}分</span>
                </div>
              )}
            </div>
            
            {!readOnly && onDelete && (
              <button
                onClick={() => onDelete(step.id)}
                className="text-red-500 hover:text-red-700 ml-2"
                aria-label="手順を削除"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
};

export default StepList;