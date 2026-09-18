const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function handle(res) {
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (body?.detail) msg = typeof body.detail === "string" ? body.detail : JSON.stringify(body.detail);
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export const api = {
  health: async () => handle(await fetch(`${BASE}/health`)),

  uploadCsv: async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    return handle(await fetch(`${BASE}/upload`, { method: "POST", body: fd }));
  },

  listTransactions: async (limit = 500) =>
    handle(await fetch(`${BASE}/transactions?limit=${limit}`)),

  deleteAll: async () =>
    handle(await fetch(`${BASE}/transactions`, { method: "DELETE" })),
};
