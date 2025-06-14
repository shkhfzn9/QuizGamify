// src/components/ui/EmptyState.jsx
const EmptyState = ({
  icon = "fa-inbox",
  title = "No items found",
  description = "There are currently no items to display.",
  action = null,
}) => {
  return (
    <div className="text-center py-12">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
        <i className={`fas ${icon} text-gray-500 text-xl`}></i>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 max-w-md mx-auto mb-4">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default EmptyState;
