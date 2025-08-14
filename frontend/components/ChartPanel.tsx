'use client'
import { useEffect, useMemo, useState } from 'react'
import { API_BASE, WS_URL } from '../lib/env'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useSelectedSymbol } from '../lib/useSelectedSymbol'

type Pt = { ts: number, price: number }

export default function ChartPanel() {
  const { selected } = useSelectedSymbol()
  const [series, setSeries] = useState<Pt[]>([])
  const [current, setCurrent] = useState<number | null>(null)
  const [alert, setAlert] = useState<number | null>(null)

  useEffect(() => {
    if (!selected) return
    fetch(`${API_BASE}/historical/${selected}`).then(r => r.json()).then(d => setSeries(d.series || []))
  }, [selected])

  useEffect(() => {
    const ws = new WebSocket(WS_URL)
    ws.onmessage = evt => {
      try {
        const d = JSON.parse(evt.data)
        if (d.type === 'price' && d.symbol === selected) {
          setCurrent(d.price)
          setSeries(prev => [...prev.slice(-500), { ts: Date.now(), price: d.price }])
        }
      } catch {}
    }
    return () => ws.close()
  }, [selected])

  const display = useMemo(() => series.map(p => ({
    time: new Date(p.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    price: p.price
  })), [series])

  const alertHit = alert != null && current != null && current >= alert

  return (
      <div className="rounded-2xl border bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <h2 className="text-base font-semibold">{selected ?? '—'}</h2>
          {current != null && (
              <span className="rounded-md border px-2 py-0.5 text-sm tabular-nums dark:border-gray-700">
            Live: <strong>{current.toFixed(2)}</strong>
          </span>
          )}
          <button
              className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => {
                if (!current) return
                const x = prompt(`Set alert. Current: ${current}`)
                if (x) setAlert(Number(x))
              }}
          >
            Set Price Alert
          </button>
          {alert != null && (
              <span className="text-sm text-gray-600 dark:text-gray-400">Target: <strong className="tabular-nums">{alert}</strong></span>
          )}
          {alertHit && <span className="text-sm font-semibold text-rose-600">🔔 Target reached</span>}
        </div>

        <div className="h-[450px] rounded-xl border bg-white dark:border-gray-800 dark:bg-gray-950">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={display} margin={{ left: 12, right: 12, top: 16, bottom: 8 }}>
              <defs>
                <linearGradient id="fillPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopOpacity={0.8} />
                  <stop offset="95%" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" minTickGap={24} />
              <YAxis width={56} domain={['auto', 'auto']} />
              <Tooltip />
              <Area type="monotone" dataKey="price" strokeOpacity={1} fillOpacity={0.3} fill="url(#fillPrice)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
  )
}
