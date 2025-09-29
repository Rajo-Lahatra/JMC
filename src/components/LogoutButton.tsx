// src/components/LogoutButton.tsx
import { supabase } from '../lib/supabaseClient'

export function LogoutButton() {
  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  return (
    <button className="btn-logout" onClick={handleLogout}>
      Se déconnecter
    </button>
  )
}
