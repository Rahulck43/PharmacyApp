import { useState } from 'react'
import { MedicineForm } from './components/MedicineForm'
import { MedicineTable } from './components/MedicineTable'
import { SearchBar } from './components/SearchBar'
import { useDebouncedValue } from './hooks/useDebouncedValue'
import { useMedicines } from './hooks/useMedicines'

function App() {
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebouncedValue(searchInput, 300)
  const search = searchInput.trim() === '' ? '' : debouncedSearch
  const { medicines, loading, error, reload } = useMedicines(search)

  return (
    <main>
      <h1>ABC Pharmacy</h1>

      <section aria-labelledby="add-medicine-heading">
        <h2 id="add-medicine-heading">Add medicine</h2>
        <MedicineForm onCreated={reload} />
      </section>

      <section aria-labelledby="inventory-heading">
        <h2 id="inventory-heading">Inventory</h2>

        <SearchBar value={searchInput} onChange={setSearchInput} />

        {error && (
          <p role="alert" className="alert alert-error">
            {error}
          </p>
        )}

        {loading && medicines.length === 0 ? (
          <p>Loading medicines…</p>
        ) : (
          !error && <MedicineTable medicines={medicines} searchTerm={search} />
        )}
      </section>
    </main>
  )
}

export default App
