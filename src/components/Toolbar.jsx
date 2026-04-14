/**
 * Toolbar – vyhledávání, filtry, akce.
 */
export default function Toolbar({
  searchQuery,
  onSearchChange,
  companies,
  activeCompany,
  onCompanyChange,
  companyCounts,
  viewMode,
  onViewModeChange
}) {
  return (
    <section className="kh-toolbar" aria-label="Vyhledávání a filtrování">
      <div className="d-flex flex-column flex-sm-row gap-3 mb-3 align-items-sm-center">
        <div className="flex-grow-1">
          <input
            type="search"
            className="form-control kh-search-input"
            placeholder="Hledat podle jména, funkce nebo firmy…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Vyhledávání kontaktů"
            id="contact-search-input"
          />
        </div>

        <div className="d-flex gap-2 align-items-center flex-shrink-0 flex-wrap">
          <div className="kh-view-toggle btn-group" role="group" aria-label="Režim zobrazení">
            <button
              className={`btn btn-sm ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => onViewModeChange('grid')}
              aria-pressed={viewMode === 'grid'}
              id="view-grid-btn"
            >
              Mřížka
            </button>
            <button
              className={`btn btn-sm ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => onViewModeChange('list')}
              aria-pressed={viewMode === 'list'}
              id="view-list-btn"
            >
              Seznam
            </button>
          </div>
        </div>
      </div>

      {companies.length > 0 && (
        <div className="kh-filter-pills" role="group" aria-label="Filtr podle firmy">
          <button
            className={`kh-filter-pill ${activeCompany === null ? 'active' : ''}`}
            onClick={() => onCompanyChange(null)}
            aria-pressed={activeCompany === null}
            id="filter-all"
          >
            Vše
            <span className="pill-count">{companyCounts['_all'] || 0}</span>
          </button>
          {companies.map((company) => (
            <button
              key={company}
              className={`kh-filter-pill ${activeCompany === company ? 'active' : ''}`}
              onClick={() => onCompanyChange(company)}
              aria-pressed={activeCompany === company}
            >
              {company}
              <span className="pill-count">{companyCounts[company] || 0}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
