/**
 * Header – hlavička aplikace.
 */
export default function Header({ contactCount }) {
  return (
    <header className="kh-header" role="banner">
      <a href="#main-content" className="kh-skip-link">
        Přeskočit na obsah
      </a>

      <nav className="navbar navbar-expand py-2" aria-label="Hlavní navigace">
        <div className="container-fluid px-3 px-lg-4">
          <a className="navbar-brand" href="/" aria-label="PKbau-kontakty – domovská stránka">
            PKbau-kontakty
          </a>

          <div className="d-flex align-items-center gap-3">
            <span style={{ fontSize: '0.85rem', color: 'var(--kh-text-secondary)' }}>
              {contactCount} kontaktů
            </span>
          </div>
        </div>
      </nav>
    </header>
  )
}
