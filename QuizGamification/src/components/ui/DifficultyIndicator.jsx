// src/components/ui/DifficultyIndicator.jsx
const DifficultyIndicator = ({ difficulty }) => {
  const difficultyConfig = {
    easy: {
      color: "green",
      text: "Easy",
    },
    medium: {
      color: "yellow",
      text: "Medium",
    },
    hard: {
      color: "red",
      text: "Hard",
    },
  };

  const config = difficultyConfig[difficulty] || difficultyConfig.medium;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}
    >
      {config.text}
    </span>
  );
};

export default DifficultyIndicator;
