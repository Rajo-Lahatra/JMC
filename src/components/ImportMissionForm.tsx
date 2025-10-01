import { useState } from 'react'
import * as XLSX from 'xlsx'
import { supabase } from '../lib/supabaseClient'
import './ImportMissionForm.css'
export function ImportMissionForm({ onImported }: { onImported: () => void }) {
  const [fileName, setFileName] = useState('')
  const [importing, setImporting] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setImporting(true)

    const reader = new FileReader()
    reader.onload = async (evt) => {
      const data = evt.target?.result
      const workbook = XLSX.read(data, { type: 'binary' })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      const rows = XLSX.utils.sheet_to_json(sheet)

      const missions = rows.map((row: any) => ({
        dossier_number: row['Dossier'] || row['Numéro'] || '',
        client_name: row['Client'] || row['Nom du client'] || '',
        title: row['Titre'] || row['Objet'] || '',
        service: row['Service'] || 'TLS',
        stage: 'opportunite',
        billable: true,
        fees_amount: Number(row['Honoraires']) || 0,
        invoice_amount: Number(row['Facturé']) || 0,
        recovery_amount: Number(row['Recouvré']) || 0,
        currency: 'GNF',
        due_date: row['Échéance'] ? new Date(row['Échéance']).toISOString().slice(0, 10) : null,
        situation_state: row['Observations'] || '',
        situation_actions: row['Actions'] || '',
        partner_id: null,
      }))

      const { error } = await supabase.from('missions').insert(missions)
      if (error) {
        console.error('❌ Erreur importation:', error)
        alert('Erreur lors de l’importation.')
      } else {
        alert('✅ Importation réussie')
        onImported()
      }

      setImporting(false)
    }

    reader.readAsBinaryString(file)
  }

  return (
    <div className="import-form">
      <h3>📥 Importer des missions depuis Excel</h3>
      <input type="file" accept=".xlsx,.csv" onChange={handleFileUpload} />
      {fileName && <p>Fichier sélectionné : <strong>{fileName}</strong></p>}
      {importing && <p>⏳ Importation en cours...</p>}
    </div>
  )
}
