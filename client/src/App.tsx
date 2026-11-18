import { useCallback, useState } from 'react'
import { MedicineForm } from './components/MedicineForm'
import { MedicineTable } from './components/MedicineTable'
import { SaleForm } from './components/SaleForm'
import { SalesTable } from './components/SalesTable'
import { SearchBar } from './components/SearchBar'
import { useDebouncedValue } from './hooks/useDebouncedValue'
import { useMedicines } from './hooks/useMedicines'
import { useSales } from './hooks/useSales'

type Tab = 'inventory' | 'sales'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('inventory')
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebouncedValue(searchInput, 300)
  const search = searchInput.trim() === '' ? '' : debouncedSearch

  const inventory = useMedicines(search)
  const saleOptions = useMedicines()
  const sales = useSales()

  const reloadInventory = inventory.reload
  const reloadSaleOptions = saleOptions.reload
  const reloadSales = sales.reload

  const handleMedicineCreated = useCallback(() => {
    reloadInventory()
    reloadSaleOptions()
  }, [reloadInventory, reloadSaleOptions])

  const handleSaleRecorded = useCallback(() => {
    reloadInventory()
    reloadSaleOptions()
    reloadSales()
  }, [reloadInventory, reloadSaleOptions, reloadSales])

  return (
    <>
      <header className="app-header">
        <div className="container">
          <h1>ABC Pharmacy</h1>
        </div>
      </header>

      <main className="container">
        <nav className="tabs">
          <button
            type="button"
            className="tab"
            aria-pressed={activeTab === 'inventory'}
            onClick={() => setActiveTab('inventory')}
          >
            Inventory
          </button>
          <button
            type="button"
            className="tab"
            aria-pressed={activeTab === 'sales'}
            onClick={() => setActiveTab('sales')}
          >
            Sales
          </button>
        </nav>

        {activeTab === 'inventory' && (
          <>
            <section aria-labelledby="inventory-heading">
              <h2 id="inventory-heading">Medicines</h2>

              <SearchBar value={searchInput} onChange={setSearchInput} />

              {inventory.error && (
                <p role="alert" className="alert alert-error">
                  {inventory.error}
                </p>
              )}

              {inventory.loading && inventory.medicines.length === 0 ? (
                <p className="loading">Loading medicines…</p>
              ) : (
                !inventory.error && <MedicineTable medicines={inventory.medicines} searchTerm={search} />
              )}
            </section>

            <section aria-labelledby="add-medicine-heading">
              <h2 id="add-medicine-heading">Add medicine</h2>
              <MedicineForm onCreated={handleMedicineCreated} />
            </section>
          </>
        )}

        {activeTab === 'sales' && (
          <>
            <section aria-labelledby="record-sale-heading">
              <h2 id="record-sale-heading">Record sale</h2>

              {saleOptions.error && (
                <p role="alert" className="alert alert-error">
                  {saleOptions.error}
                </p>
              )}

              <SaleForm
                medicines={saleOptions.medicines}
                loading={saleOptions.loading}
                onSold={handleSaleRecorded}
              />
            </section>

            <section aria-labelledby="sales-heading">
              <h2 id="sales-heading">Sales history</h2>

              {sales.error && (
                <p role="alert" className="alert alert-error">
                  {sales.error}
                </p>
              )}

              {sales.loading && sales.sales.length === 0 ? (
                <p className="loading">Loading sales…</p>
              ) : (
                !sales.error && <SalesTable sales={sales.sales} />
              )}
            </section>
          </>
        )}
      </main>
    </>
  )
}

export default App
