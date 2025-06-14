// src/components/ui/SkeletonLoader.jsx
const SkeletonLoader = ({ 
  type = "default", 
  count = 1,
  className = "" 
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case "card":
        return (
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        );
      
      case "quiz":
        return (
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="animate-pulse">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full mr-4"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5 mb-4"></div>
              <div className="flex justify-between items-center">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        );
      
      case "stats":
        return (
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        );
    }
  };

  return (
    <div className={className}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className={count > 1 ? "mb-4" : ""}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
