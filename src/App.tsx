import { useState } from 'react'
import './App.css'
import { CreateMissionForm } from './components/CreateMissionForm'
import { MissionsList } from './components/MissionsList'

function App() {
  const [refresh, setRefresh] = useState(0)

  return (
    <div className="App">
      <header>
        <h1>Joe-Adams and Madison Consulting Guinée – État de suivi des dossiers en cours</h1>
      </header>

      <main>
        <section className="mission-creation">
          <CreateMissionForm onCreated={() => setRefresh(r => r + 1)} />
        </section>

        <section className="missions-list">
          <h2>Liste des missions</h2>
          <MissionsList key={refresh} />
        </section>
      </main>
    </div>
  )
}

export default App
