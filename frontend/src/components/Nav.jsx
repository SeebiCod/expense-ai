export default function Nav() {
  return (
    <nav className="nav">
      <div className="container nav-inner">
        <a href="#top" className="brand" aria-label="Expense AI home">
          <span className="brand-mark" aria-hidden="true" />
          Expense AI
        </a>
        <div className="nav-links">
          <a href="#how">How it works</a>
          <a href="#demo">Show demo</a>
          <a href="#tech">Built with</a>
        </div>
        <a href="#demo" className="btn btn-primary" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
          Try it now
        </a>
      </div>
    </nav>
  );
}
