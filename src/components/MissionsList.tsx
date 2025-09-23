// src/components/MissionsList.tsx
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Mission, Collaborator } from '../types'

export function MissionsList() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [collabs, setCollabs] = useState<Collaborator[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<Mission | null>(null)

  useEffect(() => {
    setLoading(true)
    supabase
      .from('collaborators')
      .select('id, first_name, last_name')
      .then(({ data }) => data && setCollabs(data))

    supabase
      .from('missions')
      .select('*')
      .then(({ data }) => {
        if (data) setMissions(data)
        setLoading(false)
      })
  }, [])

  const getName = (id: string) => {
    const c = collabs.find(c => c.id === id)
    return c ? `${c.first_name} ${c.last_name}` : id
  }

  const handleDelete = async (id: string) => {
    await supabase.from('mission_collaborators').delete().eq('mission_id', id)
    const { error } = await supabase.from('missions').delete().eq('id', id)
    if (error) console.error(error)
    else setMissions(prev => prev.filter(m => m.id !== id))
  }

  return (
    <>
      <table className="missions-table">
        <thead>
          <tr>
            <th>Dossier</th>
            <th>Client</th>
            <th>Titre</th>
            <th>Service</th>
            <th>Associé</th>
            <th>Étape</th>
            <th>Facturable</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={8}>Chargement…</td>
            </tr>
          ) : (
            missions.map(m => (
              <tr key={m.id}>
                <td>{m.dossier_number}</td>
                <td>{m.client_name}</td>
                <td>{m.title}</td>
                <td>{m.service}</td>
                <td>{getName(m.partner_id!)}</td>
                <td>{m.stage}</td>
                <td>{m.billable ? 'Oui' : 'Non'}</td>
                <td>
                  <button onClick={() => setSelected(m)}>
                    Voir le détail
                  </button>
                  <button onClick={() => handleDelete(m.id)}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {selected && (
        <div className="drawer-overlay" onClick={() => setSelected(null)}>
          <div className="drawer-content" onClick={e => e.stopPropagation()}>
            <button
              className="drawer-close"
              onClick={() => setSelected(null)}
            >
              ×
            </button>
            <h3>Détails de la mission</h3>
            <ul className="mission-detail-list">
              <li><strong>Dossier :</strong> {selected.dossier_number}</li>
              <li><strong>Client :</strong> {selected.client_name}</li>
              <li><strong>Titre :</strong> {selected.title}</li>
              <li><strong>Service :</strong> {selected.service}</li>
              <li><strong>Associé :</strong> {getName(selected.partner_id!)}</li>
              <li><strong>Étape :</strong> {selected.stage}</li>
              <li><strong>Facturable :</strong> {selected.billable ? 'Oui' : 'Non'}</li>
              <li><strong>Facturation :</strong> {selected.invoice_stage}</li>
              <li><strong>Recouvrement :</strong> {selected.recovery_stage}</li>
              <li><strong>Échéance :</strong> {selected.due_date || '–'}</li>
              <li><strong>Situation :</strong> {selected.situation_state || '–'}</li>
              <li><strong>Actions :</strong> {selected.situation_actions || '–'}</li>
            </ul>
          </div>
        </div>
      )}
    </>
  )
}
