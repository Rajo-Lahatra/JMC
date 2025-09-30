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
        if (error) console.error(error)
        else if (data) setCollabs(data as Collaborator[])
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { data: userData } = await supabase.auth.getUser()
    const creatorId = userData?.user?.id

    if (!creatorId) {
      console.error('Utilisateur non identifié')
      return
    }

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
      console.error(missionError)
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

    onCreated()
  }

  return (
    <form onSubmit={handleSubmit} className="create-mission-form">
      {/* ... formulaire inchangé ... */}
    </form>
  )
}
