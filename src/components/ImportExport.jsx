import { useRef, useState, useCallback } from 'react'

/**
 * ImportExport – import a export kontaktů ve formátu JSON nebo CSV.
 */
export default function ImportExport({ contacts, onImport, onReplace }) {
  const fileInputRef = useRef(null)
  const [importMode, setImportMode] = useState('merge')
  const [importStatus, setImportStatus] = useState(null)

  /** Export kontaktů jako JSON */
  const handleExportJSON = useCallback(() => {
    if (contacts.length === 0) {
      setImportStatus({ type: 'error', message: 'Žádné kontakty k exportu.' })
      return
    }
    const data = JSON.stringify(contacts, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `kontakty_${new Date().toISOString().slice(0, 10)}.json`
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setImportStatus({ type: 'success', message: `Exportováno ${contacts.length} kontaktů (JSON).` })
  }, [contacts])

  /** Export kontaktů jako CSV */
  const handleExportCSV = useCallback(() => {
    if (contacts.length === 0) {
      setImportStatus({ type: 'error', message: 'Žádné kontakty k exportu.' })
      return
    }
    const header = 'Jméno,Funkce,Firma,Email,Telefon,Poznámka'
    const rows = contacts.map(c =>
      [c.name, c.position, c.company, c.email, c.phone, c.notes || '']
        .map(val => `"${(val || '').replace(/"/g, '""')}"`)
        .join(',')
    )
    const csv = [header, ...rows].join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `kontakty_${new Date().toISOString().slice(0, 10)}.csv`
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setImportStatus({ type: 'success', message: `Exportováno ${contacts.length} kontaktů (CSV).` })
  }, [contacts])

  /** Import souboru */
  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const text = event.target.result
        let imported = []

        if (file.name.endsWith('.json')) {
          // ---- JSON import ----
          const parsed = JSON.parse(text)
          if (!Array.isArray(parsed)) {
            setImportStatus({ type: 'error', message: 'JSON soubor musí obsahovat pole kontaktů.' })
            return
          }
          imported = parsed.map((item, i) => ({
            id: Date.now() + i,
            name: item.name || item['Jméno'] || '',
            position: item.position || item['Funkce'] || '',
            company: item.company || item['Firma'] || '',
            email: item.email || item['Email'] || '',
            phone: item.phone || item['Telefon'] || '',
            notes: item.notes || item['Poznámka'] || '',
          })).filter(c => c.name.trim() !== '')

        } else if (file.name.endsWith('.csv')) {
          // ---- CSV import ----
          const lines = text.split(/\r?\n/).filter(l => l.trim())
          if (lines.length < 2) {
            setImportStatus({ type: 'error', message: 'CSV soubor je prázdný nebo nemá data.' })
            return
          }

          for (let i = 1; i < lines.length; i++) {
            const cols = parseCSVLine(lines[i])
            if (cols.length >= 5 && cols[0].trim()) {
              imported.push({
                id: Date.now() + i,
                name: cols[0].trim(),
                position: cols[1].trim(),
                company: cols[2].trim(),
                email: cols[3].trim(),
                phone: cols[4].trim(),
                notes: cols[5] !== undefined ? cols[5].trim() : '',
              })
            }
          }
        } else {
          setImportStatus({ type: 'error', message: 'Podporované formáty: .json a .csv' })
          return
        }

        if (imported.length === 0) {
          setImportStatus({ type: 'error', message: 'V souboru nebyly nalezeny žádné platné kontakty.' })
          return
        }

        if (importMode === 'replace') {
          onReplace(imported)
        } else {
          onImport(imported)
        }

        setImportStatus({
          type: 'success',
          message: `Importováno ${imported.length} kontaktů (${importMode === 'replace' ? 'nahrazení' : 'sloučení'}).`
        })
      } catch (err) {
        setImportStatus({ type: 'error', message: `Chyba při čtení souboru: ${err.message}` })
      }
    }

    reader.readAsText(file, 'UTF-8')
    /* Reset file input */
    e.target.value = ''
  }, [importMode, onImport, onReplace])

  return (
    <section className="kh-io-section" aria-label="Import a export kontaktů">
      {/* ---- EXPORT ---- */}
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--kh-text)' }}>
        Export kontaktů
      </h2>
      <p style={{ fontSize: '0.875rem', color: 'var(--kh-text-secondary)', marginBottom: '0.75rem' }}>
        Stáhněte si aktuální kontakty ve zvoleném formátu.
      </p>
      <div className="d-flex gap-2 mb-4">
        <button className="kh-btn-primary" onClick={handleExportJSON} id="export-json-btn">
          Exportovat JSON
        </button>
        <button className="kh-btn-secondary" onClick={handleExportCSV} id="export-csv-btn">
          Exportovat CSV
        </button>
      </div>

      <hr style={{ borderColor: 'var(--kh-border)' }} />

      {/* ---- IMPORT ---- */}
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', marginTop: '1rem', color: 'var(--kh-text)' }}>
        Import kontaktů
      </h2>
      <p style={{ fontSize: '0.875rem', color: 'var(--kh-text-secondary)', marginBottom: '0.75rem' }}>
        Nahrajte soubor ve formátu JSON nebo CSV.
        CSV musí obsahovat hlavičku: Jméno, Funkce, Firma, Email, Telefon, Poznámka.
      </p>

      {/* Režim importu */}
      <div className="d-flex gap-3 mb-3">
        <label className="d-flex align-items-center gap-2" style={{ fontSize: '0.875rem', cursor: 'pointer' }}>
          <input
            type="radio"
            name="importMode"
            value="merge"
            checked={importMode === 'merge'}
            onChange={() => setImportMode('merge')}
          />
          Sloučit s existujícími
        </label>
        <label className="d-flex align-items-center gap-2" style={{ fontSize: '0.875rem', cursor: 'pointer' }}>
          <input
            type="radio"
            name="importMode"
            value="replace"
            checked={importMode === 'replace'}
            onChange={() => setImportMode('replace')}
          />
          Nahradit všechny
        </label>
      </div>

      {/* Nahrání souboru */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.csv"
        className="kh-file-input"
        onChange={handleFileChange}
        id="import-file-input"
        aria-label="Vyberte soubor k importu"
      />
      <label
        htmlFor="import-file-input"
        className="kh-file-label"
      >
        Klikněte pro výběr souboru (.json nebo .csv)
      </label>

      {/* Stav importu/exportu */}
      {importStatus && (
        <div
          className="mt-3 p-2"
          role="status"
          style={{
            fontSize: '0.85rem',
            fontWeight: 500,
            color: importStatus.type === 'success' ? 'var(--kh-success)' : 'var(--kh-danger)',
            background: importStatus.type === 'success' ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
            borderRadius: 'var(--kh-radius-sm)',
            padding: '0.6rem 0.85rem',
          }}
        >
          {importStatus.message}
        </div>
      )}
    </section>
  )
}

/**
 * CSV parser
 */
function parseCSVLine(line) {
  const result = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"'
        i++
      } else if (ch === '"') {
        inQuotes = false
      } else {
        current += ch
      }
    } else {
      if (ch === '"') {
        inQuotes = true
      } else if (ch === ',') {
        result.push(current)
        current = ''
      } else {
        current += ch
      }
    }
  }
  result.push(current)
  return result
}
