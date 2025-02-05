export const ResolutionChart: React.FC = () => {
  return (
    <div className="resolution-chart bg-white p-4 shadow-md rounded-md">
      <h2 className="text-lg font-semibold">Résolution des tickets</h2>
      <div className="mt-4">
        <img
          src="/resolution-chart.png"
          alt="Graphique de résolution"
          className="w-full h-48"
        />
      </div>
    </div>
  );
};