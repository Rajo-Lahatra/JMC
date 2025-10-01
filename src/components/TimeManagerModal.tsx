import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Collaborator, Mission, TimesheetEntry } from '../types'
import './TimeManagerModal.css'

export function TimeManagerModal({ onClose }: { onClose: () => void }) {
  const [missions, setMissions] = useState<Mission[]>([])
  const [timesheets, setTimesheets] = useState<any[]>([])
  const [collabs, setCollabs] = useState<Collaborator[]>([])
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [timesheetEntries, setTimesheetEntries] = useState<TimesheetEntry[]>([])
  const [newTime, setNewTime] = useState({
    mission_id: '',
    collaborator_id: '',
    date_worked: '',
    hours_worked: '',
  })

  const hourlyRates: Record<string, number> = {
    Junior: 100,
    Senior: 140,
    Manager: 200,
    'Senior Manager': 250,
    Director: 300,
    Partner: 400,
  }

  const getRateByGrade = (grade?: string): number => {
    return hourlyRates[grade ?? ''] ?? 0
  }

  const fetchTimesheetData = async () => {
    const { data, error } = await supabase
      .from('mission_timesheets')
      .select('*')

    if (error) {
      console.error('Erreur chargement des temps:', error)
    } else {
      setTimesheetEntries(data)
    }
  }

  const fetchCollaborators = async () => {
    const { data, error } = await supabase.from('collaborators').select('*')
    if (error) {
      console.error('Erreur chargement collaborateurs:', error)
    } else {
      setCollaborators(data)
    }
  }

  const handleDelete = async (entryId: string) => {
    const confirm = window.confirm('Confirmer la suppression de cette entrée ?')
    if (!confirm) return

    const { error } = await supabase
      .from('mission_timesheets')
      .delete()
      .eq('id', entryId)

    if (error) {
      console.error('Erreur suppression:', error)
      alert('❌ Échec de la suppression')
    } else {
      alert('✅ Entrée supprimée')
      fetchTimesheetData()
    }
  }

  const handleAddTime = async () => {
    const { mission_id, collaborator_id, date_worked, hours_worked } = newTime
    if (!mission_id || !collaborator_id || !date_worked || !hours_worked) return

    const { error } = await supabase.from('mission_timesheets').insert([
      {
        mission_id,
        collaborator_id,
        date_worked,
        hours_worked: Number(hours_worked),
      },
    ])

    if (!error) {
      setNewTime({ mission_id: '', collaborator_id: '', date_worked: '', hours_worked: '' })
      const { data } = await supabase.from('mission_timesheets').select('*')
      if (data) setTimesheets(data)
    }
  }

  const getMissionTimes = (missionId: string) =>
    timesheets.filter(t => t.mission_id === missionId)

  const getCollaborator = (id: string) =>
    collabs.find(c => c.id === id)

  const getValorisation = (missionId: string) => {
    const entries = getMissionTimes(missionId)
    return entries.reduce((sum, t) => {
      const collab = getCollaborator(t.collaborator_id)
      const rate = hourlyRates[collab?.grade ?? ''] ?? 0
      return sum + rate * t.hours_worked
    }, 0)
  }

  useEffect(() => {
    fetchTimesheetData()
    fetchCollaborators()

    supabase.from('missions').select('*').then(({ data }) => {
      if (data) setMissions(data)
    })

    supabase.from('mission_timesheets').select('*').then(({ data }) => {
      if (data) setTimesheets(data)
    })

    supabase.from('collaborators').select('*').then(({ data }) => {
      if (data) setCollabs(data)
    })
  }, [])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h3>🕒 Gestion des temps passés</h3>

        {missions.map(m => {
          const valorisation = getValorisation(m.id)
          const facture = Number(m.invoice_amount ?? 0)
          const ecart = valorisation - facture

          return (
            <div key={m.id} className="mission-block">
              <h4>{m.dossier_number} – {m.client_name}</h4>
              <p><strong>Titre :</strong> {m.title}</p>
              <p><strong>Service :</strong> {m.service} | <strong>Facturé :</strong> {facture} EUR</p>
              <p><strong>Valorisation :</strong> {valorisation.toFixed(2)} EUR</p>
              <p><strong>Écart :</strong> {ecart.toFixed(2)} EUR</p>

              <table className="timesheet-table">
                <thead>
                  <tr>
                    <th>Collaborateur</th>
                    <th>Date</th>
                    <th>Heures</th>
                    <th>Taux</th>
                    <th>Valeur</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {timesheets.map(t => {
                    const collab = collaborators.find(c => c.id === t.collaborator_id)
                    const rate = getRateByGrade(collab?.grade)
                    const value = t.hours_worked * rate

                    return (
                      <tr key={t.id}>
                        <td>{collab ? `${collab.first_name} ${collab.last_name}` : t.collaborator_id}</td>
                        <td>{t.date_worked}</td>
                        <td>{t.hours_worked}</td>
                        <td>{rate} EUR</td>
                        <td>{value.toFixed(2)} EUR</td>
                        <td>
                          <button onClick={() => handleDelete(t.id)}>🗑 Supprimer</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )
        })}

        <div className="add-timesheet-row">
          <select
            value={newTime.mission_id}
            onChange={e => setNewTime(prev => ({ ...prev, mission_id: e.target.value }))}
          >
            <option value="">Choisir mission</option>
            {missions.map(m => (
              <option key={m.id} value={m.id}>
                {m.dossier_number} – {m.title}
              </option>
            ))}
          </select>

          <select
            value={newTime.collaborator_id}
            onChange={e => setNewTime(prev => ({ ...prev, collaborator_id: e.target.value }))}
          >
            <option value="">Collaborateur</option>
            {collabs.map(c => (
              <option key={c.id} value={c.id}>
                {c.first_name} {c.last_name} ({c.grade})
              </option>
            ))}
          </select>

          <input
            type="date"
            value={newTime.date_worked}
            onChange={e => setNewTime(prev => ({ ...prev, date_worked: e.target.value }))}
          />

          <input
            type="number"
            placeholder="Heures"
            value={newTime.hours_worked}
            onChange={e => setNewTime(prev => ({ ...prev, hours_worked: e.target.value }))}
          />

          <button type="button" onClick={handleAddTime}>➕ Ajouter</button>
        </div>
      </div>
    </div>
  )
}
