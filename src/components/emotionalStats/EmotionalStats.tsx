export const EmotionalStats: React.FC = () => {
  return (
    <div className="emotional-stats bg-white p-4 shadow-md rounded-md">
      <h2 className="text-lg font-semibold">Expérience émotionnelle</h2>
      <div className="flex justify-between mt-4">
        <div className="text-center">
          <p className="text-2xl font-bold">343</p>
          <p className="text-gray-600">Emotions</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">8%</p>
          <p className="text-gray-600">Zones critiques</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">+10%</p>
          <p className="text-gray-600">Émotions négatives</p>
        </div>
      </div>
    </div>
  );
};