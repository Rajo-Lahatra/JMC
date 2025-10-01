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

type MissionsListProps = {
  refreshFlag: number
  onEdit?: (id: string) => void
}

export function MissionsList({ refreshFlag, onEdit }: MissionsListProps) {
  const [missions, setMissions] = useState<Mission[]>([])
  const [collabs, setCollabs] = useState<Collaborator[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [selected, setSelected] = useState<Mission | null>(null)
  const [emailMission, setEmailMission] = useState<Mission | null>(null)
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([])
const [searchTerm, setSearchTerm] = useState('')
const [filterService, setFilterService] = useState('')
const [filterCreator, setFilterCreator] = useState('')
const [filterPartner, setFilterPartner] = useState('')
const [filterStage, setFilterStage] = useState('')
const [filterBillable, setFilterBillable] = useState('')

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
  }, [refreshFlag])

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

  const composeSituation = (m: Mission) => {
    return `Client : ${m.client_name}
Dossier : ${m.dossier_number}
Mission : ${m.title}
Service : ${m.service}
Étape : ${stageLabels[m.stage] || m.stage}
Associé : ${getName(m.partner_id!)}
Échéance : ${m.due_date ? new Date(m.due_date).toLocaleDateString() : '–'}

Situation actuelle :
${m.situation_state || '—'}

Actions à prendre :
${m.situation_actions || '—'}

Bien cordialement,`
  }

  const copyToClipboard = async () => {
    const f = document.getElementById('mailFrm') as HTMLFormElement
    const subject = (f.elements.namedItem('subject') as HTMLInputElement).value
    const body = (f.elements.namedItem('body') as HTMLTextAreaElement).value
    const txt = `Objet: ${subject}\n\n${body}`
    try {
      await navigator.clipboard.writeText(txt)
      alert('📋 Copié dans le presse-papiers.')
    } catch {
      alert('❌ Échec de la copie.')
    }
  }

  const openMail = () => {
    const f = document.getElementById('mailFrm') as HTMLFormElement
    const to = encodeURIComponent((f.elements.namedItem('to') as HTMLInputElement).value.trim())
    const cc = encodeURIComponent((f.elements.namedItem('cc') as HTMLInputElement).value.trim())
    const subject = encodeURIComponent((f.elements.namedItem('subject') as HTMLInputElement).value)
    const body = encodeURIComponent((f.elements.namedItem('body') as HTMLTextAreaElement).value)
    const mailto = `mailto:${to}?subject=${subject}${cc ? `&cc=${cc}` : ''}&body=${body}`
    window.location.href = mailto
  }
const filteredMissions = missions.filter(m => {
  const matchesSearch =
    m.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.dossier_number?.toLowerCase().includes(searchTerm.toLowerCase())

  const matchesService = filterService ? m.service === filterService : true
  const matchesCreator = filterCreator ? m.created_by === filterCreator : true
  const matchesPartner = filterPartner ? m.partner_id === filterPartner : true
  const matchesStage = filterStage ? m.stage === filterStage : true
  const matchesBillable =
    filterBillable === ''
      ? true
      : filterBillable === 'true'
      ? m.billable === true
      : m.billable === false

  return (
    matchesSearch &&
    matchesService &&
    matchesCreator &&
    matchesPartner &&
    matchesStage &&
    matchesBillable
  )
})
  return (
    <>

    <div className="filters-bar">
  <input
    type="text"
    placeholder="🔍 Rechercher..."
    value={searchTerm}
    onChange={e => setSearchTerm(e.target.value)}
  />

  <select value={filterService} onChange={e => setFilterService(e.target.value)}>
    <option value="">Toutes les lignes</option>
    <option value="TLS">TLS</option>
    <option value="TAX">TAX</option>
    <option value="LEGAL">LEGAL</option>
    <option value="ADVISORY">ADVISORY</option>
  </select>

  <select value={filterCreator} onChange={e => setFilterCreator(e.target.value)}>
    <option value="">Tous les créateurs</option>
    {collabs.map(c => (
      <option key={c.id} value={c.id}>
        {c.first_name} {c.last_name}
      </option>
    ))}
  </select>

  <select value={filterPartner} onChange={e => setFilterPartner(e.target.value)}>
    <option value="">Tous les associés</option>
    {collabs
      .filter(c => c.grade === 'Partner')
      .map(c => (
        <option key={c.id} value={c.id}>
          {c.first_name} {c.last_name}
        </option>
      ))}
  </select>

  <select value={filterStage} onChange={e => setFilterStage(e.target.value)}>
    <option value="">Toutes les étapes</option>
    {Object.entries(stageLabels).map(([key, label]) => (
      <option key={key} value={key}>
        {label}
      </option>
    ))}
  </select>

  <select value={filterBillable} onChange={e => setFilterBillable(e.target.value)}>
    <option value="">Toutes les missions</option>
    <option value="true">Facturables</option>
    <option value="false">Non facturables</option>
  </select>
</div>

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
            filteredMissions.map(m => (
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
                  <button onClick={() => setEmailMission(m)}>Envoyer situation</button>
                  {onEdit && (
                    <button onClick={() => onEdit(m.id)}>✏️ Éditer</button>
                  )}
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

      {emailMission && (
        <div className="modal-overlay" onClick={() => setEmailMission(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setEmailMission(null)}>×</button>
            <h3>📧 Situation du dossier</h3>

            {/* ✅ Sélecteur multi-choix */}
            <div className="recipient-selector">
              <p><strong>Choisir les destinataires :</strong></p>
              <div className="recipient-list">
                {collabs.map(c => (
                  <label key={c.id} className="recipient-item">
                    <input
                      type="checkbox"
                      checked={selectedRecipients.includes(c.email)}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedRecipients(prev => [...prev, c.email])
                        } else {
                                                    setSelectedRecipients(prev => prev.filter(mail => mail !== c.email))
                        }
                      }}
                    />
                    {c.first_name} {c.last_name} ({c.grade}) — {c.email}
                  </label>
                ))}
              </div>

              {/* Boutons rapides */}
              <div className="recipient-actions">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedRecipients(collabs.filter(c => c.grade === 'Partner').map(c => c.email))
                  }
                >
                  📨 Tous les associés
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedRecipients(collabs.filter(c => c.grade === 'Manager' || c.grade === 'Senior Manager').map(c => c.email))
                  }
                >
                  📨 Tous les managers
                </button>
                <button type="button" onClick={() => setSelectedRecipients([])}>❌ Vider</button>
              </div>
            </div>

            <form id="mailFrm" onSubmit={e => e.preventDefault()}>
              <label>À :</label>
              <input
                name="to"
                value={selectedRecipients.join('; ')}
                readOnly
                style={{ width: '100%', fontSize: '1rem', padding: '0.6rem' }}
              />

              <label>CC :</label>
              <input
                name="cc"
                defaultValue=""
                style={{ width: '100%', fontSize: '1rem', padding: '0.6rem' }}
              />

              <label>Objet :</label>
              <input
                name="subject"
                defaultValue={`[J&M] Situation du dossier ${emailMission.dossier_number} — ${emailMission.client_name}`}
                style={{ width: '100%', fontSize: '1rem', padding: '0.6rem' }}
              />

              <label>Message :</label>
              <textarea
                name="body"
                rows={16}
                style={{ width: '100%', fontSize: '1rem', padding: '0.8rem' }}
                defaultValue={composeSituation(emailMission)}
              />

              <div className="email-actions">
                <button type="button" onClick={copyToClipboard}>📋 Copier</button>
                <button type="button" onClick={openMail}>📤 Ouvrir dans le client mail</button>
                <button type="button" onClick={() => setEmailMission(null)}>✖ Fermer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
