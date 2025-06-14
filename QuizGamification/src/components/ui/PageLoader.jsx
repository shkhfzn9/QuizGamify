// src/components/ui/PageLoader.jsx
import LoadingSpinner from './LoadingSpinner';

const PageLoader = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" color="indigo" />
        <p className="mt-4 text-gray-600 text-lg">{message}</p>
      </div>
    </div>
  );
};

export default PageLoader;
