import type { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import './App.css'
import { CreateMissionForm } from './components/CreateMissionForm'
import { EditMissionForm } from './components/EditMissionForm'
import { MissionsList } from './components/MissionsList'
import { LoginForm } from './components/LoginForm'
import { LogoutButton } from './components/LogoutButton'
import { supabase } from './lib/supabaseClient'
import { TimeManagerModal } from './components/TimeManagerModal'
import { ImportMissionForm } from './components/ImportMissionForm'
import { ClientStats } from './components/ClientStats'

function App() {
  const [showCreate, setShowCreate] = useState(false)
  const [editingMissionId, setEditingMissionId] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [refreshFlag, setRefreshFlag] = useState(0)
  const [showTimeManager, setShowTimeManager] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [showStats, setShowStats] = useState(false) // ✅ nouveau état

  const handleCreated = () => {
    setShowCreate(false)
    setRefreshFlag(prev => prev + 1)
  }

  const handleUpdated = () => {
    setEditingMissionId(null)
    setRefreshFlag(prev => prev + 1)
  }

  const handleEdit = (id: string) => {
    setEditingMissionId(id)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
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
          Outil de suivi des dossiers, du temps passé, de la facturation et du recouvrement.
        </h1>
      </header>

      {!user ? (
        <section className="login-section">
          <LoginForm />
        </section>
      ) : (
        <>
          <div className="profil-bar">
            <span className="profil-name">
              {user?.user_metadata?.prenom} {user?.user_metadata?.nom}
            </span>
            <LogoutButton />
          </div>

          <main className="main-content">
            <button className="btn-create-mission" onClick={() => setShowCreate(true)}>
              Créer une mission
            </button>

            <button className="btn-import-mission" onClick={() => setShowImport(true)}>
              📥 Importer des missions
            </button>

            <button onClick={() => setShowTimeManager(true)}>
              🕒 Gestion des temps passés
            </button>

            <button onClick={() => setShowStats(prev => !prev)}>
              {showStats ? '❌ Masquer les statistiques' : '📊 Voir les statistiques'}
            </button>

            {showStats && (
              <section className="stats-section">
                <ClientStats />
              </section>
            )}

            <section className="missions-list">
              <h2>Liste des missions</h2>
              <MissionsList refreshFlag={refreshFlag} onEdit={handleEdit} />
            </section>
          </main>

          {showCreate && (
            <div className="modal-overlay" onClick={() => setShowCreate(false)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setShowCreate(false)}>×</button>
                <CreateMissionForm onCreated={handleCreated} />
              </div>
            </div>
          )}

          {showImport && (
            <div className="modal-overlay" onClick={() => setShowImport(false)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setShowImport(false)}>×</button>
                <ImportMissionForm onImported={() => {
                  setShowImport(false)
                  setRefreshFlag(prev => prev + 1)
                }} />
              </div>
            </div>
          )}

          {editingMissionId && (
            <div className="modal-overlay" onClick={() => setEditingMissionId(null)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setEditingMissionId(null)}>×</button>
                <EditMissionForm missionId={editingMissionId} onUpdated={handleUpdated} />
              </div>
            </div>
          )}

          {showTimeManager && (
            <TimeManagerModal onClose={() => setShowTimeManager(false)} />
          )}
        </>
      )}
    </div>
  )
}

export default App
