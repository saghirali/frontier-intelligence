import { useState, useEffect } from "react"
import axios from "axios"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"

const INDICATORS = [
  { label: "GDP", code: "NY.GDP.MKTP.CD", color: "#3b82f6", format: (v) => `$${(v / 1e12).toFixed(2)}T` },
  { label: "Inflation", code: "FP.CPI.TOTL.ZG", color: "#f97316", format: (v) => `${v.toFixed(1)}%` },
  { label: "Unemployment", code: "SL.UEM.TOTL.ZS", color: "#22c55e", format: (v) => `${v.toFixed(1)}%` },
  { label: "Debt/GDP", code: "GC.DOD.TOTL.GD.ZS", color: "#a855f7", format: (v) => `${v.toFixed(1)}%` },
]

export default function HistoricalChart({ country }) {
  const [selectedIndicator, setSelectedIndicator] = useState(INDICATORS[0])
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchHistory = async (indicator) => {
    setLoading(true)
    setChartData([])
    try {
      const res = await axios.get(
        `https://api.worldbank.org/v2/country/${country.code}/indicator/${indicator.code}?format=json&mrv=10`
      )
      const raw = res.data[1] || []
      const formatted = raw
        .filter(d => d.value !== null)
        .map(d => ({ year: d.date, value: parseFloat(d.value.toFixed(2)) }))
        .reverse()
      setChartData(formatted)
    } catch {
      setChartData([])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchHistory(selectedIndicator)
  }, [country])

  const handleIndicatorChange = (indicator) => {
    setSelectedIndicator(indicator)
    fetchHistory(indicator)
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: "#060912",
          border: "1px solid #1e2a3a",
          borderRadius: "8px",
          padding: "10px 14px"
        }}>
          <p style={{ color: "#64748b", fontSize: "11px", marginBottom: "4px" }}>{label}</p>
          <p style={{ color: selectedIndicator.color, fontSize: "14px", fontWeight: "700" }}>
            {selectedIndicator.format(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div style={{
      background: "#060912",
      border: "1px solid #1e2a3a",
      borderRadius: "12px",
      padding: "20px",
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <p style={{ fontSize: "11px", color: "#64748b", letterSpacing: "1px", marginBottom: "2px" }}>HISTORICAL DATA</p>
          <p style={{ fontSize: "14px", fontWeight: "600", color: "#f1f5f9" }}>{country.name} · {selectedIndicator.label}</p>
        </div>
        {/* Indicator Tabs */}
        <div style={{ display: "flex", gap: "4px", background: "#0a0e1a", borderRadius: "8px", padding: "4px" }}>
          {INDICATORS.map(ind => (
            <button
              key={ind.code}
              onClick={() => handleIndicatorChange(ind)}
              style={{
                background: selectedIndicator.code === ind.code ? "#1e2a3a" : "transparent",
                color: selectedIndicator.code === ind.code ? ind.color : "#94a3b8",
                border: "none",
                borderRadius: "6px",
                padding: "5px 10px",
                cursor: "pointer",
                fontSize: "11px",
                fontWeight: selectedIndicator.code === ind.code ? "600" : "400",
                transition: "all 0.2s"
              }}
            >
              {ind.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      {loading ? (
        <div style={{ height: "220px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "#475569", fontSize: "12px" }}>Loading data...</p>
        </div>
      ) : chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={selectedIndicator.color} stopOpacity={0.15} />
                <stop offset="95%" stopColor={selectedIndicator.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2a3a" vertical={false} />
            <XAxis dataKey="year" stroke="#64748b" fontSize={10} tickLine={false} tick={{ fill: "#94a3b8" }} />
<YAxis stroke="#64748b" fontSize={10} tickLine={false} tickFormatter={selectedIndicator.format} width={60} tick={{ fill: "#94a3b8" }} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={selectedIndicator.color}
              strokeWidth={2}
              fill="url(#colorGrad)"
              dot={false}
              activeDot={{ r: 4, fill: selectedIndicator.color }}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div style={{ height: "220px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "#475569", fontSize: "12px" }}>No data available</p>
        </div>
      )}
    </div>
  )
}