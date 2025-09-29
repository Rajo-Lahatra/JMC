// src/components/MonProfil.tsx
import type { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export function MonProfil() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user)
    })
  }, [])

  if (!user) return <p>Chargement du profil...</p>

  const metadata = user.user_metadata

  return (
    <div className="profil-container">
      <h2>Mon Profil</h2>
      <ul>
        <li><strong>Nom :</strong> {metadata.nom}</li>
        <li><strong>Prénom :</strong> {metadata.prenom}</li>
        <li><strong>Grade :</strong> {metadata.grade}</li>
        <li><strong>Rôle :</strong> {metadata.role}</li>
        <li><strong>Email :</strong> {user.email}</li>
      </ul>
    </div>
  )
}
