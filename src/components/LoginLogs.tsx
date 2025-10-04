import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function LoginLogs() {
  const [logs, setLogs] = useState<any[]>([])

  useEffect(() => {
    supabase
      .from('login_logs')
      .select('login_time, user_agent, user_id, profiles(email)')
      .order('login_time', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error('❌ Erreur chargement logs:', error)
        else if (data) setLogs(data)
      })
  }, [])

  return (
    <div>
      <h2>🛡️ Journal des connexions</h2>
      <table>
        <thead>
          <tr>
            <th>Utilisateur</th>
            <th>Date de connexion</th>
          </tr>
        </thead>
<tbody>
  {logs.map((log, i) => (
    <tr key={i}>
      <td>{log.profiles?.email || log.user_id}</td>
      <td>{new Date(log.login_time).toLocaleString()}</td>
      <td>{log.user_agent}</td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  )
}
