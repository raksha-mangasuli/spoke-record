import { useState } from 'react'
import './theme.css'
import { useAppState } from './useAppState'
import { BikeList } from './components/BikeList'
import { BikeDetail } from './components/BikeDetail'
import { ComponentDetail } from './components/ComponentDetail'
import { LogRideModal } from './components/LogRideModal'
import { AddMaintenanceModal } from './components/AddMaintenanceModal'
import { AddEditBikeModal } from './components/AddEditBikeModal'

type View =
  | { name: 'list' }
  | { name: 'bike'; bikeId: string }
  | { name: 'component'; componentId: string; bikeId: string }

export default function App() {
  const state = useAppState()
  const [view, setView] = useState<View>({ name: 'list' })
  const [showLogRide, setShowLogRide] = useState(false)
  const [showAddMaintenance, setShowAddMaintenance] = useState(false)
  const [showAddBike, setShowAddBike] = useState(false)

  const currentBike = view.name !== 'list' ? state.bikes.find((b) => b.id === view.bikeId) : undefined
  const currentComponent =
    view.name === 'component' ? state.components.find((c) => c.id === view.componentId) : undefined

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', padding: '32px 16px' }}>
      <div
        style={{
          width: '100%',
          maxWidth: 460,
          background: 'var(--page-bg)',
          borderRadius: 20,
          boxShadow: '0 6px 28px rgba(0,0,0,0.28)',
          padding: '8px 0 40px',
        }}
      >
      {view.name === 'list' && (
        <BikeList
          bikes={state.bikes}
          components={state.components}
          onSelectBike={(bikeId) => setView({ name: 'bike', bikeId })}
          onAddBike={() => setShowAddBike(true)}
        />
      )}

      {view.name === 'bike' && currentBike && (
        <BikeDetail
          bike={currentBike}
          components={state.components}
          rides={state.rides}
          onLogRide={() => setShowLogRide(true)}
          onAddMaintenance={() => setShowAddMaintenance(true)}
          onSelectComponent={(componentId) => setView({ name: 'component', componentId, bikeId: currentBike.id })}
          onBack={() => setView({ name: 'list' })}
        />
      )}

      {view.name === 'component' && currentComponent && currentBike && (
        <ComponentDetail
          component={currentComponent}
          maintenance={state.maintenance}
          onRetire={() => {
            state.retireComponent(currentComponent.id)
            setView({ name: 'bike', bikeId: currentBike.id })
          }}
          onBack={() => setView({ name: 'bike', bikeId: currentBike.id })}
        />
      )}

      {showLogRide && state.bikes.length > 0 && (
        <LogRideModal
          bikes={state.bikes}
          defaultBikeId={currentBike ? currentBike.id : state.bikes[0].id}
          onCancel={() => setShowLogRide(false)}
          onSave={(bikeId, date, distanceKm, notes) => {
            state.addRide({ bikeId, date, distanceKm, notes: notes || undefined })
            setShowLogRide(false)
          }}
        />
      )}

      {showAddMaintenance && currentBike && (
        <AddMaintenanceModal
          components={state.components.filter((c) => c.bikeId === currentBike.id && c.status === 'active')}
          onCancel={() => setShowAddMaintenance(false)}
          onSave={(date, componentId, description, notes, cost) => {
            state.addMaintenanceEntry({
              bikeId: currentBike.id,
              date,
              componentId,
              description,
              notes: notes || undefined,
              cost,
            })
            setShowAddMaintenance(false)
          }}
        />
      )}

      {showAddBike && (
        <AddEditBikeModal
          onCancel={() => setShowAddBike(false)}
          onSave={(make, model, nickname, purchaseDate, serialNumber, photoUrl) => {
            const bike = state.addBike({
              make,
              model,
              nickname: nickname || undefined,
              purchaseDate,
              serialNumber: serialNumber || undefined,
              photoUrl,
            })
            setShowAddBike(false)
            setView({ name: 'bike', bikeId: bike.id })
          }}
        />
      )}
      </div>
    </div>
  )
}
