import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else window.location.reload()
  }

  return (
    <div className="login-form">
      <h2>Connexion</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Se connecter</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
