const recordKey = (title, artist) => `record:${title}__${artist}`

export function loadRecord(title, artist) {
  const raw = localStorage.getItem(recordKey(title, artist))
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function saveRecord(title, artist, { score, memo }) {
  localStorage.setItem(
    recordKey(title, artist),
    JSON.stringify({ score, memo, updatedAt: new Date().toISOString() }),
  )
}
