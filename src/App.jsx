import { useState, useMemo, useCallback } from 'react'
import { useContacts } from './hooks/useAppState'
import initialContacts from './data/contacts'

import Header from './components/Header'
import Toolbar from './components/Toolbar'
import ContactList from './components/ContactList'
import AddContactForm from './components/AddContactForm'
import ImportExport from './components/ImportExport'
import Toast from './components/Toast'

/**
 * App
 */
export default function App() {
  // ---- Stav ----
  const [confirmDialog, setConfirmDialog] = useState(null)
  const { contacts, addContact, deleteContact, setContacts } = useContacts(initialContacts)
  const [activeTab, setActiveTab] = useState('contacts')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCompany, setActiveCompany] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  const [toasts, setToasts] = useState([])

  // ---- Odvozené hodnoty ----

  const companies = useMemo(() => {
    const set = new Set(contacts.map(c => c.company).filter(Boolean))
    return [...set].sort((a, b) => a.localeCompare(b, 'cs'))
  }, [contacts])

  const companyCounts = useMemo(() => {
    const counts = { '_all': contacts.length }
    contacts.forEach(c => {
      if (c.company) {
        counts[c.company] = (counts[c.company] || 0) + 1
      }
    })
    return counts
  }, [contacts])

  const filteredContacts = useMemo(() => {
    let result = contacts

    if (activeCompany) {
      result = result.filter(c => c.company === activeCompany)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.position.toLowerCase().includes(q) ||
        (c.company && c.company.toLowerCase().includes(q)) ||
        c.email.toLowerCase().includes(q)
      )
    }

    return result
  }, [contacts, activeCompany, searchQuery])

  // ---- Handlery ----

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const handleAddContact = useCallback((newContact) => {
    addContact(newContact)
    addToast(`Kontakt „${newContact.name}" byl úspěšně přidán.`, 'success')
    setActiveTab('contacts') // Přepne na záložku kontaktů po přidání
  }, [addContact, addToast])

  const handleDeleteContact = useCallback((id) => {
    const contact = contacts.find(c => c.id === id)
    setConfirmDialog({ type: 'single', id, name: contact?.name || 'kontakt' })
  }, [contacts])

  const confirmDelete = useCallback(() => {
    if (!confirmDialog) return
    deleteContact(confirmDialog.id)
    addToast(`Kontakt „${confirmDialog.name}" byl smazán.`, 'info')
    setConfirmDialog(null)
  }, [confirmDialog, deleteContact, addToast])

  /** Import: sloučit kontakty */
  const handleImportMerge = useCallback((imported) => {
    imported.forEach(c => addContact(c))
  }, [addContact])

  /** Import: nahradit všechny kontakty */
  const handleImportReplace = useCallback((imported) => {
    setContacts(imported)
  }, [setContacts])

  // ---- Render ----
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header contactCount={contacts.length} />

      <main id="main-content" className="flex-grow-1" role="main">
        <div className="container-fluid px-3 px-lg-4 py-4">

          {/* ===== ZÁLOŽKY ===== */}
          <nav className="kh-tabs" role="tablist" aria-label="Hlavní sekce">
            <button
              className={`kh-tab ${activeTab === 'contacts' ? 'active' : ''}`}
              onClick={() => setActiveTab('contacts')}
              role="tab"
              aria-selected={activeTab === 'contacts'}
              aria-controls="panel-contacts"
              id="tab-contacts"
            >
              Kontakty
            </button>
            <button
              className={`kh-tab ${activeTab === 'add' ? 'active' : ''}`}
              onClick={() => setActiveTab('add')}
              role="tab"
              aria-selected={activeTab === 'add'}
              aria-controls="panel-add"
              id="tab-add"
            >
              Nový kontakt
            </button>
            <button
              className={`kh-tab ${activeTab === 'io' ? 'active' : ''}`}
              onClick={() => setActiveTab('io')}
              role="tab"
              aria-selected={activeTab === 'io'}
              aria-controls="panel-io"
              id="tab-io"
            >
              Import / Export
            </button>
          </nav>

          {/* ===== PANEL: KONTAKTY ===== */}
          {activeTab === 'contacts' && (
            <div role="tabpanel" id="panel-contacts" aria-labelledby="tab-contacts">
              <section className="mb-4">
                <Toolbar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  companies={companies}
                  activeCompany={activeCompany}
                  onCompanyChange={setActiveCompany}
                  companyCounts={companyCounts}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                />
              </section>

              <section aria-label="Kontakty">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div>
                    <h1 className="kh-section-heading">
                      {activeCompany
                        ? activeCompany
                        : 'Všechny kontakty'
                      }
                    </h1>
                    <p className="kh-section-subheading mb-0">
                      {filteredContacts.length === 0
                        ? 'Žádné výsledky'
                        : `${filteredContacts.length} ${filteredContacts.length === 1 ? 'kontakt' : filteredContacts.length < 5 ? 'kontakty' : 'kontaktů'}`
                      }
                      {searchQuery && ` pro „${searchQuery}"`}
                    </p>
                  </div>
                </div>

                <ContactList
                  contacts={filteredContacts}
                  onDelete={handleDeleteContact}
                  viewMode={viewMode}
                />
              </section>
            </div>
          )}

          {/* ===== PANEL: NOVÝ KONTAKT ===== */}
          {activeTab === 'add' && (
            <div role="tabpanel" id="panel-add" aria-labelledby="tab-add">
              <AddContactForm onAddContact={handleAddContact} />
            </div>
          )}

          {/* ===== PANEL: IMPORT / EXPORT ===== */}
          {activeTab === 'io' && (
            <div role="tabpanel" id="panel-io" aria-labelledby="tab-io">
              <ImportExport
                contacts={contacts}
                onImport={handleImportMerge}
                onReplace={handleImportReplace}
              />
            </div>
          )}
        </div>
      </main>

      {/* Toast notifikace */}
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
      ))}

      {/* Potvrzovací dialog */}
      {confirmDialog && (
        <div className="kh-confirm-overlay" onClick={() => setConfirmDialog(null)}>
          <div className="kh-confirm-dialog" onClick={e => e.stopPropagation()} role="alertdialog" aria-label="Potvrzení smazání">
            <h3>Smazat kontakt?</h3>
            <p>Opravdu chcete smazat kontakt &bdquo;{confirmDialog.name}&ldquo;?</p>
            <div className="d-flex gap-2 justify-content-center">
              <button className="kh-btn-secondary" onClick={() => setConfirmDialog(null)}>
                Zrušit
              </button>
              <button
                className="kh-btn-primary"
                style={{ background: 'var(--kh-danger)' }}
                onClick={confirmDelete}
              >
                Smazat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
