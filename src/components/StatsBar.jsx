/**
 * StatsBar
 */
export default function StatsBar({ contacts, favorites }) {
  const total = contacts.length
  const available = contacts.filter(c => c.availability === 'available').length
  const departments = new Set(contacts.map(c => c.department)).size
  const favCount = favorites.size

  return (
    <section className="kh-stats-bar" aria-label="Statistiky kontaktů">
      <div className="kh-stat-card kh-fade-in">
        <div className="stat-value">{total}</div>
        <div className="stat-label">Celkem kontaktů</div>
      </div>
      <div className="kh-stat-card kh-fade-in">
        <div className="stat-value" style={{ color: 'var(--kh-success)' }}>{available}</div>
        <div className="stat-label">Dostupných</div>
      </div>
      <div className="kh-stat-card kh-fade-in">
        <div className="stat-value" style={{ color: 'var(--kh-accent)' }}>{departments}</div>
        <div className="stat-label">Oddělení</div>
      </div>
      <div className="kh-stat-card kh-fade-in">
        <div className="stat-value" style={{ color: 'var(--kh-favorite)' }}>{favCount}</div>
        <div className="stat-label">Oblíbených</div>
      </div>
    </section>
  )
}
