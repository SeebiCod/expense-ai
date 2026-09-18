import { useCountUp } from "../hooks/useCountUp.js";

// Small SVG "spend distribution" mockup that lives in the hero card.
// Uses fixed demo values so the hero looks alive even before upload.
function HeroPreview() {
  const bars = [
    { label: "Groceries",     value: 320, color: "#7c6bff" },
    { label: "Transport",     value: 210, color: "#4ea1ff" },
    { label: "Restaurants",   value: 180, color: "#22d3a6" },
    { label: "Subscriptions", value: 140, color: "#f5b144" },
    { label: "Shopping",      value: 110, color: "#f26a6a" },
    { label: "Utilities",     value:  95, color: "#a78bfa" },
  ];
  const max = Math.max(...bars.map((b) => b.value));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            September · categorized by AI
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 600, marginTop: 4 }}>
            £1,055.00 spent
          </div>
        </div>
        <div className="pill" style={{ color: "var(--success)", borderColor: "rgba(34,211,166,0.35)" }}>
          ● model: distilbert-base
        </div>
      </div>

      <div className="chart">
        {bars.map((b) => (
          <div className="chart-row" key={b.label}>
            <span className="chart-label">{b.label}</span>
            <div className="chart-track">
              <div
                className="chart-fill"
                style={{
                  width: `${(b.value / max) * 100}%`,
                  background: b.color,
                  color: b.color,
                }}
              />
            </div>
            <span className="chart-amount">£{b.value.toFixed(0)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  const [ref, acc] = useCountUp(87, 1500);
  return (
    <header id="top" className="section hero">
      <div className="container">
        <span className="hero-eyebrow">
          <span className="dot" />
          Learning-first · you own the model
        </span>

        <h1>
          Categorize your spending with a model <span className="accent">you actually own</span>.
        </h1>

        <p>
          Upload a bank CSV, fine-tune a real transformer on your own transactions,
          and see exactly where your money goes. Built end-to-end so you learn how
          modern AI products are shipped — not just how to prompt them.
        </p>

        <div className="hero-cta">
          <a href="#demo" className="btn btn-primary">Try the live demo →</a>
          <a href="#how" className="btn btn-ghost">See how it works</a>
        </div>

        <div ref={ref} style={{ marginTop: 40, display: "inline-block", color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Fine-tuned baseline hits{" "}
          <span style={{ color: "var(--text)", fontFamily: "var(--font-display)", fontWeight: 600 }}>
            {Math.round(acc)}% accuracy
          </span>{" "}
          on synthetic UK transactions.
        </div>

        <div className="hero-mock">
          <HeroPreview />
        </div>
      </div>
    </header>
  );
}
