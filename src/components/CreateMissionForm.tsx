import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { ServiceLine, MissionStage } from '../types'
import './CreateMissionForm.css'
import { missionCatalog } from '../lib/missionCatalog'

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
  const [title, setTitle] = useState('')
  const [service, setService] = useState<ServiceLine>('TLS')
const [partnerId, _setPartnerId] = useState<string | null>(null)
const [creatorId, _setCreatorId] = useState<string | null>(null)
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
  const [editFinance, setEditFinance] = useState(false)

  const isInternal = selectedCategory === 'G'

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
      const { data: profile, error: profErr } = await supabase
        .from('collaborators')
        .select('grade')
        .eq('auth_id', user.id)
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

    let clientId = selectedClientId

    if (!isInternal && selectedClientId === '__new__' && newClientName.trim()) {
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
        client_id: isInternal ? null : clientId,
        description: null,
        stage,
        situation_state: situationState || null,
        situation_actions: situationActions || null,
        billable: isInternal ? false : billable,
        fees_amount: feesAmount || null,
        invoice_amount: isInternal ? null : (billable ? invoiceAmount || null : null),
        recovery_amount: isInternal ? null : (billable ? recoveryAmount || null : null),
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

  const _remainingToInvoice =
    feesAmount && invoiceAmount
      ? Number(feesAmount) - Number(invoiceAmount)
      : null

  const _remainingToRecover =
    invoiceAmount && recoveryAmount
      ? Number(invoiceAmount) - Number(recoveryAmount)
      : null

  const _formatMoney = (value: string | number | null) => {
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

  return (
    <form onSubmit={handleSubmit} className="create-mission-form">
      <label>Numéro de dossier</label>
      <input
        value={dossierNumber}
        onChange={e => setDossierNumber(e.target.value)}
        required
      />

      {!isInternal && (
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
      )}

      {!isInternal && selectedClientId === '__new__' && (
        <input
          type="text"
          placeholder="Nom du nouveau client"
          value={newClientName}
          onChange={e => setNewClientName(e.target.value)}
        />
      )}

      <div className="form-row">
        <label>Catégorie de Mission</label>
        <select value={selectedCategory} onChange={e => {
          setSelectedCategory(e.target.value)
          setSelectedPrestation('')
        }}>
          <option value="">Sélectionner une catégorie</option>
          {Object.entries(missionCatalog).map(([code, category]) => (
            <option key={code} value={code}>{code} – {category.label}</option>
          ))}
        </select>
      </div>

      {isInternal && (
        <div className="non-billable-tag">
          ⛔ Cette mission est interne et non facturable.
        </div>
      )}
      <div className="form-row">
        <label>Prestation</label>
        <select
          value={selectedPrestation}
          onChange={e => setSelectedPrestation(e.target.value)}
          required
        >
          <option value="">Sélectionner une prestation</option>
          {selectedCategory &&
            Object.entries(missionCatalog[selectedCategory]?.prestations ?? {}).map(
              ([code, prestation]) => (
                <option key={code} value={code}>
                  {code} – {prestation.label}
                </option>
              )
            )}
        </select>
      </div>

      {selectedPrestation && (
        <div className="prestation-description">
          <strong>Description :</strong>
          <p>{missionCatalog[selectedCategory]?.prestations[selectedPrestation]?.description}</p>
        </div>
      )}

      <label>Titre de la mission</label>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />

      <label>Service concerné</label>
      <select value={service} onChange={e => setService(e.target.value as ServiceLine)}>
        <option value="TLS">TLS</option>
        <option value="TAX">TAX</option>
        <option value="LEGAL">LEGAL</option>
        <option value="ADVISORY">ADVISORY</option>
      </select>

      <label>Stade de la mission</label>
      <select value={stage} onChange={e => setStage(e.target.value as MissionStage)}>
        <option value="opportunite">Opportunité</option>
        <option value="en_cours">En cours</option>
        <option value="terminee">Terminée</option>
      </select>

      <label>Collaborateurs assignés</label>
      <select
        multiple
        value={assignedIds}
        onChange={e =>
          setAssignedIds(Array.from(e.target.selectedOptions, option => option.value))
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
        rows={2}
      />

      <label>Actions à mener</label>
      <textarea
        value={situationActions}
        onChange={e => setSituationActions(e.target.value)}
        rows={2}
      />

      {!isInternal && (
        <>
          <label>Mission facturable ?</label>
          <input
            type="checkbox"
            checked={billable}
            onChange={e => setBillable(e.target.checked)}
          />

          {editFinance && (
            <>
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

              <label>Devise</label>
              <select value={currency} onChange={e => setCurrency(e.target.value as any)}>
                <option value="GNF">GNF</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>

              <label>Échéance</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
              />
            </>
          )}
        </>
      )}

      <button type="submit">✅ Créer la mission</button>
    </form>
  )
}
