import { useState, useEffect } from 'react'

// type ApiState<T> = {
//   data: T | null
//   loading: boolean
//   error: Error | null
// }

export function useApi<T = unknown>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then((data: T) => {
        setData(data)
        setLoading(false)
      })
      .catch((err: Error) => {
        setError(err)
        setLoading(false)
      })
  }, [url])

  return { data, loading, error }
}