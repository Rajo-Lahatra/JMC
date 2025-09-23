// src/components/MissionsList.tsx
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Mission } from '../types'

interface MissionWithPartner extends Mission {
  partner: { first_name: string; last_name: string } | null
}

export function MissionsList() {
  const [missions, setMissions] = useState<MissionWithPartner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMissions = () => {
    setLoading(true)
    supabase
      .from('missions')
      .select(`
        *,
        partner: collaborators ( first_name, last_name )
      `)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        setLoading(false)
        if (error) setError(error.message)
        else if (data) setMissions(data as MissionWithPartner[])
      })
  }

  useEffect(fetchMissions, [])

  const handleDelete = async (id: string) => {
    await supabase.from('missions').delete().eq('id', id)
    fetchMissions()
  }

  const handleDuplicate = async (m: MissionWithPartner) => {
    const { error } = await supabase.from('missions').insert([{
      ...m,
      id: undefined,               // laisser la PK se régénérer
      created_at: undefined,
      updated_at: undefined,
      dossier_number: `${m.dossier_number}-copy`,
    }])
    if (error) console.error(error)
    else fetchMissions()
  }

  if (error) return <p style={{ color: 'red' }}>{error}</p>
  if (loading) return <p>Chargement des missions…</p>
  if (!missions.length) return <p>Aucune mission trouvée.</p>

  return (
    <table className="missions-table">
      <thead>
        <tr>
          <th>Dossier</th>
          <th>Client</th>
          <th>Titre</th>
          <th>Service</th>
          <th>Assoc. resp.</th>
          <th>Étape</th>
          <th>Fact.</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {missions.map(m => (
          <tr key={m.id}>
            <td>{m.dossier_number}</td>
            <td>{m.client_name}</td>
            <td>{m.title}</td>
            <td>{m.service}</td>
            <td>
              {m.partner
                ? `${m.partner.first_name} ${m.partner.last_name}`
                : '—'}
            </td>
            <td>{m.stage}</td>
            <td>{m.billable ? 'Oui' : 'Non'}</td>
            <td>
              <button onClick={() => handleDuplicate(m)}>Dupliquer</button>
              <button onClick={() => handleDelete(m.id)}>Supprimer</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
