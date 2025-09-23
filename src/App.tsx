// src/App.tsx
import { useState } from 'react'
import './App.css'
import { CreateMissionForm } from './components/CreateMissionForm'
import { MissionsList } from './components/MissionsList'

function App() {
  const [refresh, setRefresh] = useState(0)
  const [showCreate, setShowCreate] = useState(false)

  const handleCreated = () => {
    setRefresh(r => r + 1)
    setShowCreate(false)
  }

  return (
    <div className="App">
      <header className="App-header">
        <img
          src="/logo.png"
          alt="Logo Joe-Adams & Madison Consulting Guinée"
          className="App-logo"
        />
        <h1>
          Joe-Adams &amp; Madison Consulting Guinée –  
          État de suivi des dossiers en cours
        </h1>
      </header>

      <main className="main-content">
        <button
          className="btn-create-mission"
          onClick={() => setShowCreate(true)}
        >
          Créer une mission
        </button>

        <section className="missions-list">
          <h2>Liste des missions</h2>
          <MissionsList key={refresh} />
        </section>
      </main>

      {showCreate && (
        <div
          className="drawer-overlay"
          onClick={() => setShowCreate(false)}
        >
          <div
            className="drawer-content"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="drawer-close"
              onClick={() => setShowCreate(false)}
            >
              ×
            </button>
            <CreateMissionForm onCreated={handleCreated} />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
