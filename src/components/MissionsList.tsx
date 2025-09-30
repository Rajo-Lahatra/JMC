import './MissionsList.css'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Mission, Collaborator } from '../types'

const stageLabels: Record<string, string> = {
  opportunite: 'Opportunité',
  lettre_envoyee: 'Lettre envoyée',
  lettre_signee: 'Lettre signée',
  staff_traitement: 'Traitement interne',
  revue_manager: 'Revue manager',
  revue_associes: 'Revue des associés',
  livrable_envoye: 'Livrable envoyé',
  simple_suivi: 'Suivi simple',
}

export function MissionsList({ refreshFlag }: { refreshFlag: number }) {
  const [missions, setMissions] = useState<Mission[]>([])
  const [collabs, setCollabs] = useState<Collaborator[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [selected, setSelected] = useState<Mission | null>(null)

  useEffect(() => {
    setLoading(true)
    ;(async () => {
      const { data: rawCollabs, error: collabError } =
        await supabase.from('collaborators').select('*')
      if (collabError) console.error('Fetch collaborators error:', collabError)
      else if (rawCollabs) setCollabs(rawCollabs as Collaborator[])

      const { data: rawMissions, error: missionError } =
        await supabase.from('missions').select('*')
      if (missionError) console.error('Fetch missions error:', missionError)
      else if (rawMissions) setMissions(rawMissions as Mission[])

      setLoading(false)
    })()
  }, [refreshFlag]) // ✅ déclenche le rechargement

  const getName = (id: string) => {
    const c = collabs.find(c => c.id === id)
    return c ? `${c.first_name} ${c.last_name}` : id
  }

  const handleDelete = async (id: string) => {
    await supabase.from('mission_collaborators').delete().eq('mission_id', id)
    const { error } = await supabase.from('missions').delete().eq('id', id)
    if (error) console.error('Delete mission error:', error)
    else setMissions(prev => prev.filter(m => m.id !== id))
  }

  return (
    <>
      <table className="missions-table">
        <thead>
          <tr>
            <th>Créateur</th>
            <th>Dossier</th>
            <th>Client</th>
            <th>Titre</th>
            <th>Service</th>
            <th>Associé</th>
            <th>Étape</th>
            <th>Créée le</th>
            <th>Échéance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={10}>Chargement…</td></tr>
          ) : (
            missions.map(m => (
              <tr key={m.id}>
                <td>{getName(m.created_by!)}</td>
                <td>{m.dossier_number}</td>
                <td>{m.client_name}</td>
                <td>{m.title}</td>
                <td>{m.service}</td>
                <td>{getName(m.partner_id!)}</td>
                <td>{stageLabels[m.stage] || m.stage}</td>
                <td>{new Date(m.created_at!).toLocaleDateString()}</td>
                <td>{m.due_date ? new Date(m.due_date).toLocaleDateString() : '–'}</td>
                <td>
                  <button onClick={() => setSelected(m)}>Voir</button>
                  <button onClick={() => handleDelete(m.id)}>Supprimer</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {selected && (
        <div className="drawer-overlay" onClick={() => setSelected(null)}>
          <div className="drawer-content" onClick={e => e.stopPropagation()}>
            <button className="drawer-close" onClick={() => setSelected(null)}>×</button>
            <h3>Détails de la mission</h3>
            <ul className="mission-detail-list">
              <li><strong>Créateur :</strong> {getName(selected.created_by!)}</li>
              <li><strong>Dossier :</strong> {selected.dossier_number}</li>
              <li><strong>Client :</strong> {selected.client_name}</li>
              <li><strong>Titre :</strong> {selected.title}</li>
              <li><strong>Service :</strong> {selected.service}</li>
              <li><strong>Associé :</strong> {getName(selected.partner_id!)}</li>
              <li><strong>Étape :</strong> {stageLabels[selected.stage] || selected.stage}</li>
              <li><strong>Créée le :</strong> {new Date(selected.created_at!).toLocaleDateString()}</li>
              <li><strong>Échéance :</strong> {selected.due_date ? new Date(selected.due_date).toLocaleDateString() : '–'}</li>
              <li><strong>Situation :</strong> {selected.situation_state || '–'}</li>
              <li><strong>Actions :</strong> {selected.situation_actions || '–'}</li>
            </ul>
          </div>
        </div>
      )}
    </>
  )
}
