import { MedicineTable } from './components/MedicineTable'
import { useMedicines } from './hooks/useMedicines'

function App() {
  const { medicines, loading, error } = useMedicines()

  return (
    <main>
      <h1>ABC Pharmacy</h1>

      <section aria-labelledby="inventory-heading">
        <h2 id="inventory-heading">Inventory</h2>

        {error && (
          <p role="alert" className="alert alert-error">
            {error}
          </p>
        )}

        {loading && medicines.length === 0 ? (
          <p>Loading medicines…</p>
        ) : (
          !error && <MedicineTable medicines={medicines} />
        )}
      </section>
    </main>
  )
}

export default App
