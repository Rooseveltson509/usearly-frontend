import React, { useState, useEffect } from "react";
import "./Profile.scss";
import ReportIcon from "../../assets/icons/report.svg";
import HeartIcon from "../../assets/icons/heart.svg";
import SuggestIcon from "../../assets/icons/suggest.svg";
import FeedIcon from "../../assets/icons/feed-icon.svg";
import IdeeIcon from "../../assets/icons/idee-icon.svg";
import CommentIcon from "../../assets/icons/comment-icon.svg";
import SolutionIcon from "../../assets/icons/solution-icon.svg";
import CheckIcon from "../../assets/icons/check-icon.svg";
import CollabIcon from "../../assets/icons/collab-icon.svg";
import defaultAvatar from "../../assets/images/user.png";
import signalIcon from "../../assets/images/signalNew.png";
// import UserCalendar from "@src/components/userCalendar/UserCalendar";
import { useAuth } from "@src/contexts/AuthContext";
import { fetchUserProfile } from "@src/services/apiService";
import ReactionSection from "@src/components/reactions/reaction-section/ReactionSection";
import CommentSection from "@src/components/comment-section/CommentSection";

const Profile: React.FC = () => {
  const { userProfile, setUserProfile } = useAuth();
  const [pseudo, setPseudo] = useState(userProfile?.pseudo || "");
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [isCardOpen, setIsCardOpen] = useState<boolean>(true);

  const toggleCard = () => setIsCardOpen(!isCardOpen);

  useEffect(() => {
    if (!userProfile) {
      const fetchProfile = async () => {
        try {
          const profile = await fetchUserProfile();
          setUserProfile(profile);
          setPseudo(profile.pseudo || "");
        } catch (error) {
          console.error("Erreur lors du chargement du profil :", error);
        }
      };

      fetchProfile();
    }
  }, [userProfile, setUserProfile]);

  // Modification : Ajoute la classe "dashboard-page" au body lorsque le Dashboard est monté
  useEffect(() => {
    document.body.classList.add("body-color");

    // Modification : Supprime la classe "dashboard-page" du body lorsque le composant est démonté
    return () => {
      document.body.classList.remove("body-color");
    };
  }, []);

  const tabs = [
    { label: "Mes feedbacks", active: true },
    { label: "Mon impact", active: false },
    { label: "Récompenses", active: false },
    { label: "Challenges", active: false },
    { label: "Marques", active: false },
  ];

  const [activeTab, setActiveTab] = useState("Mes feedbacks");

  return (
    <div className="body-color">
      <div className="user-profile-container">
        <div className="profile-header">
          <div className="user-info">
            <img
              className="avatar"
              src={
                userProfile?.avatar
                  ? `${import.meta.env.VITE_API_BASE_URL}/${userProfile.avatar}`
                  : defaultAvatar
              }
            />
            <div className="user-details">
              <h2>{pseudo}</h2>
              <span>User Niveau 1</span>
            </div>
          </div>

          <div className="contributions-overview">
            <span className="contributions-label">4 dernières semaines</span>
            <span className="contributions-count">59</span>
            <span className="contributions-total">Total des contributions</span>
          </div>
          {/* 
          <UserCalendar
            activities={{
              "2025-03-02": true,
              "2025-03-05": true,
              "2025-03-12": true,
              "2025-03-15": true,
            }}
          /> */}

          <div className="activity-summary">
            <div className="activity-item">
              <div className="icon">
                <img src={ReportIcon} alt="icone-suggestion" />
              </div>
              <span>Signalement</span>
              <strong>24</strong>
            </div>
            <div className="activity-item">
              <div className="icon">
                <img src={HeartIcon} alt="icone-suggestion" />
              </div>
              <span>Coup de coeur</span>
              <strong>8</strong>
            </div>
            <div className="activity-item">
              <div className="icon">
                <img src={SuggestIcon} alt="icone-suggestion" />
              </div>
              <span>Suggestion</span>
              <strong>2</strong>
            </div>
          </div>
        </div>

        <div className="profile-container-view">
          <div className="feedback-tabs-container">
            <div className="tabs">
              {tabs.map((tab) => (
                <div
                  key={tab.label}
                  className={`tab ${activeTab === tab.label ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.label)}
                >
                  {tab.label}
                </div>
              ))}
            </div>

            <div className="filters">
              <select className="filter-select">
                <option>Signalements</option>
                <option>Coup de coeur</option>
                <option>Suggestions</option>
              </select>
              <select className="filter-select">
                <option>3 derniers mois</option>
                <option>6 derniers mois</option>
                <option>1 an</option>
              </select>
            </div>

            <div
              className={`report-card report-card-profile ${
                !isCardOpen ? "closed" : ""
              }`}
            >
              {isCardOpen ? (
                <>
                  {/* Ton contenu ouvert complet ici... (Ne change rien) */}
                  <div className="report-header" onClick={toggleCard}>
                    <div className="user-info">
                      <img
                        src={
                          userProfile?.avatar
                            ? `${import.meta.env.VITE_API_BASE_URL}/${
                                userProfile.avatar
                              }`
                            : defaultAvatar
                        }
                        alt="Avatar"
                        className="user-avatar"
                      />
                      <span className="report-author">
                        <strong>{pseudo}</strong>
                      </span>
                      <span className="post-author">
                        connecté à <strong>Spotify</strong>
                      </span>
                      <span className="report-time">・39 min</span>
                    </div>

                    <div className="report-options">⋮</div>

                    <div className="img-round">
                      <img
                        src={defaultAvatar}
                        alt="Spotify"
                        className="brand-logo"
                      />
                    </div>
                  </div>

                  <div className="bar"></div>

                  <div className="report-content">
                    <div className="post-icon">
                      <img src={signalIcon} alt="signalement icon" />
                    </div>
                    <div className="post-details">
                      <h3 className="report-title">
                        Des difficultés avec Spotify Wrapped
                      </h3>
                      <p className="report-desc">
                        Plus nous aurons d'informations, plus vite nous pourrons
                        résoudre ce souci. Merci pour votre aide !
                        <br />
                        <strong>
                          82 utilisateurs touchés pour le moment ✨ :
                        </strong>
                      </p>

                      <div className="poll-systems">
                        <div className="vote-item">
                          <span className="percent-label">20%</span>
                          <div className="progress-bar">
                            <div
                              className="progress-fill"
                              style={{ width: "20%" }}
                            ></div>
                          </div>
                          <span className="system-label">Windows</span>
                        </div>

                        <div className="vote-item">
                          <span className="percent-label">80%</span>
                          <div className="progress-bar">
                            <div
                              className="progress-fill"
                              style={{ width: "80%" }}
                            ></div>
                          </div>
                          <span className="system-label">Mac</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <ReactionSection
                    parentId="report1"
                    type="report"
                    showCommentInput={showCommentInput}
                    setShowCommentInput={setShowCommentInput}
                    commentCount={commentCount}
                    brandLogo={defaultAvatar}
                  />

                  <CommentSection
                    parentId="report1"
                    type="report"
                    showCommentInput={showCommentInput}
                    commentCount={commentCount}
                    setCommentCount={setCommentCount}
                  />
                </>
              ) : (
                <div className="closed-report" onClick={toggleCard}>
                  <div className="closed-report-info">
                    <img src={signalIcon} alt="signalement icon" />

                    <h4 className="closed-report-title">
                      Des difficultés avec Spotify Wrapped
                    </h4>
                  </div>
                  <div>
                    <span className="closed-report-date">13/03/2025</span>
                  </div>
                  <div className="closed-report-status">
                    <span className="transmitted">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <defs>
                          <linearGradient
                            id="myGradient"
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="1"
                          >
                            <stop offset="0%" stopColor="#4300DF" />
                            <stop offset="100%" stopColor="#FF001E" />
                          </linearGradient>
                        </defs>
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="url(#myGradient)"
                          strokeWidth="2"
                          fill="none"
                        />
                        <path
                          d="M8 12 l3 3 l5 -5"
                          stroke="url(#myGradient)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Transmis à la marque
                    </span>
                  </div>
                  <div>
                    <img
                      src={defaultAvatar}
                      alt="Spotify"
                      className="brand-logo-small"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="user-contributions">
            <h3>Mes contributions</h3>
            <ul>
              <li>
                <img src={FeedIcon} alt="Feedbacks" />
                <span>Feedbacks</span>
                <strong>34</strong>
              </li>
              <li>
                <img src={IdeeIcon} alt="idées adoptées" />
                <span>Idées adoptées</span>
                <strong>1</strong>
              </li>
              <li>
                <img src={CommentIcon} alt="Commentaires" />
                <span>Commentaires</span>
                <strong>4</strong>
              </li>
              <li>
                <img src={SolutionIcon} alt="Solutions proposées" />
                <span>Solutions proposées</span>
                <strong>0</strong>
              </li>
              <li>
                <img src={CheckIcon} alt="checks" />
                <span>Checks</span>
                <strong>18</strong>
              </li>
              <li>
                <img src={CollabIcon} alt="collaborations" />
                <span>Collaborations</span>
                <strong>2</strong>
              </li>
            </ul>

            <hr className="hr-profile" />

            <div className="user-ranking">
              <span>
                🏆 <strong>Tu es dans le Top 5%</strong> des meilleurs Users !
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
