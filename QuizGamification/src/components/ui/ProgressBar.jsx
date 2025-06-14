// src/components/ui/ProgressBar.jsx
const ProgressBar = ({ progress, color = "indigo", size = "md" }) => {
  const heightClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  const colorClasses = {
    indigo: "bg-indigo-600",
    green: "bg-green-600",
    yellow: "bg-yellow-500",
    red: "bg-red-600",
    purple: "bg-purple-600",
  };

  return (
    <div className="w-full bg-gray-200 rounded-full overflow-hidden">
      <div
        className={`${heightClasses[size]} ${colorClasses[color]} rounded-full transition-all duration-300`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
