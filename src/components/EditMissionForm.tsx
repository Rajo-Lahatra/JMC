import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { ServiceLine, MissionStage } from '../types'
import type { Collaborator } from '../types'
import './EditMissionForm.css'

export function EditMissionForm({
  missionId,
  onUpdated,
}: {
  missionId: string
  onUpdated: () => void
}) {
  const [currentUserGrade, setCurrentUserGrade] = useState<string | null>(null)

  // États mission
  const [dossierNumber, setDossierNumber] = useState('')
  const [clientName, setClientName] = useState('')
  const [title, setTitle] = useState('')
  const [service, setService] = useState<ServiceLine>('TLS')
  const [partnerId, setPartnerId] = useState<string | null>(null)
  const [stage, setStage] = useState<MissionStage>('opportunite')
  const [situationState, setSituationState] = useState('')
  const [situationActions, setSituationActions] = useState('')
  const [billable, setBillable] = useState(true)
  const [feesAmount, setFeesAmount] = useState('')
  const [invoiceAmount, setInvoiceAmount] = useState('')
  const [recoveryAmount, setRecoveryAmount] = useState('')
  const [currency, setCurrency] = useState<'GNF' | 'USD' | 'EUR'>('GNF')
  const [dueDate, setDueDate] = useState<string>('')
  const [editFinance, setEditFinance] = useState(false)
  const [timesheets, setTimesheets] = useState<any[]>([])
  const [collabs, setCollabs] = useState<Collaborator[]>([])
  const [newTime, setNewTime] = useState({
    collaborator_id: '',
    date_worked: '',
    hours_worked: '',
  })

  // Charger grade utilisateur + mission
  useEffect(() => {
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

  useEffect(() => {
    if (!missionId) return

    supabase
      .from('mission_timesheets')
      .select('*')
      .eq('mission_id', missionId)
      .then(({ data, error }) => {
        if (error) console.error('Erreur chargement temps:', error)
        else if (data) setTimesheets(data)
      })

    supabase
      .from('collaborators')
      .select('*')
      .then(({ data, error }) => {
        if (error) console.error('Erreur chargement collaborateurs:', error)
        else if (data) setCollabs(data)
      })
  }, [missionId])

  const handleAddTime = async () => {
    const { collaborator_id, date_worked, hours_worked } = newTime
    if (!collaborator_id || !date_worked || !hours_worked) return

    const { error } = await supabase.from('mission_timesheets').insert([
      {
        mission_id: missionId,
        collaborator_id,
        date_worked,
        hours_worked: Number(hours_worked),
      },
    ])

    if (error) {
      console.error('Erreur ajout temps:', error)
      return
    }

    setNewTime({ collaborator_id: '', date_worked: '', hours_worked: '' })

    supabase
      .from('mission_timesheets')
      .select('*')
      .eq('mission_id', missionId)
      .then(({ data }) => setTimesheets(data ?? []))
  }

  const hourlyRates: Record<string, number> = {
    Junior: 100,
    Senior: 140,
    Manager: 200,
    'Senior Manager': 250,
    Director: 300,
    Partner: 400,
  }

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
    <div className="edit-mission-form-container">
      <div className="edit-form-header">
          <h2 style={{ color: 'white' }}>Modifier la mission</h2>
      </div>

      <form onSubmit={handleUpdate} className="edit-mission-form">
        <div className="edit-form-grid">
          {/* Section identification */}
          <div className="edit-form-section">
            <h3>Identification</h3>
            
            <div className="edit-form-group">
              <label htmlFor="dossier_number">Numéro de dossier</label>
              <input
                id="dossier_number"
                type="text"
                value={dossierNumber}
                onChange={e => setDossierNumber(e.target.value)}
              />
            </div>

            <div className="edit-form-group">
              <label htmlFor="client_name">Nom du client / prospect</label>
              <input
                id="client_name"
                type="text"
                value={clientName}
                onChange={e => setClientName(e.target.value)}
              />
            </div>

            <div className="edit-form-group">
              <label htmlFor="title">Titre de la mission</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>
          </div>

          {/* Section gestion */}
          <div className="edit-form-section">
            <h3>Gestion</h3>

            <div className="edit-form-group">
              <label htmlFor="stage">Étape du dossier</label>
              <select
                id="stage"
                value={stage}
                onChange={e => setStage(e.target.value as MissionStage)}
              >
                <option value="opportunite">Opportunité</option>
                <option value="lettre_envoyee">Lettre de mission envoyée</option>
                <option value="lettre_signee">Lettre de mission signée</option>
                <option value="staff_traitement">Traitement en interne par le staff</option>
                <option value="revue_manager">Revue au niveau du manager</option>
                <option value="revue_associes">Revue des associés</option>
                <option value="livrable_envoye">Livrable envoyé</option>
                <option value="simple_suivi">Suivi simple</option>
              </select>
            </div>

            <div className="edit-form-group">
              <label htmlFor="due_date">Date d'échéance</label>
              <input
                id="due_date"
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
              />
            </div>

            <div className="edit-form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={billable}
                  onChange={e => setBillable(e.target.checked)}
                />
                Mission facturable
              </label>
            </div>
          </div>

          {/* Section situation */}
          <div className="edit-form-section full-width">
            <h3>Situation et actions</h3>

            <div className="edit-form-group">
              <label htmlFor="situation_state">Situation actuelle</label>
              <textarea
                id="situation_state"
                value={situationState}
                onChange={e => setSituationState(e.target.value)}
                placeholder="État d'avancement, difficultés rencontrées..."
                rows={4}
              />
            </div>

            <div className="edit-form-group">
              <label htmlFor="situation_actions">Actions à entreprendre</label>
              <textarea
                id="situation_actions"
                value={situationActions}
                onChange={e => setSituationActions(e.target.value)}
                placeholder="Prochaines étapes, délais, responsables..."
                rows={4}
              />
            </div>
          </div>

          {/* Section financière */}
          {canEditFinance && (
            <div className="edit-form-section full-width finance-section">
              <div className="finance-section-header">
                <h3>Informations financières</h3>
                <button 
                  type="button" 
                  className="finance-toggle-btn"
                  onClick={() => setEditFinance(prev => !prev)}
                >
                  {editFinance ? '🔒 Verrouiller' : '✏️ Modifier'}
                </button>
              </div>

              <fieldset disabled={!billable || !editFinance} className="finance-fieldset">
                <div className="finance-grid">
                  <div className="edit-form-group">
                    <label htmlFor="currency">Devise</label>
                    <select
                      id="currency"
                      value={currency}
                      onChange={e => setCurrency(e.target.value as 'GNF' | 'USD' | 'EUR')}
                    >
                      <option value="GNF">GNF</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>

                  <div className="edit-form-group">
                    <label htmlFor="fees_amount">Honoraires prévus</label>
                    <input
                      id="fees_amount"
                      type="number"
                      value={feesAmount}
                      onChange={e => setFeesAmount(e.target.value)}
                    />
                    <div className="finance-display">
                      Affiché: <strong>{formatMoney(feesAmount)}</strong>
                    </div>
                  </div>

                  <div className="edit-form-group">
                    <label htmlFor="invoice_amount">Montant facturé</label>
                    <input
                      id="invoice_amount"
                      type="number"
                      value={invoiceAmount}
                      onChange={e => setInvoiceAmount(e.target.value)}
                    />
                    <div className="finance-display">
                      Affiché: <strong>{formatMoney(invoiceAmount)}</strong>
                    </div>
                  </div>

                  <div className="edit-form-group">
                    <label htmlFor="recovery_amount">Montant recouvré</label>
                    <input
                      id="recovery_amount"
                      type="number"
                      value={recoveryAmount}
                      onChange={e => setRecoveryAmount(e.target.value)}
                    />
                    <div className="finance-display">
                      Affiché: <strong>{formatMoney(recoveryAmount)}</strong>
                    </div>
                  </div>
                </div>

                <div className="finance-summary">
                  <div className="summary-item">
                    <span>Montant restant à facturer:</span>
                    <strong>{remainingToInvoice !== null ? formatMoney(remainingToInvoice) : '—'}</strong>
                  </div>
                  <div className="summary-item">
                    <span>Montant restant à recouvrer:</span>
                    <strong>{remainingToRecover !== null ? formatMoney(remainingToRecover) : '—'}</strong>
                  </div>
                </div>
              </fieldset>
            </div>
          )}

          {/* Section timesheets */}
          <div className="edit-form-section full-width timesheet-section">
            <h3>⏱ Temps passé par collaborateur</h3>

            <div className="timesheet-table-container">
              <table className="timesheet-table">
                <thead>
                  <tr>
                    <th>Collaborateur</th>
                    <th>Date</th>
                    <th>Heures</th>
                    <th>Taux (EUR/h)</th>
                    <th>Valeur (EUR)</th>
                  </tr>
                </thead>
                <tbody>
                  {timesheets.map(t => {
                    const collab = collabs.find(c => c.id === t.collaborator_id)
                    const grade = collab?.grade ?? ''
                    const rate = hourlyRates[grade] ?? 0
                    const value = rate * t.hours_worked

                    return (
                      <tr key={t.id}>
                        <td>{collab ? `${collab.first_name} ${collab.last_name}` : t.collaborator_id}</td>
                        <td>{t.date_worked}</td>
                        <td>{t.hours_worked}</td>
                        <td>{rate}</td>
                        <td>{value.toFixed(2)}</td>
                      </tr>
                    )
                  })}
                  {timesheets.length === 0 && (
                    <tr>
                      <td colSpan={5} className="no-data">
                        Aucun temps enregistré
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="add-timesheet-form">
              <h4>Ajouter du temps</h4>
              <div className="timesheet-inputs">
                <div className="edit-form-group">
                  <label>Collaborateur</label>
                  <select
                    value={newTime.collaborator_id}
                    onChange={e => setNewTime(prev => ({ ...prev, collaborator_id: e.target.value }))}
                  >
                    <option value="">Choisir collaborateur</option>
                    {collabs.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.first_name} {c.last_name} ({c.grade})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="edit-form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={newTime.date_worked}
                    onChange={e => setNewTime(prev => ({ ...prev, date_worked: e.target.value }))}
                  />
                </div>

                <div className="edit-form-group">
                  <label>Heures</label>
                  <input
                    type="number"
                    placeholder="Heures"
                    value={newTime.hours_worked}
                    onChange={e => setNewTime(prev => ({ ...prev, hours_worked: e.target.value }))}
                  />
                </div>

                <div className="edit-form-group">
                  <label>&nbsp;</label>
                  <button type="button" onClick={handleAddTime} className="add-time-button">
                    ➕ Ajouter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="edit-form-actions">
          <button type="submit" className="edit-submit-button">
            Mettre à jour la mission
          </button>
        </div>
      </form>
    </div>
  )
}
