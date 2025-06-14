// src/components/ui/ContentLoader.jsx
import LoadingSpinner from './LoadingSpinner';

const ContentLoader = ({ 
  message = "Loading content...", 
  height = "200px",
  showSpinner = true 
}) => {
  return (
    <div 
      className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100"
      style={{ minHeight: height }}
    >
      <div className="text-center">
        {showSpinner && <LoadingSpinner size="md" color="indigo" />}
        <p className="mt-3 text-gray-500 text-sm">{message}</p>
      </div>
    </div>
  );
};

export default ContentLoader;
