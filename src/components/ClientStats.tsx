import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function ClientStats() {
  const [clientStats, setClientStats] = useState<{ client_name: string; mission_count: number }[]>([])

  useEffect(() => {
    supabase
      .from('missions')
      .select('client_id')
      .then(async ({ data: missions, error }) => {
        if (error) {
          console.error('Erreur chargement missions:', error)
          return
        }

        const { data: clients, error: clientError } = await supabase.from('clients').select('id, name')
        if (clientError || !clients) return

        const countByClient: Record<string, number> = {}
        missions.forEach(m => {
          if (m.client_id) {
            countByClient[m.client_id] = (countByClient[m.client_id] || 0) + 1
          }
        })

        const stats = clients.map(c => ({
          client_name: c.name,
          mission_count: countByClient[c.id] || 0,
        }))

        setClientStats(stats)
      })
  }, [])

  return (
    <div>
      <h2>📊 Missions par client</h2>
      <table>
        <thead>
          <tr>
            <th>Client</th>
            <th>Nombre de missions</th>
          </tr>
        </thead>
        <tbody>
          {clientStats.map((row, i) => (
            <tr key={i}>
              <td>{row.client_name}</td>
              <td>{row.mission_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
