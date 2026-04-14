import ContactCard from './ContactCard'

/**
 * ContactList – seznam/mřížka kontaktů.
 */
export default function ContactList({ contacts, onDelete, viewMode }) {
  if (contacts.length === 0) {
    return (
      <div className="kh-empty-state" role="status">
        <p className="empty-title">Zatím žádné kontakty</p>
        <p className="empty-text">
          Přidejte svůj první kontakt v záložce „Nový kontakt".
        </p>
      </div>
    )
  }

  if (viewMode === 'grid') {
    return (
      <div className="row g-3" role="list" aria-label="Seznam kontaktů">
        {contacts.map(contact => (
          <div className="col-12 col-sm-6 col-xl-4" key={contact.id} role="listitem">
            <ContactCard
              contact={contact}
              onDelete={onDelete}
              viewMode={viewMode}
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="d-flex flex-column gap-2" role="list" aria-label="Seznam kontaktů">
      {contacts.map(contact => (
        <div key={contact.id} role="listitem">
          <ContactCard
            contact={contact}
            onDelete={onDelete}
            viewMode={viewMode}
          />
        </div>
      ))}
    </div>
  )
}
