import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

import karinVideo from '../../assets/images/karine.mov';
import backgroundImage from '../../assets/Usearly.png';
import imageU from '../../assets/images/logoU.svg';
import errorImg from '../../assets/images/404.svg';
import carousel1 from '../../assets/images/thank.svg';
import carousel2 from '../../assets/images/woman-idea.svg';
import carousel3 from '../../assets/images/agace.svg';
import bigUImage from '../../assets/images/U-img.png';
import viuImage from '../../assets/images/imgVIU.png';
import mockup from '../../assets/images/phone.svg';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Home.scss';
//import ulogo from '../../assets/images/U-img.png';
//import ParticlesBackground from './ParticuleBackground';
//import { initParticles } from './particules';
//import ParticlesBackground from './ParticuleBackground';
//import js from '@src/pages/home/particules';
//import js from './particules';





//import './particules'

const Home: React.FC = () => {

  /*   useEffect(() => {
      initParticles();
    }, []); */

  return (
    <div className="container">
      <div className="landing-page">
        <section>
          <header className="landing-header">
            <div className="header-content">
              <h1>Améliorer l’expérience sur vos sites et apps !</h1>
              <p>
                La première application qui connecte les utilisateurs aux marques
                pour <strong>collaborer</strong> et <strong>co-créer</strong> !
              </p>
              <button className="cta-button">Je m'inscris</button>
            </div>

            <div className="header-image">
              {/* <div className="particles-container"> */}
              <img src={imageU} alt="logo u" />
            </div>

          </header>

          {/* Section 2: Logos */}
          <section className="brand-logos">
            <img src="/images/spotify.png" alt="Spotify image" className="brand-logo" />
            <img src="/images/laredoute.png" alt="Laredoute image" className="brand-logo" />
            <img src="/images/netflix.png" alt="Netflix image" className="brand-logo" />
            <img src="/images/doc.png" alt="Doctolib image" className="brand-logo" />
            <img src="/images/amazon.png" alt="Amazon image" className="brand-logo" />
            <img src="/images/decath.png" alt="Decathlon image" className="brand-logo" />
          </section>
        </section>
        {/* Section 3: Story */}
        {/*         <section className="story-section">
          <div className="story-container">
            <img src={experience} alt="Story" className="story-image" />
            <div className="story-text">
              <p>
                Karine veut faire une surprise à son copain et le rejoindre le week-end prochain. Elle se connecte à SCNF Connect pour acheter son billet.
              </p>
            </div>
          </div>

          <div className="app-buttons">
            <p>
              Téléchargez l'appli et contribuez à améliorer dès aujourd'hui ! <br />
              Avec Usearly, vos idées et vos retours ont un vrai impact.
            </p>
            <div>
              <img src="/images/Logo_Google_play.png" alt="Google Play Store Logo" />
              <img src="/images/apple-app-store-logo.png" alt="Apple App Store Logo" />
            </div>
          </div>

        </section> */}

        <section className="story-section">
          <div className="story-container">
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
            <div className="story-text">
              <p>
                Karine veut faire une surprise à son copain et le rejoindre le week-end prochain. Elle se connecte à SCNF Connect pour acheter son billet.
              </p>
            </div>
          </div>

          <div className="app-buttons">
            <p>
              Téléchargez l'appli et contribuez à améliorer dès aujourd'hui ! <br />
              Avec Usearly, vos idées et vos retours ont un vrai impact.
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
            <h2>Exprimez-vous au moment même où vous rencontrez un bug !</h2>
            <p>
              Exprimez-vous en temps réel : <strong>signalez</strong> un problème, <strong>félicitez</strong> pour une fonctionnalité qui vous plaît, ou <strong>suggérez</strong> une idée d'amélioration. En quelques clics, faites entendre votre voix auprès des marques.
            </p>
            <button className="cta-button">Je m'inscris</button>
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
              autoplay={{ delay: 3000, disableOnInteraction: false }}
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
                      Une fonctionnalité vous simplifie la vie ? <span className="highlight">Félicitez !</span>
                    </h2>
                    <p>
                      Avec Usearly, vous êtes enfin entendu. <strong>Vraiment.</strong>
                    </p>
                    <p>
                      Exprimez vos coups de cœur, vous gagnez des points et aidez la communauté à découvrir les meilleures nouveautés.
                      Ensemble, mettons en avant les marques les plus créatives pour que chacun profite des innovations qui font la différence !
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
                      Vous avez <span className="highlight">une idée</span> d'amélioration à suggérer ?
                    </h2>
                    <p>
                      Avec Usearly, vous êtes enfin entendu. <strong>Vraiment.</strong>
                    </p>
                    <p>
                      Suggérez vos idées ! Elles seront visibles par la communauté pour être likées et gagner en visibilité.
                      Plus votre idée plaît, plus vous accumulez des points, et si la marque l’adopte, vous êtes récompensé !
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
                      <span className="highlight">Agacé</span> par un chargement trop lent ?
                    </h2>
                    <p>
                      Avec Usearly, vous êtes enfin entendu. <strong>Vraiment.</strong>
                    </p>
                    <p>
                      Exprimez-vous au moment même où ça arrive ! Signalez votre problème en 2 clics.
                      Découvrez si d'autres utilisateurs rencontrent le même souci et recevez des solutions en temps réel.
                      Ne laissez plus vos frustrations en suspens :
                      faites-vous entendre instantanément et contribuez pour des améliorations concrètes.
                    </p>
                  </div>
                </div>
              </SwiperSlide>

            </Swiper>
          </div>
        </section>

        <section className="viu-section">
          <div className="viu-content-wrapper">
            {/* Image Big U */}
            <div className="big-u-wrapper">
              <img src={bigUImage} alt="Large U" className="big-u" />
            </div>
            {/* Contenu principal */}
            <div className="viu-content">

              <h2>Devenez VIU*</h2>
              <p>(*Very Important Usear)</p>
              <ul className="custom-list">
                <li>Vous êtes un.e <strong>partenaire stratégique</strong>, invité.e à la table des décisions pour aider à concevoir les produits et services de demain.</li>
                <li>Accès à de nouvelles fonctionnalités et services <strong>avant tout le monde</strong>.</li>
              </ul>
              <button className="cta-button">Comment devenir VIU ?</button>
            </div>
          </div>

          {/* Image de fond */}
          <div className="viu-background">
            <img src={viuImage} alt="VIU background" className="viu-image" />
          </div>
        </section>

        <div className="background-text">
          <img src={backgroundImage} alt="Usearly Background" className="background-image" />
        </div>
        <footer className="landing-footer">
          <ul className='footer-cgpu'>
            <li> <p><a href="#">Conditions générales d'utilisation</a></p></li>
            <li> <p><a href="#">Nous contacter</a></p></li>
            <li><p>© Usearly 2024</p></li>
          </ul>
        </footer>
      </div>
    </div>
  );
};

export default Home;