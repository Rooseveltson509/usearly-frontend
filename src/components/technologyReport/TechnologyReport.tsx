export const TechnologyReport: React.FC = () => {
  return (
    <div className="technology-report bg-white p-4 shadow-md rounded-md">
      <h2 className="text-lg font-semibold">Technologie</h2>
      <table className="w-full mt-4 border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-200 p-2 text-left">Navigateur</th>
            <th className="border border-gray-200 p-2 text-left">Problèmes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-200 p-2">Chrome</td>
            <td className="border border-gray-200 p-2">
              Bugs de chargement, erreurs d'affichage
            </td>
          </tr>
          <tr>
            <td className="border border-gray-200 p-2">Safari</td>
            <td className="border border-gray-200 p-2">Lenteur des pages</td>
          </tr>
          <tr>
            <td className="border border-gray-200 p-2">Firefox</td>
            <td className="border border-gray-200 p-2">
              Compatibilité limitée
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};