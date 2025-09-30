// src/App.tsx
import type { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import './App.css'
import { CreateMissionForm } from './components/CreateMissionForm'
import { MissionsList } from './components/MissionsList'
import { MonProfil } from './components/MonProfil'
import { LoginForm } from './components/LoginForm'
import { LogoutButton } from './components/LogoutButton' // ✅ nouvel import
import { supabase } from './lib/supabaseClient'

function App() {
  const [refresh, setRefresh] = useState(0)
  const [showCreate, setShowCreate] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  const handleCreated = () => {
    setRefresh(r => r + 1)
    setShowCreate(false)
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user)
    })
  }, [])

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

      {/* ✅ Connexion ou Profil */}
      {!user ? (
        <section className="login-section">
          <LoginForm />
        </section>
      ) : (
        <>
<div className="profil-bar">
  <span className="profil-name">{user?.user_metadata?.prenom} {user?.user_metadata?.nom}</span>
  <LogoutButton />
</div>
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
            <div className="modal-overlay" onClick={() => setShowCreate(false)}>
    <div className="modal-content" onClick={e => e.stopPropagation()}>
      <button className="modal-close" onClick={() => setShowCreate(false)}>
        ×
      </button>
      <CreateMissionForm onCreated={handleCreated} />
    </div>
  </div>
          )}
        </>
      )}
    </div>
  )
}

export default App
