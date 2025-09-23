import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Collaborator } from '../types'

export function CollaboratorsList() {
  const [collabs, setCollabs] = useState<Collaborator[]>([])
  const [error, setError]   = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('collaborators')
      .select('*')
      .order('last_name', { ascending: true })
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else if (data) setCollabs(data as Collaborator[])
      })
  }, [])

  if (error) return <p style={{ color: 'red' }}>{error}</p>
  if (!collabs.length) return <p>Chargement…</p>

  return (
    <ul>
      {collabs.map((c) => (
        <li key={c.id}>
          {c.first_name} {c.last_name} ({c.grade})
          <br />
          <a href={`mailto:${c.email}`}>{c.email}</a>
        </li>
      ))}
    </ul>
  )
}
