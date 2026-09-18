import { useEffect, useRef, useState } from "react";
import { api } from "../api/client.js";
import { useReveal } from "../hooks/useReveal.js";
import SpendChart from "./SpendChart.jsx";

function fmtAmount(n) {
  const abs = Math.abs(n).toLocaleString(undefined, {
    style: "currency",
    currency: "GBP",
  });
  return n < 0 ? `-${abs.replace("-", "")}` : abs;
}

export default function Demo() {
  const [txs, setTxs] = useState([]);
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState({ tone: "", msg: "" });
  const fileRef = useRef(null);
  const revealRef = useReveal();

  const refresh = async () => {
    try {
      const rows = await api.listTransactions(500);
      setTxs(rows);
    } catch (e) {
      setStatus({ tone: "error", msg: `Could not load: ${e.message}` });
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setBusy(true);
    setStatus({ tone: "", msg: "Uploading…" });
    try {
      const created = await api.uploadCsv(file);
      setStatus({ tone: "success", msg: `Inserted ${created.length} transactions.` });
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      refresh();
    } catch (e) {
      setStatus({ tone: "error", msg: e.message });
    } finally {
      setBusy(false);
    }
  };

  const clearAll = async () => {
    if (!confirm("Delete every transaction from the database?")) return;
    setBusy(true);
    try {
      await api.deleteAll();
      setStatus({ tone: "success", msg: "Database cleared." });
      refresh();
    } catch (e) {
      setStatus({ tone: "error", msg: e.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section id="demo" className="section" ref={revealRef}>
      <div className="container">
        <div className="section-header reveal">
          <div className="section-eyebrow">Live demo</div>
          <h2>Try it right here.</h2>
          <p className="section-sub">
            This is the actual working app — connected to a FastAPI backend on your
            machine. Upload a CSV with columns <code>date, description, amount</code>{" "}
            (and optionally <code>category</code>).
          </p>
        </div>

        <div className="demo-grid">
          <div className="card reveal">
            <h3>Upload transactions</h3>
            <p className="card-sub">
              Try it with your bank export, or grab a sample. Your file never leaves
              this machine.
            </p>

            <form onSubmit={submit} className="upload-zone">
              <input
                ref={fileRef}
                type="file"
                accept=".csv"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                aria-label="CSV file"
              />
              <div className="upload-hint">
                Required columns: <code>date, description, amount</code>. Optional:{" "}
                <code>category</code>.
              </div>
              <div className="upload-actions">
                <button type="submit" className="btn btn-primary" disabled={!file || busy}>
                  {busy ? "Working…" : "Upload CSV"}
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={clearAll}
                  disabled={busy || txs.length === 0}
                >
                  Clear database
                </button>
              </div>
            </form>

            <div className={`status-line ${status.tone}`}>{status.msg}</div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th style={{ textAlign: "right" }}>Amount</th>
                    <th>Category</th>
                    <th>AI prediction</th>
                  </tr>
                </thead>
                <tbody>
                  {txs.length === 0 ? (
                    <tr className="empty-row">
                      <td colSpan={5}>No transactions yet. Upload a CSV to begin.</td>
                    </tr>
                  ) : (
                    txs.slice(0, 30).map((t) => (
                      <tr key={t.id}>
                        <td style={{ color: "var(--text-muted)" }}>{t.date}</td>
                        <td>{t.description}</td>
                        <td className={`amt ${t.amount < 0 ? "neg" : "pos"}`} style={{ textAlign: "right" }}>
                          {fmtAmount(t.amount)}
                        </td>
                        <td>
                          {t.category ? (
                            <span className="pill" style={{ color: "var(--text)", borderColor: "var(--border-strong)" }}>
                              {t.category}
                            </span>
                          ) : (
                            <span style={{ color: "var(--text-dim)" }}>—</span>
                          )}
                        </td>
                        <td>
                          {t.predicted_category ? (
                            <span className="pill" style={{ color: "var(--brand-2)", borderColor: "rgba(78,161,255,0.35)" }}>
                              {t.predicted_category}
                              {t.confidence != null && ` · ${Math.round(t.confidence * 100)}%`}
                            </span>
                          ) : (
                            <span className="pill awaiting">awaiting model</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="reveal">
            <SpendChart transactions={txs} />
          </div>
        </div>
      </div>
    </section>
  );
}
