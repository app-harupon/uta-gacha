export function difficultyTag(score) {
  if (score <= 2.9) return 'やさしめ'
  if (score <= 4.9) return 'ふつう'
  if (score <= 6.9) return 'ちょい難'
  if (score <= 8.9) return '難関'
  return '激ムズ'
}
