import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import "./Steps.scss";

const actionsData = [
  [
    "Se rend sur le menu principal",
    "Sélectionne une catégorie",
    "Renseigne ses critères",
    "Lance la recherche",
  ],
  [
    "Consulte les pages produits proposées",
    "Sélectionne un produit",
    "Ajoute le produit au panier",
  ],
  [
    "Renseigne son adresse email et son mot de passe",
    "Clique sur 'créer mon compte'",
    "Confirme son compte via le mail reçu",
  ],
  [
    "Sélectionne les options de livraison",
    "Renseigne ses coordonnées bancaires",
    "Renseigne le code promotion",
    "Reçoit un email de confirmation de commande",
  ],
  [
    "Modifie sa commande",
    "Suit l'évolution de sa commande",
    "Réceptionne sa commande",
  ],
  ["Sélectionne le produit à retourner ou à échanger", "Renvoie le produit"],
  [
    "Cherche de l'aide auprès du chatbot",
    "Cherche le numéro du service client",
    "Appelle le service client",
    "Envoie un email au service client",
  ],
];

const Steps: React.FC = () => {
  const stepsData = [
    { label: "Recherche", phase: "Avant achat" },
    { label: "Sélection", phase: "Avant achat" },
    { label: "Identification", phase: "Avant achat" },
    { label: "Processus d'achat", phase: "Pendant achat" },
    { label: "Suivi commande \net livraison", phase: "Pendant achat" },
    { label: "Retours et échanges", phase: "Après achat" },
    { label: "Support client", phase: "Après achat" },
  ];
  const phases = [...new Set(stepsData.map((s) => s.phase))];

  // État pour afficher/masquer le bloc d’actions
  const [showActions, setShowActions] = useState(false);

  // État pour cocher/décocher les cases : un tableau 2D booléen
  // actionsData.length = 7 => 7 colonnes
  // actionsData[i].length = N => N lignes dans la colonne i
  const [checkedState, setCheckedState] = useState<boolean[][]>(() =>
    actionsData.map(
      (colActions) => colActions.map(() => false) // chaque action = false par défaut
    )
  );

  // Toggle l’affichage
  const handleToggleActions = () => setShowActions((prev) => !prev);

  // Gère un clic sur une checkbox (col i, ligne j)
  const handleCheck = (
    colIndex: number,
    rowIndex: number,
    isChecked: boolean
  ) => {
    setCheckedState((prev) => {
      // On copie le tableau 2D
      const newState = prev.map((arr) => [...arr]);
      // On modifie la case voulue
      newState[colIndex][rowIndex] = isChecked;
      return newState;
    });
  };

  return (
    <div className="journey-steps-container">
      <div
        className="actions-left-col"
        style={{
          gap: showActions ? "165px" : "0",
        }}
      >
        {/* Bouton “+” */}
        <button className="add-step-button">
          <FaPlus />
        </button>

        {/* Titre vertical “Actions”, n’apparaît que si showActions = true */}
        <div className="actions-title-vertical">
          {showActions ? "Actions" : ""}
        </div>
      </div>

      <div className="steps-container">
        {/* Bandeau des phases */}
        <div className="phases-container">
          {phases.map((phase) => (
            <div className="phase-segment" key={phase}>
              <div className="phase-label">{phase}</div>
            </div>
          ))}
        </div>

        {/* Les 7 steps en flèches */}
        <div className="steps-row">
          {stepsData.map((step, i) => (
            <div className="step-item arrow" key={i}>
              <span className="step-label">{step.label}</span>
            </div>
          ))}
        </div>

        {/* Barre en bas, clic pour toggle */}
        <div className="actions-bar" onClick={handleToggleActions}>
          <span>
            {showActions ? "Masquer les actions ▲" : "Afficher les actions ▼"}
          </span>
        </div>

        {/* Bloc d'actions éventuel */}
        {showActions && (
          <div className="actions-panel">
            <div className="actions-columns">
              {actionsData.map((actionList, colIndex) => (
                <div className="actions-column" key={colIndex}>
                  {actionList.map((actionText, rowIndex) => (
                    <label key={rowIndex} className="action-item">
                      <input
                        type="checkbox"
                        // On lit la valeur dans le state
                        checked={checkedState[colIndex][rowIndex]}
                        // On la met à jour quand on coche/décoche
                        onChange={(e) =>
                          handleCheck(colIndex, rowIndex, e.target.checked)
                        }
                      />
                      <span>{actionText}</span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Steps;
