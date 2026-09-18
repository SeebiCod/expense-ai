import { useCountUp } from "../hooks/useCountUp.js";
import { useReveal } from "../hooks/useReveal.js";

function Stat({ target, suffix = "", label, decimals = 0 }) {
  const [ref, value] = useCountUp(target, 1600);
  const display =
    decimals === 0 ? Math.round(value).toLocaleString() : value.toFixed(decimals);
  return (
    <div ref={ref} className="stat">
      <div className="stat-value">
        {display}
        {suffix}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default function Stats() {
  const revealRef = useReveal();
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container" ref={revealRef}>
        <div className="stats reveal">
          <Stat target={10} label="Spending categories" />
          <Stat target={1500} label="Training rows generated" />
          <Stat target={87} suffix="%" label="Baseline accuracy" />
          <Stat target={66} suffix="M" label="Model parameters (DistilBERT)" />
        </div>
      </div>
    </section>
  );
}
