import { SONGS } from '../data/songs'

const allScores = SONGS.flatMap((s) => [s.diffMale, s.diffFemale])
const SCORE_MAX = Math.max(...allScores)

// レベル1に該当する曲が(男性/女性キーどちらでも)最低8曲は確保できるよう、
// レベル1の上限スコアを引き上げてある。ここを直接調整すれば、レベル1に入る曲数を増減できる。
const LEVEL_1_CUTOFF = 3.5

// 生スコア(0〜10、0.1刻み)をレベル1〜10へ再スケールする。
// スコア <= LEVEL_1_CUTOFF は一律レベル1。それ以外は、LEVEL_1_CUTOFF〜最大値の範囲を
// レベル2〜10へ線形に再スケールする(単純な四捨五入だとレベル1・10がほぼ空になってしまうため)。
export function scoreToLevel(score) {
  if (score <= LEVEL_1_CUTOFF) return 1
  const raw = 2 + ((score - LEVEL_1_CUTOFF) / (SCORE_MAX - LEVEL_1_CUTOFF)) * 8
  return Math.max(2, Math.min(10, Math.round(raw)))
}

export function difficultyTag(level) {
  if (level <= 2) return 'やさしめ'
  if (level <= 4) return 'ふつう'
  if (level <= 6) return 'ちょい難'
  if (level <= 8) return '難関'
  return '激ムズ'
}
