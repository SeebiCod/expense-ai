import { useReveal } from "../hooks/useReveal.js";

const STEPS = [
  {
    n: "01",
    title: "Upload your CSV",
    body:
      "Drop in a bank export with date, description and amount. Your data stays on your machine — no third-party API calls.",
  },
  {
    n: "02",
    title: "The model categorizes",
    body:
      "A fine-tuned DistilBERT reads each merchant name and predicts the category with a confidence score. First inference under 100 ms.",
  },
  {
    n: "03",
    title: "Correct it, retrain, repeat",
    body:
      "Every correction becomes training data. Hit retrain and the model gets sharper on your spending. Human-in-the-loop, the way real AI products work.",
  },
];

export default function HowItWorks() {
  const ref = useReveal();
  return (
    <section id="how" className="section" ref={ref}>
      <div className="container">
        <div className="section-header reveal">
          <div className="section-eyebrow">How it works</div>
          <h2>Three steps. No black boxes.</h2>
          <p className="section-sub">
            Everything on this page is open source and running on your own machine.
            You can inspect the model, the training data, and the code.
          </p>
        </div>

        <div className="steps">
          {STEPS.map((s) => (
            <div className="step reveal" key={s.n}>
              <div className="step-num">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
