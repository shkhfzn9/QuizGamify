// src/components/ui/UserAvatar.jsx
const UserAvatar = ({ user, size = "md", showName = false }) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.split(" ");
    return names
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex items-center">
      <div
        className={`${sizeClasses[size]} rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold`}
      >
        {getInitials(user?.displayName || user?.email)}
      </div>
      {showName && (
        <span className="ml-2 text-gray-700">
          {user?.displayName || user?.email?.split("@")[0]}
        </span>
      )}
    </div>
  );
};

export default UserAvatar;
