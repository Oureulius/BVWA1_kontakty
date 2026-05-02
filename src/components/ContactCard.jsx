import { useState, useCallback } from 'react'

/**
 * ContactCard – karta kontaktu.
 */
export default function ContactCard({ contact, onDelete, viewMode }) {
  if (viewMode === 'list') {
    return (
      <article className="kh-contact-card list-view kh-fade-in" aria-label={`Kontakt: ${contact.name}`}>
        <div style={{ flex: '1 1 0', minWidth: 0 }}>
          <h3 className="kh-contact-name">{contact.name}</h3>
          <p className="kh-contact-position mb-0">{contact.position}</p>
        </div>

        {contact.company && <span className="kh-company-badge">{contact.company}</span>}

        <a href={`mailto:${contact.email}`} className="kh-contact-detail">{contact.email}</a>
        <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="kh-contact-detail">{contact.phone}</a>
        {contact.notes && (
          <p style={{ margin: '0.4rem 0 0', fontSize: '0.82rem', color: 'var(--kh-text-muted)', fontStyle: 'italic', wordBreak: 'break-word' }}>
            {contact.notes}
          </p>
        )}

        <div className="d-flex gap-2">
          <button
            className="kh-card-action delete"
            onClick={() => onDelete(contact.id)}
            title="Smazat kontakt"
          >
            Smazat
          </button>
        </div>
      </article>
    )
  }

  // Grid zobrazení
  return (
    <article className="kh-contact-card kh-fade-in" aria-label={`Kontakt: ${contact.name}`}>
      <div className="d-flex align-items-start justify-content-between mb-2">
        <div style={{ minWidth: 0 }}>
          <h3 className="kh-contact-name">{contact.name}</h3>
          <p className="kh-contact-position">{contact.position}</p>
        </div>
        <div className="d-flex gap-2 flex-shrink-0 ms-2">
          <button className="kh-card-action delete" onClick={() => onDelete(contact.id)}>
            ✕
          </button>
        </div>
      </div>

      {contact.company && (
        <div className="mb-2">
          <span className="kh-company-badge">{contact.company}</span>
        </div>
      )}

      <div className="d-flex flex-column gap-1">
        <a href={`mailto:${contact.email}`} className="kh-contact-detail">{contact.email}</a>
        <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="kh-contact-detail">{contact.phone}</a>
        {contact.notes && (
          <p style={{ margin: '0.4rem 0 0', fontSize: '0.82rem', color: 'var(--kh-text-muted)', fontStyle: 'italic', wordBreak: 'break-word' }}>
            {contact.notes}
          </p>
        )}
      </div>
    </article>
  )
}
