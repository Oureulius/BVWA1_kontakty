/**
 * Pomocné utility funkce.
 */

/**
 * Vrátí iniciály z celého jména (první písmeno křestního jména a příjmení).
 * @param {string} name - Celé jméno
 * @returns {string} Iniciály (max. 2 znaky)
 */
export function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return parts[0][0].toUpperCase()
}
