import { useState, useCallback } from 'react'

/**
 * AddContactForm – formulář pro přidání kontaktu. Bez ikon.
 */
const initialFormState = {
  name: '',
  position: '',
  email: '',
  phone: '',
  company: '',
}

export default function AddContactForm({ onAddContact }) {
  const [form, setForm] = useState(initialFormState)
  const [errors, setErrors] = useState({})

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }, [])

  const validate = useCallback(() => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Jméno je povinné'
    if (!form.position.trim()) newErrors.position = 'Funkce je povinná'
    if (!form.email.trim()) {
      newErrors.email = 'Email je povinný'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Zadejte platný email'
    }
    if (!form.phone.trim()) newErrors.phone = 'Telefon je povinný'
    if (!form.company.trim()) newErrors.company = 'Firma je povinná'
    return newErrors
  }, [form])

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const newContact = {
      id: Date.now(),
      name: form.name.trim(),
      position: form.position.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      company: form.company.trim(),
    }
    onAddContact(newContact)
    setForm(initialFormState)
    setErrors({})
  }, [form, validate, onAddContact])

  const handleReset = useCallback(() => {
    setForm(initialFormState)
    setErrors({})
  }, [])

  return (
    <section className="kh-form-section" aria-label="Přidat nový kontakt">
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, marginBottom: '1rem', color: 'var(--kh-text)' }}>
        Nový kontakt
      </h2>

      <form onSubmit={handleSubmit} noValidate id="add-contact-form">
        <div className="d-flex flex-column gap-3">
          <div>
            <label htmlFor="input-name" className="form-label">
              Jméno a příjmení <span style={{ color: 'var(--kh-danger)' }}>*</span>
            </label>
            <input type="text" className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              id="input-name" name="name" value={form.name} onChange={handleChange}
              autoComplete="name" required />
            {errors.name && <div className="invalid-feedback" role="alert">{errors.name}</div>}
          </div>

          <div>
            <label htmlFor="input-position" className="form-label">
              Funkce <span style={{ color: 'var(--kh-danger)' }}>*</span>
            </label>
            <input type="text" className={`form-control ${errors.position ? 'is-invalid' : ''}`}
              id="input-position" name="position" value={form.position} onChange={handleChange}
              required />
            {errors.position && <div className="invalid-feedback" role="alert">{errors.position}</div>}
          </div>

          <div>
            <label htmlFor="input-company" className="form-label">
              Firma <span style={{ color: 'var(--kh-danger)' }}>*</span>
            </label>
            <input type="text" className={`form-control ${errors.company ? 'is-invalid' : ''}`}
              id="input-company" name="company" value={form.company} onChange={handleChange}
              required />
            {errors.company && <div className="invalid-feedback" role="alert">{errors.company}</div>}
          </div>

          <div>
            <label htmlFor="input-email" className="form-label">
              Email <span style={{ color: 'var(--kh-danger)' }}>*</span>
            </label>
            <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              id="input-email" name="email" value={form.email} onChange={handleChange}
              autoComplete="email" required />
            {errors.email && <div className="invalid-feedback" role="alert">{errors.email}</div>}
          </div>

          <div>
            <label htmlFor="input-phone" className="form-label">
              Telefon <span style={{ color: 'var(--kh-danger)' }}>*</span>
            </label>
            <input type="tel" className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
              id="input-phone" name="phone" value={form.phone} onChange={handleChange}
              autoComplete="tel" required />
            {errors.phone && <div className="invalid-feedback" role="alert">{errors.phone}</div>}
          </div>

          <div className="d-flex gap-2 mt-1">
            <button type="submit" className="kh-btn-primary flex-grow-1" id="submit-contact-btn">
              Přidat kontakt
            </button>
            <button type="button" className="kh-btn-secondary" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>
      </form>
    </section>
  )
}
