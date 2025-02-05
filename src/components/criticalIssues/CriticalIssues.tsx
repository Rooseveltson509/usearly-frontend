export const CriticalIssues: React.FC = () => {
  return (
    <div className="critical-issues bg-white p-4 shadow-md rounded-md">
      <h2 className="text-lg font-semibold">
        Problèmes critiques, impact et recommandations
      </h2>
      <table className="w-full mt-4 border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-200 p-2 text-left">Problème</th>
            <th className="border border-gray-200 p-2 text-left">Impact</th>
            <th className="border border-gray-200 p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-200 p-2">
              Validation bancaire bloquée
            </td>
            <td className="border border-gray-200 p-2 text-red-500">60%</td>
            <td className="border border-gray-200 p-2">
              Simplifier les validations
            </td>
          </tr>
          <tr>
            <td className="border border-gray-200 p-2">Recherche imprécise</td>
            <td className="border border-gray-200 p-2 text-red-500">50%</td>
            <td className="border border-gray-200 p-2">Ajouter des filtres</td>
          </tr>
          <tr>
            <td className="border border-gray-200 p-2">Retards de livraison</td>
            <td className="border border-gray-200 p-2 text-red-500">30%</td>
            <td className="border border-gray-200 p-2">
              Améliorer la communication
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};