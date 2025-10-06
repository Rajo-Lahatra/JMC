import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { missionCatalog } from '../lib/missionCatalog'
import type { Client, Collaborator, Mission } from '../types'
import './CreateMissionForm.css'

interface CreateMissionFormProps {
  onSuccess: () => void
  onCancel: () => void
  initialData?: Partial<Mission>
}

// Type pour le formulaire qui gère les conversions null -> string
interface MissionFormData {
  dossier_number: string
  client_id: string
  client_name: string
  title: string
  service: string
  category_code: string
  prestation_code: string
  description: string
  stage: string
  situation_state: string
  situation_actions: string
  due_date: string
  partner_id: string
  billable: boolean
  currency: string
  fees_amount: number
  invoice_amount: number
  recovery_amount: number
}

// Type simplifié pour le formulaire de création de client
interface NewClientFormData {
  name: string
}

// Fonction utilitaire pour convertir les données Mission en données formulaire
const convertMissionToFormData = (mission: Partial<Mission>): Partial<MissionFormData> => {
  return {
    dossier_number: mission.dossier_number || '',
    client_id: mission.client_id || '',
    client_name: mission.client_name || '',
    title: mission.title || '',
    service: mission.service || '',
    category_code: mission.category_code || '',
    prestation_code: mission.prestation_code || '',
    description: mission.description || '',
    stage: mission.stage || 'opportunite',
    situation_state: mission.situation_state || '',
    situation_actions: mission.situation_actions || '',
    due_date: mission.due_date ? new Date(mission.due_date).toISOString().split('T')[0] : '',
    partner_id: mission.partner_id || '',
    billable: mission.billable ?? true,
    currency: mission.currency || 'USD',
    fees_amount: mission.fees_amount || 0,
    invoice_amount: mission.invoice_amount || 0,
    recovery_amount: mission.recovery_amount || 0,
  }
}

export function CreateMissionForm({ onSuccess, onCancel, initialData }: CreateMissionFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [isInternalClient, setIsInternalClient] = useState(false)
  
  // États pour la création de nouveau client
  const [showNewClientForm, setShowNewClientForm] = useState(false)
  const [creatingClient, setCreatingClient] = useState(false)
  const [newClientForm, setNewClientForm] = useState<NewClientFormData>({
    name: ''
  })
  
  // États du formulaire avec le type correct
  const [formData, setFormData] = useState<MissionFormData>({
    dossier_number: '',
    client_id: '',
    client_name: '',
    title: '',
    service: '',
    category_code: '',
    prestation_code: '',
    description: '',
    stage: 'opportunite',
    situation_state: '',
    situation_actions: '',
    due_date: '',
    partner_id: '',
    billable: true,
    currency: 'USD',
    fees_amount: 0,
    invoice_amount: 0,
    recovery_amount: 0
  })

  // États dérivés pour le catalogue
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedPrestation, setSelectedPrestation] = useState('')

  // Chargement des données initiales
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [clientsResponse, collaboratorsResponse] = await Promise.all([
          supabase.from('clients').select('*').order('name'),
          supabase.from('collaborators').select('*').order('first_name')
        ])

        if (clientsResponse.error) throw new Error(`Clients: ${clientsResponse.error.message}`)
        if (collaboratorsResponse.error) throw new Error(`Collaborateurs: ${collaboratorsResponse.error.message}`)

        setClients(clientsResponse.data || [])
        setCollaborators(collaboratorsResponse.data || [])
      } catch (err) {
        setError('Erreur lors du chargement des données')
        console.error('Fetch error:', err)
      }
    }

    fetchInitialData()
  }, [])

  // Initialisation avec les données existantes
  useEffect(() => {
    if (initialData) {
      const convertedData = convertMissionToFormData(initialData)
      const isInternal = convertedData.client_name === 'INTERNE'
      
      setIsInternalClient(isInternal)
      setFormData(prev => ({
        ...prev,
        ...convertedData
      }))
      
      if (initialData.category_code) {
        setSelectedCategory(initialData.category_code)
      }
      if (initialData.prestation_code) {
        setSelectedPrestation(initialData.prestation_code)
      }
    }
  }, [initialData])

  // Gestion des changements de catégorie
  useEffect(() => {
    if (selectedCategory && missionCatalog[selectedCategory]) {
      const category = missionCatalog[selectedCategory]
      setFormData(prev => ({
        ...prev,
        category_code: selectedCategory,
        service: category.label
      }))
      
      // Réinitialiser la prestation si la catégorie change
      if (!missionCatalog[selectedCategory].prestations[selectedPrestation]) {
        setSelectedPrestation('')
        setFormData(prev => ({ 
          ...prev, 
          prestation_code: '', 
          title: '', 
          description: '' 
        }))
      }
    }
  }, [selectedCategory, selectedPrestation])

  // Gestion des changements de prestation
  useEffect(() => {
    if (selectedCategory && selectedPrestation && missionCatalog[selectedCategory]?.prestations[selectedPrestation]) {
      const prestation = missionCatalog[selectedCategory].prestations[selectedPrestation]
      setFormData(prev => ({
        ...prev,
        prestation_code: selectedPrestation,
        title: prestation.label,
        description: prestation.description
      }))
    }
  }, [selectedPrestation, selectedCategory])

  // Gestion des changements de client
  const handleClientChange = (clientId: string) => {
    if (clientId === "new_client") {
      setShowNewClientForm(true)
      return
    }

    const client = clients.find(c => c.id === clientId)
    const isInternal = client?.name === 'INTERNE'
    
    setIsInternalClient(isInternal)
    setFormData(prev => ({
      ...prev,
      client_id: clientId,
      client_name: client?.name || '',
      // Réinitialiser certains champs pour les missions internes
      ...(isInternal && {
        billable: false,
        stage: 'simple_suivi',
        partner_id: '',
        due_date: '',
        fees_amount: 0,
        invoice_amount: 0,
        recovery_amount: 0
      })
    }))
  }

  // Création d'un nouveau client - Version sans created_by
  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreatingClient(true)
    setError(null)

    try {
      if (!newClientForm.name.trim()) {
        throw new Error('Le nom du client est obligatoire')
      }

    // Insertion du nouveau client sans created_by
    const { data: newClient, error: clientError } = await supabase
      .from('clients')
      .insert([
        {
          name: newClientForm.name
          // created_by temporairement désactivé
        }
      ])
      .select()
      .single()

    if (clientError) {
      console.error('Erreur détaillée Supabase:', clientError)
      throw clientError
    }

    // Mettre à jour la liste des clients
    setClients(prev => [...prev, newClient])

    // Sélectionner automatiquement le nouveau client
    setIsInternalClient(newClient.name === 'INTERNE')
    setFormData(prev => ({
      ...prev,
      client_id: newClient.id,
      client_name: newClient.name,
      ...(newClient.name === 'INTERNE' && {
        billable: false,
        stage: 'simple_suivi',
        partner_id: '',
        due_date: '',
        fees_amount: 0,
        invoice_amount: 0,
        recovery_amount: 0
      })
    }))

    // Fermer le formulaire de création de client
    setShowNewClientForm(false)
    setNewClientForm({
      name: ''
    })

    } catch (err: any) {
      console.error('Erreur création client:', err)
      setError(err.message || 'Erreur lors de la création du client')
    } finally {
      setCreatingClient(false)
    }
  }

  // Annuler la création de client
  const handleCancelClientCreation = () => {
    setShowNewClientForm(false)
    setNewClientForm({
      name: ''
    })
    setFormData(prev => ({ ...prev, client_id: '' }))
  }

  // Validation du formulaire
  const validateForm = (): boolean => {
    if (!formData.dossier_number.trim()) {
      setError('Le numéro de dossier est obligatoire')
      return false
    }
    if (!formData.client_id) {
      setError('Veuillez sélectionner un client')
      return false
    }
    if (!formData.title.trim()) {
      setError('Le titre de la mission est obligatoire')
      return false
    }
    // Pour les missions non-internes, vérifier l'associé responsable
    if (!isInternalClient && !formData.partner_id) {
      setError('Veuillez sélectionner un associé responsable')
      return false
    }
    return true
  }

  // Soumission du formulaire - Version sans created_by
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!validateForm()) return

    setLoading(true)

    try {
      // Préparer les données pour l'insertion sans created_by
      const missionData = {
        dossier_number: formData.dossier_number,
        client_id: formData.client_id,
        client_name: formData.client_name,
        title: formData.title,
        service: formData.service,
        category_code: formData.category_code,
        prestation_code: formData.prestation_code,
        description: formData.description,
        stage: formData.stage,
        situation_state: formData.situation_state,
        situation_actions: formData.situation_actions,
        due_date: formData.due_date || null,
        partner_id: formData.partner_id || null,
        billable: formData.billable,
        currency: formData.currency,
        fees_amount: formData.fees_amount || 0,
        invoice_amount: formData.invoice_amount || 0,
        recovery_amount: formData.recovery_amount || 0
        // created_by temporairement omis
      }

      console.log('Données mission à insérer:', missionData)

      const { error: supabaseError } = await supabase
        .from('missions')
        .insert([missionData])
        .select()

      if (supabaseError) {
        console.error('Erreur Supabase détaillée:', supabaseError)
        throw supabaseError
      }

      onSuccess()
      
    } catch (err: any) {
      console.error('Erreur création mission:', err)
      setError(err.message || 'Erreur lors de la création de la mission')
    } finally {
      setLoading(false)
    }
  }

  // Rendu des options de catégories
  const renderCategoryOptions = () => {
    return Object.entries(missionCatalog).map(([code, category]) => (
      <option key={code} value={code}>
        {code} - {category.label}
      </option>
    ))
  }

  // Rendu des options de prestations
  const renderPrestationOptions = () => {
    if (!selectedCategory || !missionCatalog[selectedCategory]) {
      return <option value="">Sélectionnez d'abord une catégorie</option>
    }

    return Object.entries(missionCatalog[selectedCategory].prestations).map(([code, prestation]) => (
      <option key={code} value={code}>
        {code} - {prestation.label}
      </option>
    ))
  }

  return (
    <div className="create-mission-form-container">
      <div className="form-header">
        <h2>{initialData ? 'Modifier la mission' : 'Nouvelle mission'}</h2>
        <button type="button" className="close-button" onClick={onCancel}>×</button>
      </div>

      <form onSubmit={handleSubmit} className="mission-form">
        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {/* Message pour les missions INTERNE */}
        {isInternalClient && (
          <div className="internal-note">
            <strong>Mission INTERNE</strong> - Les informations de gestion et financières sont masquées pour les missions internes.
          </div>
        )}

        <div className="form-grid">
          {/* Section identification */}
          <div className={`form-section ${isInternalClient ? 'internal-client-section' : ''}`}>
            <h3>Identification</h3>
            
            <div className="form-group">
              <label htmlFor="dossier_number">Numéro de dossier *</label>
              <input
                id="dossier_number"
                type="text"
                value={formData.dossier_number}
                onChange={e => setFormData(prev => ({ ...prev, dossier_number: e.target.value }))}
                required
                disabled={loading}
                placeholder="EX: 2024-CORP-001"
              />
            </div>

            <div className="form-group">
              <label htmlFor="client_id">Client *</label>
              <select
                id="client_id"
                value={formData.client_id}
                onChange={e => handleClientChange(e.target.value)}
                required
                disabled={loading || showNewClientForm}
              >
                <option value="">Sélectionnez un client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
                {/* Ajout de l'option Nouveau client */}
                <option value="new_client" className="new-client-option">
                  + Nouveau client
                </option>
              </select>
            </div>
          </div>

          {/* Section catalogue */}
          <div className="form-section catalog-section">
            <h3>Catalogue des missions</h3>

            <div className="form-group">
              <label htmlFor="category_code">Catégorie *</label>
              <select
                id="category_code"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                required
                disabled={loading}
              >
                <option value="">Sélectionnez une catégorie</option>
                {renderCategoryOptions()}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="prestation_code">Prestation *</label>
              <select
                id="prestation_code"
                value={selectedPrestation}
                onChange={e => setSelectedPrestation(e.target.value)}
                required
                disabled={loading || !selectedCategory}
              >
                <option value="">Sélectionnez une prestation</option>
                {renderPrestationOptions()}
              </select>
            </div>

            {selectedPrestation && missionCatalog[selectedCategory]?.prestations[selectedPrestation] && (
              <div className="prestation-info">
                <h4>Description de la prestation :</h4>
                <p>{missionCatalog[selectedCategory].prestations[selectedPrestation].description}</p>
              </div>
            )}
          </div>

          {/* Section personnalisation */}
          <div className="form-section">
            <h3>Personnalisation</h3>

            <div className="form-group">
              <label htmlFor="title">Titre de la mission *</label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                disabled={loading}
                placeholder="Titre personnalisé (optionnel)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description détaillée</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                disabled={loading}
                placeholder="Description complémentaire..."
              />
            </div>
          </div>

          {/* Section gestion - Conditionnelle pour INTERNE */}
          {!isInternalClient && (
            <div className="form-section management-section">
              <h3>Gestion</h3>

              <div className="form-group">
                <label htmlFor="partner_id">Associé responsable *</label>
                <select
                  id="partner_id"
                  value={formData.partner_id}
                  onChange={e => setFormData(prev => ({ ...prev, partner_id: e.target.value }))}
                  required
                  disabled={loading}
                >
                  <option value="">Sélectionnez un associé</option>
                  {collaborators
                    .filter(c => c.grade === 'Partner')
                    .map(collab => (
                      <option key={collab.id} value={collab.id}>
                        {collab.first_name} {collab.last_name}
                      </option>
                    ))
                  }
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="stage">Étape</label>
                <select
                  id="stage"
                  value={formData.stage}
                  onChange={e => setFormData(prev => ({ ...prev, stage: e.target.value }))}
                  disabled={loading}
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
              </div>

              <div className="form-group">
                <label htmlFor="due_date">Échéance</label>
                <input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={e => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                  disabled={loading}
                />
              </div>
            </div>
          )}

          {/* Section financière - Conditionnelle pour INTERNE */}
          {!isInternalClient && (
            <div className="form-section finance-section">
              <h3>Informations financières</h3>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.billable}
                    onChange={e => setFormData(prev => ({ ...prev, billable: e.target.checked }))}
                    disabled={loading}
                  />
                  Mission facturable
                </label>
              </div>

              {formData.billable && (
                <>
                  <div className="form-group">
                    <label htmlFor="currency">Devise</label>
                    <select
                      id="currency"
                      value={formData.currency}
                      onChange={e => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                      disabled={loading}
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GNF">GNF</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="fees_amount">Honoraires estimés</label>
                    <input
                      id="fees_amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.fees_amount}
                      onChange={e => setFormData(prev => ({ ...prev, fees_amount: parseFloat(e.target.value) || 0 }))}
                      disabled={loading}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Section situation */}
          <div className="form-section full-width situation-section">
            <h3>Situation et actions</h3>

            <div className="form-group">
              <label htmlFor="situation_state">Situation actuelle</label>
              <textarea
                id="situation_state"
                value={formData.situation_state}
                onChange={e => setFormData(prev => ({ ...prev, situation_state: e.target.value }))}
                disabled={loading}
                placeholder="État d'avancement, difficultés rencontrées..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="situation_actions">Actions à entreprendre</label>
              <textarea
                id="situation_actions"
                value={formData.situation_actions}
                onChange={e => setFormData(prev => ({ ...prev, situation_actions: e.target.value }))}
                disabled={loading}
                placeholder="Prochaines étapes, délais, responsables..."
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="cancel-button"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? 'Création...' : (initialData ? 'Modifier' : 'Créer la mission')}
          </button>
        </div>
      </form>

      {/* Modal de création de nouveau client simplifié */}
      {showNewClientForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Nouveau client</h3>
              <button 
                type="button" 
                className="close-button" 
                onClick={handleCancelClientCreation}
                disabled={creatingClient}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="client-form">
              {error && (
                <div className="error-message">
                  ⚠️ {error}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="client_name">Nom du client *</label>
                <input
                  id="client_name"
                  type="text"
                  value={newClientForm.name}
                  onChange={e => setNewClientForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                  disabled={creatingClient}
                  placeholder="Nom de l'entreprise ou du client"
                  autoFocus
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={handleCancelClientCreation}
                  disabled={creatingClient}
                  className="cancel-button"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={creatingClient}
                  className="submit-button"
                >
                  {creatingClient ? 'Création...' : 'Créer le client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}