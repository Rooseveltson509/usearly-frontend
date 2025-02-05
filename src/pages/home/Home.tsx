import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

import karinVideo from "../../assets/images/karine.mov";
import imageU from "../../assets/images/logoU.svg";
import errorImg from "../../assets/images/404.svg";
import carousel1 from "../../assets/images/thank.svg";
import carousel2 from "../../assets/images/woman-idea.svg";
import carousel3 from "../../assets/images/agace.svg";
import bigUImage from "../../assets/images/U-img.png";
import viuImage from "../../assets/images/imgVIU.png";
import mockup from "../../assets/images/phone.svg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Home.scss";

const Home: React.FC = () => {
  const baseText = "Exprimez-vous au moment même où ";
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const typingTexts = [
    "Vous rencontrez un bug !",
    "une idée d'amélioration vous traverse l'esprit !",
    "vous avez envie de partager votre coup de cœur !",
    "une nouvelle fonctionnalité vous fait vibrer !",
    "une marque mérite vos félicitations !"
  ];
  const typingSpeed = 100;
  const delayBetweenTexts = 2000; // Temps avant de passer au texte suivant

  const [displayedText, setDisplayedText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const textRef = useRef<SVGTextElement | null>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (charIndex < typingTexts[textIndex].length && !isDeleting) {
      timeout = setTimeout(() => {
        setDisplayedText(typingTexts[textIndex].substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, typingSpeed);
    } else if (charIndex > 0 && isDeleting) {
      timeout = setTimeout(() => {
        setDisplayedText(typingTexts[textIndex].substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      }, typingSpeed / 2);
    } else if (!isDeleting) {
      timeout = setTimeout(() => setIsDeleting(true), delayBetweenTexts);
    } else {
      setIsDeleting(false);
      setTextIndex((prev) => (prev + 1) % typingTexts.length);
      setCharIndex(0);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true); // Texte visible dans le viewport
        } else {
          setIsVisible(false); // Texte en dehors du viewport
        }
      },
      { threshold: 0.5 } // Déclenche à 50% visible
    );

    if (textRef.current) {
      observer.observe(textRef.current);
    }

    return () => {
      if (textRef.current) {
        observer.unobserve(textRef.current);
      }
    };
  }, []);

  return (
    <div className="container">
      <div className="landing-page">
        <section>
          <header className="landing-header">
            <div className="header-content">
              <h1>Améliorer l’expérience sur vos sites et apps !</h1>
              <p>
                La première application qui connecte les utilisateurs aux
                marques pour <strong>collaborer</strong> et{" "}
                <strong>co-créer</strong> !
              </p>
            </div>

            <div className="header-image">
              {/* <div className="particles-container"> */}
              <img src={imageU} alt="logo u" />
            </div>
          </header>

          {/* Section 2: Logos */}
          <section className="brand-logos">
            <img
              src="/images/spotify.png"
              alt="Spotify image"
              className="brand-logo"
            />
            <img
              src="/images/laredoute.png"
              alt="Laredoute image"
              className="brand-logo"
            />
            <img
              src="/images/netflix.png"
              alt="Netflix image"
              className="brand-logo"
            />
            <img
              src="/images/doc.png"
              alt="Doctolib image"
              className="brand-logo"
            />
            <img
              src="/images/amazon.png"
              alt="Amazon image"
              className="brand-logo"
            />
            <img
              src="/images/decath.png"
              alt="Decathlon image"
              className="brand-logo"
            />
          </section>
        </section>
        <section className="story-section">
          <div className="story-container">
            <div className="video-wrapper">
              <video
                className="story-video"
                controls
                playsInline
                autoPlay
                muted
                loop
              >
                <source src={karinVideo} type="video/mp4" />
                <p>Votre navigateur ne supporte pas la lecture des vidéos.</p>
              </video>
              {/* Texte superposé sur la vidéo */}
              <div className="overlay-text">
                <p>
                  Karine veut faire une surprise à son copain et le rejoindre le
                  week-end prochain. Elle se connecte à{" "}
                  <strong>SNCF Connect</strong> pour acheter son billet.
                </p>
              </div>
            </div>
          </div>

          <div className="app-buttons">
            <p>
              Téléchargez l'appli et commencez dès maintenant à améliorer votre
              expérience <br />
              sur vos sites et applications préférés ! <br />
            </p>
            <div>
              <img
                src="/images/Logo_Google_play.png"
                alt="Google Play Store Logo"
              />
              <img
                src="/images/apple-app-store-logo.png"
                alt="Apple App Store Logo"
              />
            </div>
          </div>
        </section>

        <section className="landing-section">
          <div className="text-content">
            <h2>
              {baseText}
              <span className="typing">{displayedText}</span>
            </h2>
            <p>
              Exprimez-vous en temps réel :{" "}
              <strong className="text-animation">signalez</strong> un problème,{" "}
              <strong className="text-animation">félicitez</strong> pour une
              fonctionnalité qui vous plaît, ou{" "}
              <strong className="text-animation">suggérez</strong> une idée
              d'amélioration. En quelques clics, faites entendre votre voix
              auprès des marques et rejoignez une communauté de milliers
              d’utilisateurs, comme vous, qui souhaitent voir des évolutions
              concrètes et impactantes..
            </p>
            <button className="cta-button">Je me lance</button>
          </div>
          <div className="image-content">
            <img src={mockup} alt="App mockup" />
          </div>
        </section>

        <section className="carousel-section">
          <div className="carousel-container">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              spaceBetween={30}
              slidesPerView={1}
            >
              {/* Slide 1 */}
              <SwiperSlide>
                <div className="carousel-slide">
                  <img
                    src={carousel1}
                    alt="Agacé par un chargement trop lent"
                    className="carousel-image"
                  />
                  <div className="carousel-text">
                    <h2>
                      Une fonctionnalité vous simplifie la vie ?{" "}
                      <span className="highlight">Félicitez !</span>
                    </h2>
                    <span className="text-repeat">
                      Avec Usearly, vous êtes enfin entendu.{" "}
                      <strong>Vraiment.</strong>
                    </span>
                    <p>
                      Exprimez vos coups de cœur, vous gagnez des points et
                      aidez la communauté à découvrir les meilleures nouveautés.
                      Ensemble, mettons en avant les marques les plus créatives
                      pour que chacun profite des innovations qui font la
                      différence !
                    </p>
                  </div>
                </div>
              </SwiperSlide>

              {/* Slide 2 */}
              <SwiperSlide>
                <div className="carousel-slide">
                  <img
                    src={carousel2}
                    alt="Vous avez une idée d'amélioration à suggérer ?"
                    className="carousel-image"
                  />
                  <div className="carousel-text">
                    <h2>
                      Vous avez <span className="highlight">une idée</span>{" "}
                      d'amélioration à suggérer ?
                    </h2>
                    <span className="text-repeat">
                      Avec Usearly, vous êtes enfin entendu.{" "}
                      <strong>Vraiment.</strong>
                    </span>
                    <p>
                      Suggérez vos idées ! Elles seront visibles par la
                      communauté pour être likées et gagner en visibilité. Plus
                      votre idée plaît, plus vous accumulez des points, et si la
                      marque l’adopte, vous êtes récompensé !
                    </p>
                  </div>
                </div>
              </SwiperSlide>

              {/* Slide 3 */}
              <SwiperSlide>
                <div className="carousel-slide">
                  <div className="carousel-image-container">
                    <img
                      src={carousel3}
                      alt="Agacé par un chargement trop lent ?"
                      className="carousel-image"
                    />
                    <img
                      src={errorImg}
                      alt="404 Error"
                      className="carousel-small-image"
                    />
                  </div>

                  <div className="carousel-text">
                    <h2>
                      <span className="highlight">Agacé</span> par un chargement{" "}
                      <br></br>trop lent ?
                    </h2>
                    <span className="text-repeat">
                      Avec Usearly, vous êtes enfin entendu.{" "}
                      <strong>Vraiment.</strong>
                    </span>
                    <p>
                      Exprimez-vous au moment même où ça arrive ! Signalez votre
                      problème en 2 clics. Découvrez si d'autres utilisateurs
                      rencontrent le même souci et recevez des solutions en
                      temps réel. Ne laissez plus vos frustrations en suspens :
                      faites-vous entendre instantanément et contribuez pour des
                      améliorations concrètes.
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </section>

        <section className="viu-section">
          <div className="viu-content-wrapper">
            {/* Image Big U avec Overlay */}
            <div className="big-u-wrapper">
              <img src={bigUImage} alt="Large U" className="big-u" />
              <div className="overlay"></div> {/* Overlay ajouté ici */}
            </div>
            {/* Contenu principal */}
            <div className="viu-content">
              <h2>Devenez VIU*</h2>
              <p>(*Very Important Usear)</p>
              <ul className="custom-list">
                <li>
                  Vous êtes un <strong>partenaire stratégique</strong>, invité à
                  la table des décisions pour aider à concevoir les produits et
                  services de demain.
                </li>
                <li>
                  Votre statut privilégié vous donne accès à de nouvelles
                  fonctionnalités et services <strong>en avant-première</strong>
                  .
                </li>
              </ul>
              <button className="cta-button">Comment devenir VIU ?</button>
            </div>
          </div>

          {/* Image de fond */}
          <div className="viu-background">
            <img src={viuImage} alt="VIU background" className="viu-image" />
          </div>
        </section>

        <div className="animated-text-container">
          <svg viewBox="0 0 1000 400" xmlns="http://www.w3.org/2000/svg">
            <text
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              ref={textRef}
              className={`animated-text ${isVisible ? "visible" : ""}`}
            >
              Usearly
            </text>
          </svg>
        </div>
        <footer className="landing-footer">
          <ul className="footer-cgpu">
            <li>
              {" "}
              <p>
                <a href="#">Conditions générales d'utilisation</a>
              </p>
            </li>
            <li>
              {" "}
              <p>
                <a href="#">Nous contacter</a>
              </p>
            </li>
            <li>
              <p>© Usearly 2024</p>
            </li>
          </ul>
        </footer>
      </div>
    </div>
  );
};

export default Home;
