// Fixed categorical palette — one hue per category, order matters.
// Text stays in --text tokens; color identifies the mark, not the label.
const PALETTE = [
  "#7c6bff", // Groceries
  "#4ea1ff", // Transport
  "#22d3a6", // Restaurants
  "#f5b144", // Subscriptions
  "#f26a6a", // Shopping
  "#a78bfa", // Utilities
  "#38bdf8", // Coffee
  "#fbbf24", // Entertainment
  "#f87171", // Health
  "#4ade80", // Income
];

// Compute per-category totals from a list of transactions.
// Only counts negative amounts (spending), skips positives (income).
function groupSpend(transactions) {
  const totals = new Map();
  for (const t of transactions) {
    if (t.amount >= 0) continue;
    const cat = t.category || t.predicted_category || "Uncategorized";
    totals.set(cat, (totals.get(cat) ?? 0) + Math.abs(t.amount));
  }
  return [...totals.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

export default function SpendChart({ transactions }) {
  const rows = groupSpend(transactions);
  const hasData = rows.length > 0;
  const max = hasData ? Math.max(...rows.map((r) => r.value)) : 1;

  return (
    <div className="card chart-card">
      <h3>Spending by category</h3>
      <p className="card-sub">
        {hasData
          ? `Computed live from ${transactions.length} transactions in your database.`
          : "Upload a CSV or wait for the AI to predict categories — the chart will render live."}
      </p>

      {!hasData ? (
        <div className="chart-empty">
          <strong>No categorized data yet.</strong>
          <br />
          Uploaded CSVs without a <code>category</code> column will fill in here
          once the model is trained (Phase 3+).
        </div>
      ) : (
        <div className="chart" style={{ marginTop: 16 }}>
          {rows.slice(0, 8).map((r, i) => {
            const color = PALETTE[i % PALETTE.length];
            const pct = (r.value / max) * 100;
            return (
              <div key={r.label} className="chart-row">
                <span className="chart-label">{r.label}</span>
                <div className="chart-track">
                  <div
                    className="chart-fill"
                    style={{ width: `${pct}%`, background: color, color }}
                  />
                </div>
                <span className="chart-amount">
                  £{r.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
