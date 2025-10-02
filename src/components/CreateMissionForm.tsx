import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { ServiceLine, MissionStage } from '../types'
import './CreateMissionForm.css'
import { missionCatalog } from '../missionCatalog' 

// ✅ Nouveau type adapté à ta sélection
type CollaboratorLite = {
  id: string
  first_name: string
  last_name: string
  grade: string
  email: string
  auth_id: string | null
}

export function CreateMissionForm({ onCreated }: { onCreated: () => void }) {
  const [collabs, setCollabs] = useState<CollaboratorLite[]>([])
  const [currentUserGrade, setCurrentUserGrade] = useState<string | null>(null)
  const [dossierNumber, setDossierNumber] = useState('')
  const [clientName, setClientName] = useState('')
  const [title, setTitle] = useState('')
  const [service, setService] = useState<ServiceLine>('TLS')
  const [partnerId, setPartnerId] = useState<string | null>(null)
  const [creatorId, setCreatorId] = useState<string | null>(null)
  const [stage, setStage] = useState<MissionStage>('opportunite')
  const [assignedIds, setAssignedIds] = useState<string[]>([])
  const [situationState, setSituationState] = useState('')
  const [situationActions, setSituationActions] = useState('')
  const [billable, setBillable] = useState(true)
  const [feesAmount, setFeesAmount] = useState('')
  const [invoiceAmount, setInvoiceAmount] = useState('')
  const [recoveryAmount, setRecoveryAmount] = useState('')
  const [currency, setCurrency] = useState<'GNF' | 'USD' | 'EUR'>('GNF')
  const [dueDate, setDueDate] = useState<string>('')
const [selectedCategory, setSelectedCategory] = useState('')
const [selectedPrestation, setSelectedPrestation] = useState('')
const [clients, setClients] = useState<any[]>([])
const [selectedClientId, setSelectedClientId] = useState('')
const [newClientName, setNewClientName] = useState('')


  // ✅ état pour activer/désactiver l’édition manuelle
  const [editFinance, setEditFinance] = useState(false)

  useEffect(() => {
    // Charger tous les collaborateurs
    supabase
      .from('collaborators')
      .select('id, first_name, last_name, grade, email, auth_id')
      .order('last_name', { ascending: true })
      .then(({ data, error }) => {
        if (error) console.error('Erreur chargement collaborateurs:', error)
        else if (data) setCollabs(data as CollaboratorLite[])
      })

    // ✅ Identifier l’utilisateur connecté et récupérer son grade
    supabase.auth.getUser().then(async ({ data, error }) => {
      if (error || !data?.user) return
      const { user } = data
      const { data: profile, error: profErr } = await supabase
        .from('collaborators')
        .select('grade')
        .eq('auth_id', user.id) // ⚠️ utiliser auth_id
        .single()
      if (profErr) console.error('Erreur récupération grade:', profErr)
      else if (profile) setCurrentUserGrade(profile.grade)
    })
  supabase.from('clients').select('*').then(({ data }) => {
    if (data) setClients(data)
  })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!creatorId) {
      console.error('❌ Aucun créateur sélectionné')
      return
    }

   const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (!creatorId) {
    console.error('❌ Aucun créateur sélectionné')
    return
  }

  let clientId = selectedClientId

  // Si "Nouveau client" est sélectionné
  if (selectedClientId === '__new__' && newClientName.trim()) {
    const { data: newClient, error: clientError } = await supabase
      .from('clients')
      .insert({ name: newClientName.trim() })
      .select()
      .single()

    if (clientError || !newClient) {
      alert('❌ Échec de la création du client')
      return
    }

    clientId = newClient.id
  }

  const { data: missions, error: missionError } = await supabase
    .from('missions')
    .insert([{
      dossier_number: dossierNumber,
      service,
      category_code: selectedCategory,
      prestation_code: selectedPrestation,
      title,
      client_id: clientId,
      description: null,
      stage,
      situation_state: situationState || null,
      situation_actions: situationActions || null,
      billable,
      fees_amount: feesAmount || null,
      invoice_amount: billable ? invoiceAmount || null : null,
      recovery_amount: billable ? recoveryAmount || null : null,
      currency,
      due_date: dueDate || null,
      partner_id: partnerId,
      created_by: creatorId,
    }])
    .select('id')

  if (missionError || !missions || missions.length === 0) {
    alert('❌ Échec de la création de la mission')
    return
  }

  const missionId = missions[0].id

  if (assignedIds.length) {
    const links = assignedIds.map(id => ({
      mission_id: missionId,
      collaborator_id: id,
    }))
    const { error: linkError } = await supabase
      .from('mission_collaborators')
      .insert(links)
    if (linkError) console.error('❌ Erreur liaison collaborateurs:', linkError)
  }

  alert('✅ Mission créée avec succès')
  onCreated()
}

  // Calculs automatiques
  const remainingToInvoice =
    feesAmount && invoiceAmount
      ? Number(feesAmount) - Number(invoiceAmount)
      : null

  const remainingToRecover =
    invoiceAmount && recoveryAmount
      ? Number(invoiceAmount) - Number(recoveryAmount)
      : null

  // Formatage monétaire
  const formatMoney = (value: string | number | null) => {
    if (value === null || value === '' || isNaN(Number(value))) return '—'
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency,
      currencyDisplay: 'code',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(value))
  }

  // ✅ Déterminer les droits financiers
  const canEditFinance = ['Manager', 'Senior Manager', 'Partner'].includes(currentUserGrade ?? '')

  // ✅ Si c’est un Manager+ qui crée la mission → édition activée par défaut
  useEffect(() => {
    if (canEditFinance) {
      setEditFinance(true)
    }
  }, [canEditFinance])

  return (
    <form onSubmit={handleSubmit} className="create-mission-form">
      <label>Numéro de dossier</label>
      <input
        value={dossierNumber}
        onChange={e => setDossierNumber(e.target.value)}
        required
      />

      <label>Nom du client / prospect</label>
      <input
        value={clientName}
        onChange={e => setClientName(e.target.value)}
        required
      />
<div className="form-row">
  <label>Catégorie de Mission</label>
  <select value={selectedCategory} onChange={e => {
    setSelectedCategory(e.target.value)
    setSelectedPrestation('') // reset prestation
  }}>
    <option value="">Sélectionner une catégorie</option>
    {Object.entries(missionCatalog).map(([code, cat]) => (
      <option key={code} value={code}>{code} – {cat.label}</option>
    ))}
  </select>
</div>

<div className="form-row">
  <label>Client</label>
  <select value={selectedClientId} onChange={e => setSelectedClientId(e.target.value)}>
    <option value="">Sélectionner un client</option>
    {clients.map(c => (
      <option key={c.id} value={c.id}>{c.name}</option>
    ))}
    <option value="__new__">➕ Nouveau client</option>
  </select>
</div>

{selectedClientId === '__new__' && (
  <input
    type="text"
    placeholder="Nom du nouveau client"
    value={newClientName}
    onChange={e => setNewClientName(e.target.value)}
  />
)}


{selectedCategory && (
  <div className="form-row">
    <label>Prestation</label>
    <select value={selectedPrestation} onChange={e => setSelectedPrestation(e.target.value)}>
      <option value="">Sélectionner une prestation</option>
      {Object.entries(missionCatalog[selectedCategory as keyof typeof missionCatalog].prestations).map(([code, label]) => (
  <option key={code} value={code}>{code} – {label}</option>
))}

    </select>
  </div>
)}

      <label>Titre de la mission</label>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />

      <label>Ligne de service</label>
      <select
        value={service}
        onChange={e => setService(e.target.value as ServiceLine)}
      >
        <option value="TLS">TLS</option>
        <option value="GCS">GCS</option>
        <option value="LT">LT</option>
        <option value="Advisory">Advisory</option>
      </select>

      <label>Associé responsable</label>
      <select
        value={partnerId ?? ''}
        onChange={e => setPartnerId(e.target.value || null)}
      >
        <option value="">— Sélectionner —</option>
        {collabs
          .filter(c => c.grade === 'Partner')
          .map(c => (
            <option key={c.id} value={c.id}>
              {c.first_name} {c.last_name}
            </option>
          ))}
      </select>

      <label>Collaborateur créateur</label>
      <select
        value={creatorId ?? ''}
        onChange={e => setCreatorId(e.target.value || null)}
        required
      >
        <option value="">— Sélectionner —</option>
        {collabs.map(c => (
          <option key={c.id} value={c.id}>
            {c.first_name} {c.last_name} ({c.grade})
          </option>
        ))}
      </select>

      <label>Étape du dossier</label>
      <select
        value={stage}
        onChange={e => setStage(e.target.value as MissionStage)}
      >
        <option value="opportunite">Opportunité</option>
        <option value="lettre_envoyee">Lettre envoyée</option>
        <option value="lettre_signee">Lettre signée</option>
        <option value="staff_traitement">Traitement interne</option>
        <option value="revue_manager">Revue manager</option>
        <option value="revue_associes">Revue des associés</option>
        <option value="livrable_envoye">Livrable envoyé</option>
        <option value="simple_suivi">Suivi simple</option>
      </select>

      <label>Collaborateurs en charge</label>
      <select
        multiple
        value={assignedIds}
        onChange={e =>
          setAssignedIds(Array.from(e.target.selectedOptions, opt => opt.value))
        }
      >
        {collabs.map(c => (
          <option key={c.id} value={c.id}>
            {c.first_name} {c.last_name} ({c.grade})
          </option>
        ))}
      </select>

      <label>Situation actuelle</label>
      <textarea
        value={situationState}
        onChange={e => setSituationState(e.target.value)}
      />

      <label>Actions à prendre</label>
      <textarea
        value={situationActions}
        onChange={e => setSituationActions(e.target.value)}
      />

      <label>
        <input
          type="checkbox"
          checked={billable}
          onChange={e => setBillable(e.target.checked)}
        />
        Mission facturable
      </label>

      {/* ✅ Section financière visible seulement pour Manager / Senior Manager / Partner */}
      {canEditFinance && (
        <>
          {/* Bouton pour basculer en mode édition (lecture seule par défaut si Junior/Senior) */}
          <div className="finance-toggle">
            <button
              type="button"
              onClick={() => setEditFinance(prev => !prev)}
            >
              {editFinance ? '🔒 Terminer modification' : '✏️ Modifier'}
            </button>
          </div>

          <fieldset disabled={!billable || !editFinance} style={{ opacity: billable ? 1 : 0.5 }}>
            <legend>Détails financiers</legend>

            <div className="finance-row">
              <label>Devise :</label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value as 'GNF' | 'USD' | 'EUR')}
              >
                <option value="GNF">GNF</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>

            <div className="finance-row">
              <label>Honoraires prévus :</label>
              <input
                type="number"
                value={feesAmount}
                onChange={e => setFeesAmount(e.target.value)}
              />
              <div className="finance-info">
                Affiché : <strong>{formatMoney(feesAmount)}</strong>
              </div>
            </div>

            <div className="finance-row">
              <label>Montant facturé :</label>
              <input
                type="number"
                value={invoiceAmount}
                onChange={e => setInvoiceAmount(e.target.value)}
              />
              <div className="finance-info">
                Affiché : <strong>{formatMoney(invoiceAmount)}</strong>
              </div>
            </div>

            <div className="finance-info">
              Montant restant à facturer :{' '}
              <strong>
                {remainingToInvoice !== null ? formatMoney(remainingToInvoice) : '—'}
              </strong>
            </div>

            <div className="finance-row">
              <label>Montant recouvré :</label>
              <input
                type="number"
                value={recoveryAmount}
                onChange={e => setRecoveryAmount(e.target.value)}
              />
              <div className="finance-info">
                Affiché : <strong>{formatMoney(recoveryAmount)}</strong>
              </div>
            </div>

            <div className="finance-info">
              Montant restant à recouvrer :{' '}
              <strong>
                {remainingToRecover !== null ? formatMoney(remainingToRecover) : '—'}
              </strong>
            </div>
          </fieldset>
        </>
      )}

      <label>Date d’échéance</label>
      <input
        type="date"
        value={dueDate}
        onChange={e => setDueDate(e.target.value)}
      />

      <button type="submit">Créer mission</button>
    </form>
  )
}
