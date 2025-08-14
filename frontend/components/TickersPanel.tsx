'use client'
import { useEffect, useMemo, useState } from 'react'
import { API_BASE, WS_URL } from '../lib/env'
import { useSelectedSymbol } from '../lib/useSelectedSymbol'

type Last = Record<string, { price: number; prev?: number }>

export default function TickersPanel() {
  console.log('TickersPanel rendered');
  const [tickers, setTickers] = useState<string[]>([])
  const [last, setLast] = useState<Last>({})
  const { selected, setSelected } = useSelectedSymbol()

  useEffect(() => {
    fetch(`${API_BASE}/tickers`).then(r => r.json()).then(d => {
      setTickers(d.tickers)
      if (!selected && d.tickers?.[0]) setSelected(d.tickers[0])
    })
  }, [])

  useEffect(() => {
    const ws = new WebSocket(WS_URL)
    ws.onmessage = evt => {
      try {
        const d = JSON.parse(evt.data)
        if (d.type === 'price') {
          setLast(prev => {
            const prevPrice = prev[d.symbol]?.price
            return { ...prev, [d.symbol]: { price: d.price, prev: prevPrice } }
          })
        }
      } catch {}
    }
    return () => ws.close()
  }, [])

  return (
      <div className="rounded-2xl border bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Tickers</div>
        <div className="space-y-2">
          {tickers.map(t => {
            const p = last[t]?.price
            const prev = last[t]?.prev ?? p
            const up = p != null && prev != null && p >= prev
            return (
                <button
                    key={t}
                    onClick={() => setSelected(t)}
                    className={[
                      'w-full rounded-xl border px-3 py-2 text-left transition',
                      'hover:bg-gray-50 dark:hover:bg-gray-800',
                      selected === t ? 'border-blue-300 bg-blue-50 dark:border-blue-500/40 dark:bg-blue-500/10' : 'border-gray-200 dark:border-gray-800'
                    ].join(' ')}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium">{t}</span>
                    <span className={`tabular-nums font-semibold ${up ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {p != null ? p.toFixed(2) : '—'}
                </span>
                  </div>
                </button>
            )
          })}
        </div>
      </div>
  )
}
