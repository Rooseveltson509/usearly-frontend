export const Signalements: React.FC = () => {
  return (
    <div className="signalements bg-white p-4 shadow-md rounded-md">
      <h2 className="text-lg font-semibold">Signalements (123)</h2>
      <button className="mt-2 bg-gray-200 px-3 py-1 rounded text-sm">
        Filtrer
      </button>
      <div className="mt-4 border-t pt-2">
        <p className="text-gray-600 italic">
          "Je suis satisfait, je ne sais pas quoi faire. Je vais chercher
          ailleurs."
        </p>
      </div>
    </div>
  );
};