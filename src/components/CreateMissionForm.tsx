import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import type {
  Collaborator,
  ServiceLine,
  MissionStage,
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
  const [feesAmount, setFeesAmount] = useState('')
  const [invoiceAmount, setInvoiceAmount] = useState('')
  const [recoveryAmount, setRecoveryAmount] = useState('')
  const [dueDate, setDueDate] = useState<string>('')

  useEffect(() => {
    supabase
      .from('collaborators')
      .select('id, first_name, last_name, grade')
      .order('last_name', { ascending: true })
      .then(({ data, error }) => {
        if (error) console.error('Erreur chargement collaborateurs:', error)
        else if (data) setCollabs(data as Collaborator[])
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('✅ Soumission du formulaire')

    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) console.error('Erreur récupération utilisateur:', userError)

    const creatorId = userData?.user?.id
    if (!creatorId) {
      console.error('❌ Utilisateur non identifié')
      console.log('👤 ID utilisateur connecté :', creatorId)
      return
    }
    console.log('👤 Utilisateur identifié :', creatorId)

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
        fees_amount: feesAmount || null,
        invoice_amount: billable ? invoiceAmount || null : null,
        recovery_amount: billable ? recoveryAmount || null : null,
        due_date: dueDate || null,
        partner_id: partnerId,
        created_by: creatorId,
      }])
      .select('id')

    if (missionError || !missions?.length) {
      console.error('❌ Erreur insertion mission:', missionError)
      return
    }

    const missionId = missions[0].id
    console.log('✅ Mission créée avec ID :', missionId)

    if (assignedIds.length) {
      const links = assignedIds.map(id => ({
        mission_id: missionId,
        collaborator_id: id,
      }))
      const { error: linkError } = await supabase
        .from('mission_collaborators')
        .insert(links)
      if (linkError) console.error('❌ Erreur liaison collaborateurs:', linkError)
      else console.log('✅ Collaborateurs liés à la mission')
    }

    console.log('✅ Fermeture du formulaire et rafraîchissement')
    onCreated()
  }

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

      <fieldset disabled={!billable} style={{ opacity: billable ? 1 : 0.5 }}>
        <legend>Détails financiers</legend>

        <label>Honoraires prévus</label>
        <input
          type="number"
          value={feesAmount}
          onChange={e => setFeesAmount(e.target.value)}
        />

        <label>Montant facturé</label>
        <input
          type="number"
          value={invoiceAmount}
          onChange={e => setInvoiceAmount(e.target.value)}
        />

        <label>Montant recouvré</label>
        <input
          type="number"
          value={recoveryAmount}
          onChange={e => setRecoveryAmount(e.target.value)}
        />
      </fieldset>

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
