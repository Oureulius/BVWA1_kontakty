import { getDeptIcon } from '../utils/helpers'

/**
 * Sidebar
 */
export default function Sidebar({ departments, departmentCounts, activeDepartment, onDepartmentChange }) {
  return (
    <aside className="kh-sidebar" aria-label="Přehled oddělení">
      {/* Oddělení */}
      <h2 className="kh-sidebar-title">
        <i className="bi bi-diagram-3 me-2" aria-hidden="true"></i>
        Oddělení
      </h2>
      <nav aria-label="Filtrování podle oddělení">
        <ul className="list-unstyled mb-0 d-flex flex-column gap-1">
          <li>
            <button
              className={`kh-dept-list-item ${activeDepartment === null ? 'active' : ''}`}
              onClick={() => onDepartmentChange(null)}
              aria-current={activeDepartment === null ? 'true' : undefined}
              id="sidebar-filter-all"
            >
              <span className="d-flex align-items-center gap-2">
                <i className="bi bi-grid-fill" aria-hidden="true" style={{ fontSize: '0.9rem' }}></i>
                Vše
              </span>
              <span className="dept-count">{departmentCounts['_all'] || 0}</span>
            </button>
          </li>
          {departments.map((dept) => (
            <li key={dept}>
              <button
                className={`kh-dept-list-item ${activeDepartment === dept ? 'active' : ''}`}
                onClick={() => onDepartmentChange(dept)}
                aria-current={activeDepartment === dept ? 'true' : undefined}
                id={`sidebar-filter-${dept.replace(/\s+/g, '-').toLowerCase()}`}
              >
                <span className="d-flex align-items-center gap-2">
                  <i className={getDeptIcon(dept)} aria-hidden="true" style={{ fontSize: '0.9rem' }}></i>
                  {dept}
                </span>
                <span className="dept-count">{departmentCounts[dept] || 0}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Legenda dostupnosti */}
      <hr style={{ borderColor: 'var(--kh-border)' }} />
      <h2 className="kh-sidebar-title">
        <i className="bi bi-circle-fill me-2" style={{ fontSize: '0.5rem' }} aria-hidden="true"></i>
        Legenda
      </h2>
      <ul className="list-unstyled d-flex flex-column gap-2 mt-2 mb-0 ps-1" style={{ fontSize: '0.85rem' }}>
        <li className="d-flex align-items-center gap-2" style={{ color: 'var(--kh-success)' }}>
          <span style={{
            width: '0.5rem', height: '0.5rem', borderRadius: '50%',
            backgroundColor: 'var(--kh-success)', flexShrink: 0
          }}></span>
          <span style={{ color: 'var(--kh-text-secondary)' }}>Dostupný/á</span>
        </li>
        <li className="d-flex align-items-center gap-2" style={{ color: 'var(--kh-danger)' }}>
          <span style={{
            width: '0.5rem', height: '0.5rem', borderRadius: '50%',
            backgroundColor: 'var(--kh-danger)', flexShrink: 0
          }}></span>
          <span style={{ color: 'var(--kh-text-secondary)' }}>Zaneprázdněn/a</span>
        </li>
        <li className="d-flex align-items-center gap-2" style={{ color: 'var(--kh-warning)' }}>
          <span style={{
            width: '0.5rem', height: '0.5rem', borderRadius: '50%',
            backgroundColor: 'var(--kh-warning)', flexShrink: 0
          }}></span>
          <span style={{ color: 'var(--kh-text-secondary)' }}>Nepřítomen/na</span>
        </li>
        <li className="d-flex align-items-center gap-2" style={{ color: 'var(--kh-text-muted)' }}>
          <span style={{
            width: '0.5rem', height: '0.5rem', borderRadius: '50%',
            backgroundColor: 'var(--kh-text-muted)', flexShrink: 0
          }}></span>
          <span style={{ color: 'var(--kh-text-secondary)' }}>Offline</span>
        </li>
      </ul>
    </aside>
  )
}
