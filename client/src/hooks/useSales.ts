import { useCallback, useEffect, useState } from 'react'
import { getSales, type Sale } from '../api/salesApi'

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      setLoading(true)
      setError(null)
      try {
        setSales(await getSales(controller.signal))
      } catch (err) {
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err.message : 'Failed to load sales.')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    void load()
    return () => controller.abort()
  }, [reloadKey])

  const reload = useCallback(() => setReloadKey((key) => key + 1), [])

  return { sales, loading, error, reload }
}
