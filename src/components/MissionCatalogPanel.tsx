import { missionCatalog } from '../lib/missionCatalog'
import './MissionCatalogPanel.css'

export function MissionCatalogPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="mission-catalog-panel">
      <button className="close-button" onClick={onClose}>×</button>
      <h2>📚 Types de missions</h2>

      {Object.entries(missionCatalog).map(([categoryCode, category]) => (
        <div key={categoryCode} className="category-block">
          <h3>{categoryCode} – {category.label}</h3>
          <ul>
            {Object.entries(category.prestations).map(([prestationCode, prestation]) => {
              const label = typeof prestation === 'string' ? prestation : prestation.label
              const description = typeof prestation === 'string' ? '' : prestation.description
              return (
                <li key={prestationCode}>
                  <strong>{prestationCode} – {label}</strong>
                  {description && (
                    <p className="prestation-description">{description}</p>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}
