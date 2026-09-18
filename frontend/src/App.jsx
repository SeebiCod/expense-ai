import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import Stats from "./components/Stats.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import Demo from "./components/Demo.jsx";
import PoweredBy from "./components/PoweredBy.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <>
      {/* Animated aurora background — pure CSS, no images */}
      <div className="aurora" aria-hidden="true">
        <div className="grid" />
      </div>

      <Nav />
      <main>
        <Hero />
        <Stats />
        <HowItWorks />
        <Demo />
        <PoweredBy />
      </main>
      <Footer />
    </>
  );
}
