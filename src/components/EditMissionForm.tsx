import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { ServiceLine, MissionStage } from '../types'
import './CreateMissionForm.css'

// Type simplifié pour collaborateurs
type CollaboratorLite = {
  id: string
  first_name: string
  last_name: string
  grade: string
  email: string
  auth_id: string | null
}

export function EditMissionForm({
  missionId,
  onUpdated,
}: {
  missionId: string
  onUpdated: () => void
}) {
  const [collabs, setCollabs] = useState<CollaboratorLite[]>([])
  const [currentUserGrade, setCurrentUserGrade] = useState<string | null>(null)

  // États mission
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

  const [editFinance, setEditFinance] = useState(false)

  // Charger collaborateurs + grade utilisateur + mission
  useEffect(() => {
    supabase
      .from('collaborators')
      .select('id, first_name, last_name, grade, email, auth_id')
      .order('last_name', { ascending: true })
      .then(({ data, error }) => {
        if (error) console.error('Erreur chargement collaborateurs:', error)
        else if (data) setCollabs(data as CollaboratorLite[])
      })

    supabase.auth.getUser().then(async ({ data, error }) => {
      if (error || !data?.user) return
      const { user } = data
      const { data: profile } = await supabase
        .from('collaborators')
        .select('grade')
        .eq('auth_id', user.id)
        .single()
      if (profile) setCurrentUserGrade(profile.grade)
    })

    // Charger mission existante
    supabase
      .from('missions')
      .select('*')
      .eq('id', missionId)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error('Erreur chargement mission:', error)
        } else if (data) {
          setDossierNumber(data.dossier_number || '')
          setClientName(data.client_name || '')
          setTitle(data.title || '')
          setService(data.service || 'TLS')
          setPartnerId(data.partner_id || null)
          setCreatorId(data.created_by || null)
          setStage(data.stage || 'opportunite')
          setSituationState(data.situation_state || '')
          setSituationActions(data.situation_actions || '')
          setBillable(data.billable ?? true)
          setFeesAmount(data.fees_amount || '')
          setInvoiceAmount(data.invoice_amount || '')
          setRecoveryAmount(data.recovery_amount || '')
          setCurrency(data.currency || 'GNF')
          setDueDate(data.due_date || '')
        }
      })
  }, [missionId])

  // Calculs automatiques
  const remainingToInvoice =
    feesAmount && invoiceAmount
      ? Number(feesAmount) - Number(invoiceAmount)
      : null

  const remainingToRecover =
    invoiceAmount && recoveryAmount
      ? Number(invoiceAmount) - Number(recoveryAmount)
      : null

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

  const canEditFinance = ['Manager', 'Senior Manager', 'Partner'].includes(currentUserGrade ?? '')

  useEffect(() => {
    if (canEditFinance) {
      setEditFinance(true)
    }
  }, [canEditFinance])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    const { error } = await supabase
      .from('missions')
      .update({
        dossier_number: dossierNumber,
        service,
        title,
        client_name: clientName,
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
      })
      .eq('id', missionId)

    if (error) {
      console.error('❌ Erreur mise à jour mission:', error)
      return
    }

    onUpdated()
  }

  return (
    <form onSubmit={handleUpdate} className="create-mission-form">
      <h3>Modifier la mission</h3>

      <label>Numéro de dossier</label>
      <input value={dossierNumber} onChange={e => setDossierNumber(e.target.value)} />

      <label>Nom du client / prospect</label>
      <input value={clientName} onChange={e => setClientName(e.target.value)} />

      <label>Titre de la mission</label>
      <input value={title} onChange={e => setTitle(e.target.value)} />

      <label>Étape du dossier</label>
      <select value={stage} onChange={e => setStage(e.target.value as MissionStage)}>
        <option value="opportunite">Opportunité</option>
        <option value="lettre_envoyee">Lettre envoyée</option>
        <option value="lettre_signee">Lettre signée</option>
        <option value="staff_traitement">Traitement interne</option>
        <option value="revue_manager">Revue manager</option>
        <option value="revue_associes">Revue des associés</option>
        <option value="livrable_envoye">Livrable envoyé</option>
        <option value="simple_suivi">Suivi simple</option>
      </select>

      <label>Situation actuelle</label>
      <textarea value={situationState} onChange={e => setSituationState(e.target.value)} />

      <label>Actions à prendre</label>
      <textarea value={situationActions} onChange={e => setSituationActions(e.target.value)} />

      <label>
        <input type="checkbox" checked={billable} onChange={e => setBillable(e.target.checked)} />
        Mission facturable
      </label>

      {canEditFinance && (
        <>
          <div className="finance-toggle">
            <button type="button" onClick={() => setEditFinance(prev => !prev)}>
              {editFinance ? '🔒 Terminer modification' : '✏️ Modifier'}
            </button>
          </div>

          <fieldset disabled={!billable || !editFinance} style={{ opacity: billable ? 1 : 0.5 }}>
            <legend>Détails financiers</legend>

            <label>Devise :</label>
            <select value={currency} onChange={e => setCurrency(e.target.value as 'GNF' | 'USD' | 'EUR')}>
              <option value="GNF">GNF</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>

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
              Montant restant à facturer :{" "}
              <strong>
                {remainingToInvoice !== null ? formatMoney(remainingToInvoice) : "—"}
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
              Montant restant à recouvrer :{" "}
              <strong>
                {remainingToRecover !== null ? formatMoney(remainingToRecover) : "—"}
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

      <button type="submit">Mettre à jour la mission</button>
    </form>
  )
}
