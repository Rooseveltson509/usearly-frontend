import { useState } from "react";
import "./SignalSection.scss";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import signalIcon from "@src/assets/icons/signal-icon.svg";

type FrictionItem = {
  value: number;
  delta?: number;
  critique: string[];
  majeur: string[];
  mineur: string[];
};
const data: FrictionItem[] = [
  {
    value: 130,
    critique: ["Erreur 404"],
    majeur: ["…", "…"],
    mineur: ["…", "…", "…"],
  },
  {
    value: 10,
    critique: ["Erreur de description", "Redirection erronée"],
    majeur: [],
    mineur: [],
  },
  {
    value: 90,
    delta: 12,
    critique: [
      "Identifiant non reconnue",
      "Réinitialisation du mot de passe impossible",
      "Mail de confirmation confirmation confirmation confirmation confirmation",
    ],
    majeur: ["…", "…"],
    mineur: ["…", "…", "…", "…"],
  },
  {
    value: 112,
    delta: 24,
    critique: [],
    majeur: ["Enregistrement de carte bancaire indisponible"],
    mineur: ["Sauvegarde du panier indisponible"],
  },
  {
    value: 78,
    critique: ["Délai non respecté", "Suivi de livraison non mis à jour"],
    majeur: [],
    mineur: [],
  },
  {
    value: 90,
    critique: ["Le bordereau de retour ne s'affiche pas sur mobile"],
    majeur: ["…"],
    mineur: ["…", "…", "…"],
  },
  {
    value: 187,
    critique: ["Pas de réponse", "Remboursement en attente depuis 3 mois"],
    majeur: ["…", "…"],
    mineur: ["…", "…"],
  },
];

const SignalSection: React.FC = () => {
  const [open, setOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<
    Record<number, "critique" | "majeur" | "mineur">
  >({});

  const handleTab = (index: number, tab: "critique" | "majeur" | "mineur") => {
    setActiveTab((prev) => ({ ...prev, [index]: tab }));
  };

  const getBorderColor = (tab: "critique" | "majeur" | "mineur") => {
    if (tab === "critique") return "#ff6e6e";
    if (tab === "majeur") return "#ffd66b";
    return "#a99cff";
  };

  return (
    <div className="friction-section">
      <div className="titles-bar">
        <div>
          <span className="title-emotions">
            <img src={signalIcon} alt="" />
          </span>
        </div>
        {open && <span className="title-ressentis">Points de friction</span>}
      </div>

      <div className="friction-main">
        <div className="friction-header">
          <div className="top-bar">
            {data.map((item, i) => {
              const color =
                item.delta && item.delta > 0
                  ? "yellow"
                  : item.delta && item.delta < 0
                  ? "red"
                  : "";
              return (
                <div className="value-block" key={i}>
                  <span className="value">{item.value}</span>
                  {item.delta && (
                    <span className={`delta ${color}`}>
                      {item.delta > 0 ? `+${item.delta}` : item.delta}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <button className="toggle-btn" onClick={() => setOpen(!open)}>
            {open ? <FiChevronUp /> : <FiChevronDown />}
          </button>
        </div>

        {open && (
          <div className="details-row">
            {data.map((item, i) => {
              const currentTab = activeTab[i] || "critique";
              const list = item[currentTab];
              return (
                <div className="friction-box" key={i}>
                  <div className="tabs">
                    <button
                      data-tab="critique"
                      className={currentTab === "critique" ? "active" : ""}
                      style={{
                        borderBottomColor:
                          currentTab === "critique"
                            ? getBorderColor("critique")
                            : "",
                      }}
                      onClick={() => handleTab(i, "critique")}
                    >
                      <strong>{item.critique.length}</strong>{" "}
                      <span>Critique</span>
                    </button>
                    <button
                      data-tab="majeur"
                      className={currentTab === "majeur" ? "active" : ""}
                      style={{
                        borderBottomColor:
                          currentTab === "majeur"
                            ? getBorderColor("majeur")
                            : "",
                      }}
                      onClick={() => handleTab(i, "majeur")}
                    >
                      <strong>{item.majeur.length}</strong> <span>Majeur</span>
                    </button>
                    <button
                      data-tab="mineur"
                      className={currentTab === "mineur" ? "active" : ""}
                      style={{
                        borderBottomColor:
                          currentTab === "mineur"
                            ? getBorderColor("mineur")
                            : "",
                      }}
                      onClick={() => handleTab(i, "mineur")}
                    >
                      <strong>{item.mineur.length}</strong> <span>Mineur</span>
                    </button>
                  </div>
                  <div className="items-list">
                    {list.map((txt, idx) => (
                      <div key={idx} className="item-dot">
                        <span className={`dot ${currentTab}`}></span>
                        {txt}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignalSection;
