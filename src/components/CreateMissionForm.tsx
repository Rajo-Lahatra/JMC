// src/components/CreateMissionForm.tsx
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import type {
  Collaborator,
  ServiceLine,
  MissionStage,
  FinancialInvoiceStage,
  FinancialRecoveryStage,
} from '../types'

export function CreateMissionForm({ onCreated }: { onCreated: () => void }) {
  const [collabs, setCollabs] = useState<Collaborator[]>([])
  const [dossierNumber, setDossierNumber] = useState('')
  const [clientName, setClientName] = useState('')
  const [title, setTitle] = useState('')
  const [service, setService] = useState<ServiceLine>('TLS')
  const [partnerId, setPartnerId] = useState<string | null>(null)
  const [stage, setStage] = useState<MissionStage>('opportunite')
  const [assignedIds, setAssignedIds] = useState<string[]>([])
  const [situationState, setSituationState] = useState('')
  const [situationActions, setSituationActions] = useState('')
  const [billable, setBillable] = useState(true)
  const [invoiceStage, setInvoiceStage] = useState<FinancialInvoiceStage>('none')
  const [recoveryStage, setRecoveryStage] = useState<FinancialRecoveryStage>('none')
  const [dueDate, setDueDate] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase
      .from('collaborators')
      .select('id, first_name, last_name, grade')
      .order('last_name', { ascending: true })
      .then(({ data, error }) => {
        if (error) console.error(error)
        else if (data) setCollabs(data as Collaborator[])
      })
  }, [])

  // Garde uniquement les "Partner" pour l'associé responsable
  const partners = collabs.filter(c => c.grade === 'Partner')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: missions, error: missionError } = await supabase
      .from('missions')
      .insert([{
        dossier_number: dossierNumber,
        service,
        title,
        client_name: clientName,
        description: null,
        stage,
        situation_state: situationState || null,
        situation_actions: situationActions || null,
        billable,
        invoice_stage: invoiceStage,
        recovery_stage: recoveryStage,
        due_date: dueDate || null,
        partner_id: partnerId,
      }])
      .select('id')

    if (missionError || !missions?.length) {
      console.error(missionError)
      setLoading(false)
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
      if (linkError) console.error(linkError)
    }

    setLoading(false)
    onCreated()
  }

  return (
    <form onSubmit={handleSubmit} className="create-mission-form">
      <h2>Créer une mission</h2>

      <label>Numéro de dossier</label>
      <input
        value={dossierNumber}
        onChange={e => setDossierNumber(e.target.value)}
        placeholder="Ex : D-2025-001"
        required
      />

      <label>Nom du client / prospect</label>
      <input
        value={clientName}
        onChange={e => setClientName(e.target.value)}
        placeholder="Nom du client"
        required
      />

      <label>Titre de la mission</label>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Revue fiscale, assistance comptable…"
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
        required
      >
        <option value="">— Sélectionner un Partner —</option>
        {partners.map(c => (
          <option key={c.id} value={c.id}>
            {c.first_name} {c.last_name}
          </option>
        ))}
      </select>

      <label>Étape du dossier</label>
      <select
        value={stage}
        onChange={e => setStage(e.target.value as MissionStage)}
      >
        <option value="opportunite">Opportunité</option>
        <option value="lettre_envoyee">LM envoyée</option>
        <option value="lettre_signee">LM signée</option>
        <option value="staff_traitement">Traitement interne</option>
        <option value="revue_manager">Revue manager</option>
        <option value="revue_associes">Validation associés</option>
        <option value="livrable_envoye">Livrable envoyé</option>
        <option value="simple_suivi">Simple suivi</option>
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

      <label>Facturation</label>
      <select
        value={invoiceStage}
        onChange={e => setInvoiceStage(e.target.value as FinancialInvoiceStage)}
      >
        <option value="none">Aucune</option>
        <option value="acompte">Acompte</option>
        <option value="totale">Totale</option>
        <option value="solde">Solde</option>
      </select>

      <label>Recouvrement</label>
      <select
        value={recoveryStage}
        onChange={e => setRecoveryStage(e.target.value as FinancialRecoveryStage)}
      >
        <option value="none">Aucun</option>
        <option value="partiel">Partiel</option>
        <option value="total">Total</option>
      </select>

      <label>Date d’échéance</label>
      <input
        type="date"
        value={dueDate}
        onChange={e => setDueDate(e.target.value)}
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Création…' : 'Créer mission'}
      </button>
    </form>
  )
}
