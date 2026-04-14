import { useState, useEffect, useCallback } from 'react'

/**
 * Hook pro správu kontaktů uložených v localStorage.
 * Kontakty se načtou při startu a ukládají při každé změně.
 */
export function useContacts(initialContacts = []) {
  const [contacts, setContacts] = useState(() => {
    try {
      const saved = localStorage.getItem('kh-contacts')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) return parsed
      }
    } catch { /* fallback to initial */ }
    return initialContacts
  })

  // Ukládat kontakty do localStorage při každé změně
  useEffect(() => {
    localStorage.setItem('kh-contacts', JSON.stringify(contacts))
  }, [contacts])

  /** Přidat nový kontakt */
  const addContact = useCallback((contact) => {
    setContacts(prev => [contact, ...prev])
  }, [])

  /** Smazat kontakt podle ID */
  const deleteContact = useCallback((id) => {
    setContacts(prev => prev.filter(c => c.id !== id))
  }, [])

  /** Smazat všechny kontakty */
  const deleteAllContacts = useCallback(() => {
    setContacts([])
  }, [])

  return { contacts, setContacts, addContact, deleteContact, deleteAllContacts }
}

