import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function CollaboratorStats() {
  const [stats, setStats] = useState<{ collaborateur: string; missions_creees: number }[]>([])

  useEffect(() => {
    // Charger les missions
    supabase
      .from('missions')
      .select('created_by')
      .then(async ({ data: missions, error }) => {
        if (error || !missions) {
          console.error('❌ Erreur chargement missions:', error)
          return
        }

        // Charger les collaborateurs
        const { data: collabs, error: collabError } = await supabase
          .from('collaborators')
          .select('id, first_name, last_name')

        if (collabError || !collabs) {
          console.error('❌ Erreur chargement collaborateurs:', collabError)
          return
        }

        // Compter les missions par collaborateur
        const countByCollab: Record<string, number> = {}
        missions.forEach(m => {
          if (m.created_by) {
            countByCollab[m.created_by] = (countByCollab[m.created_by] || 0) + 1
          }
        })

        // Construire les statistiques
        const stats = (collabs ?? []).map(c => ({
          collaborateur: `${c.first_name} ${c.last_name}`,
          missions_creees: countByCollab[c.id] || 0,
        }))

        setStats(stats)
      })
  }, [])

  return (
    <div>
      <h2>📊 Missions créées par collaborateur</h2>
      <table>
        <thead>
          <tr>
            <th>Collaborateur</th>
            <th>Missions créées</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((row, i) => (
            <tr key={i}>
              <td>{row.collaborateur}</td>
              <td>{row.missions_creees}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
