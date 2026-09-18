import { useReveal } from "../hooks/useReveal.js";

const TILES = [
  {
    kbd: "Frontend",
    title: "React + Vite",
    body: "Small, fast, easy to reason about. No design frameworks — plain CSS with modern tokens.",
  },
  {
    kbd: "API",
    title: "FastAPI",
    body: "Type-hinted Python routes with auto-generated OpenAPI docs at /docs. Async by default.",
  },
  {
    kbd: "Data",
    title: "SQLite → Postgres",
    body: "One file locally, real database in production. Same SQLAlchemy models either way.",
  },
  {
    kbd: "Model",
    title: "DistilBERT + PyTorch",
    body: "66M-parameter transformer, fine-tuned on your own labeled transactions with HuggingFace.",
  },
  {
    kbd: "Baseline",
    title: "scikit-learn",
    body: "TF-IDF + logistic regression as a benchmark. If the transformer can't beat this, it isn't worth shipping.",
  },
  {
    kbd: "Deploy",
    title: "Docker + AWS + nginx",
    body: "Same box you'd use in production. Reverse-proxied, HTTPS via Let's Encrypt, CI on GitHub Actions.",
  },
];

export default function PoweredBy() {
  const ref = useReveal();
  return (
    <section id="tech" className="section" ref={ref}>
      <div className="container">
        <div className="section-header reveal">
          <div className="section-eyebrow">What powers it</div>
          <h2>Real production stack. Nothing hidden.</h2>
          <p className="section-sub">
            Every piece was picked so a working AI engineer would recognize it. No
            magic no-code layer between you and the model.
          </p>
        </div>

        <div className="tech-grid">
          {TILES.map((t) => (
            <div key={t.title} className="tech-tile reveal">
              <span className="kbd">{t.kbd}</span>
              <h4>{t.title}</h4>
              <p>{t.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
