import { useCallback, useEffect, useState } from 'react'
import { getMedicines, type Medicine } from '../api/medicinesApi'

export function useMedicines(search = '') {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      setLoading(true)
      setError(null)
      try {
        setMedicines(await getMedicines(search, controller.signal))
      } catch (err) {
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err.message : 'Failed to load medicines.')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    void load()
    return () => controller.abort()
  }, [search, reloadKey])

  const reload = useCallback(() => setReloadKey((key) => key + 1), [])

  return { medicines, loading, error, reload }
}
