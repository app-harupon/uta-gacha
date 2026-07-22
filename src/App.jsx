import { useState } from 'react'
import { SONGS, GENRES, ERAS, LEVELS } from './data/songs'
import { scoreToLevel } from './utils/difficulty'
import SongCard from './components/SongCard'
import './App.css'

const MAX_CANDIDATES = 5

function toggleInList(list, value) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

function pickRandom(list, count) {
  const pool = [...list]
  const picked = []
  while (pool.length > 0 && picked.length < count) {
    const index = Math.floor(Math.random() * pool.length)
    picked.push(pool.splice(index, 1)[0])
  }
  return picked
}

export default function App() {
  const [genderKey, setGenderKey] = useState('male')
  const [selectedGenres, setSelectedGenres] = useState([])
  const [selectedEras, setSelectedEras] = useState([])
  const [selectedLevels, setSelectedLevels] = useState([])
  const [candidates, setCandidates] = useState([])
  const [hasDrawn, setHasDrawn] = useState(false)

  const handleDraw = () => {
    const filtered = SONGS.filter((song) => {
      if (selectedGenres.length > 0 && !selectedGenres.includes(song.genre)) return false
      if (selectedEras.length > 0 && !selectedEras.includes(song.era)) return false
      if (selectedLevels.length > 0) {
        const score = genderKey === 'male' ? song.diffMale : song.diffFemale
        if (!selectedLevels.includes(scoreToLevel(score))) return false
      }
      return true
    })
    setCandidates(pickRandom(filtered, MAX_CANDIDATES))
    setHasDrawn(true)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>うたガチャ</h1>
        <p className="app-subtitle">条件を決めて、次に歌う曲を引こう</p>
      </header>

      <section className="panel">
        <h2>性別キー</h2>
        <div className="toggle-group">
          <button
            className={genderKey === 'male' ? 'toggle-button active' : 'toggle-button'}
            onClick={() => setGenderKey('male')}
          >
            男性キー
          </button>
          <button
            className={genderKey === 'female' ? 'toggle-button active' : 'toggle-button'}
            onClick={() => setGenderKey('female')}
          >
            女性キー
          </button>
        </div>
      </section>

      <section className="panel">
        <h2>ジャンル</h2>
        <div className="chip-group">
          {GENRES.map((genre) => (
            <button
              key={genre}
              className={selectedGenres.includes(genre) ? 'chip active' : 'chip'}
              onClick={() => setSelectedGenres((prev) => toggleInList(prev, genre))}
            >
              {genre}
            </button>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>年代</h2>
        <div className="chip-group">
          {ERAS.map((era) => (
            <button
              key={era}
              className={selectedEras.includes(era) ? 'chip active' : 'chip'}
              onClick={() => setSelectedEras((prev) => toggleInList(prev, era))}
            >
              {era}
            </button>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>難易度レベル</h2>
        <div className="level-group">
          {LEVELS.map((level) => (
            <button
              key={level}
              className={selectedLevels.includes(level) ? 'level-button active' : 'level-button'}
              onClick={() => setSelectedLevels((prev) => toggleInList(prev, level))}
            >
              {level}
            </button>
          ))}
        </div>
      </section>

      <button className="draw-button" onClick={handleDraw}>
        候補を出す
      </button>

      <section className="results">
        {hasDrawn && candidates.length === 0 && (
          <p className="empty-message">条件に合う曲が見つからなかった。条件を緩めてみよう。</p>
        )}
        {candidates.map((song) => (
          <SongCard key={`${song.title}__${song.artist}`} song={song} genderKey={genderKey} />
        ))}
      </section>
    </div>
  )
}
