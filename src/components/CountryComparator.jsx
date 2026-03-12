import { useState } from "react"
import axios from "axios"

const G20_COUNTRIES = [
  { name: "Argentina", code: "ARG" },
  { name: "Australia", code: "AUS" },
  { name: "Brazil", code: "BRA" },
  { name: "Canada", code: "CAN" },
  { name: "China", code: "CHN" },
  { name: "France", code: "FRA" },
  { name: "Germany", code: "DEU" },
  { name: "India", code: "IND" },
  { name: "Indonesia", code: "IDN" },
  { name: "Italy", code: "ITA" },
  { name: "Japan", code: "JPN" },
  { name: "Mexico", code: "MEX" },
  { name: "Russia", code: "RUS" },
  { name: "Saudi Arabia", code: "SAU" },
  { name: "South Africa", code: "ZAF" },
  { name: "South Korea", code: "KOR" },
  { name: "Turkey", code: "TUR" },
  { name: "United Kingdom", code: "GBR" },
  { name: "United States", code: "USA" },
  { name: "Pakistan", code: "PAK" },
]

const fetchData = async (code) => {
  const fetchOne = async (indicator) => {
    try {
      const res = await axios.get(
        `https://api.worldbank.org/v2/country/${code}/indicator/${indicator}?format=json&mrv=1`
      )
      return res.data[1]?.[0]?.value ?? null
    } catch { return null }
  }
  const [gdp, inflation, unemployment, debt] = await Promise.all([
    fetchOne("NY.GDP.MKTP.CD"),
    fetchOne("FP.CPI.TOTL.ZG"),
    fetchOne("SL.UEM.TOTL.ZS"),
    fetchOne("GC.DOD.TOTL.GD.ZS"),
  ])
  return { gdp, inflation, unemployment, debt }
}

const formatGDP = (v) => v ? `$${(v / 1e12).toFixed(2)}T` : "N/A"
const formatPct = (v) => v ? `${v.toFixed(1)}%` : "N/A"

const Row = ({ label, v1, v2, format, higherIsBetter }) => {
  const better = higherIsBetter ? v1 > v2 : v1 < v2
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
      <div style={{ flex: 1, textAlign: "right", paddingRight: "12px" }}>
        <span style={{
          color: v1 && v2 ? (better ? "#4ade80" : "#f97316") : "#fff",
          fontWeight: "700", fontSize: "16px"
        }}>{format(v1)}</span>
      </div>
      <div style={{ width: "140px", textAlign: "center", color: "#888", fontSize: "13px" }}>{label}</div>
      <div style={{ flex: 1, paddingLeft: "12px" }}>
        <span style={{
          color: v1 && v2 ? (!better ? "#4ade80" : "#f97316") : "#fff",
          fontWeight: "700", fontSize: "16px"
        }}>{format(v2)}</span>
      </div>
    </div>
  )
}

export default function CountryComparator() {
  const [country1, setCountry1] = useState(null)
  const [country2, setCountry2] = useState(null)
  const [data1, setData1] = useState(null)
  const [data2, setData2] = useState(null)
  const [loading, setLoading] = useState(false)

  const compare = async () => {
    if (!country1 || !country2) return
    setLoading(true)
    const [d1, d2] = await Promise.all([fetchData(country1), fetchData(country2)])
    setData1(d1)
    setData2(d2)
    setLoading(false)
  }

  const selectStyle = {
    background: "#0a0a0f",
    color: "#fff",
    border: "1px solid #333",
    padding: "10px 16px",
    borderRadius: "8px",
    fontSize: "14px",
    cursor: "pointer",
    flex: 1
  }

  return (
    <div style={{
      background: "#1a1a2e",
      border: "1px solid #333",
      borderRadius: "12px",
      padding: "24px",
      marginBottom: "32px"
    }}>
      <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "#fff" }}>
        🔄 Compare Countries
      </h2>

      <div style={{ display: "flex", gap: "12px", marginBottom: "16px", alignItems: "center" }}>
        <select onChange={e => setCountry1(e.target.value)} defaultValue="" style={selectStyle}>
          <option value="" disabled>Country 1</option>
          {G20_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
        </select>

        <span style={{ color: "#888", fontWeight: "700" }}>VS</span>

        <select onChange={e => setCountry2(e.target.value)} defaultValue="" style={selectStyle}>
          <option value="" disabled>Country 2</option>
          {G20_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
        </select>

        <button
          onClick={compare}
          disabled={!country1 || !country2 || loading}
          style={{
            background: "#60a5fa",
            color: "#000",
            border: "none",
            borderRadius: "8px",
            padding: "10px 20px",
            fontWeight: "700",
            cursor: "pointer",
            opacity: (!country1 || !country2) ? 0.5 : 1
          }}
        >
          {loading ? "..." : "Compare"}
        </button>
      </div>

      {data1 && data2 && (
        <div style={{ marginTop: "20px" }}>
          <div style={{ display: "flex", marginBottom: "16px" }}>
            <div style={{ flex: 1, textAlign: "right", paddingRight: "12px", color: "#60a5fa", fontWeight: "700" }}>
              {G20_COUNTRIES.find(c => c.code === country1)?.name}
            </div>
            <div style={{ width: "140px" }}></div>
            <div style={{ flex: 1, paddingLeft: "12px", color: "#c084fc", fontWeight: "700" }}>
              {G20_COUNTRIES.find(c => c.code === country2)?.name}
            </div>
          </div>
          <Row label="GDP" v1={data1.gdp} v2={data2.gdp} format={formatGDP} higherIsBetter={true} />
          <Row label="Inflation" v1={data1.inflation} v2={data2.inflation} format={formatPct} higherIsBetter={false} />
          <Row label="Unemployment" v1={data1.unemployment} v2={data2.unemployment} format={formatPct} higherIsBetter={false} />
          <Row label="Debt to GDP" v1={data1.debt} v2={data2.debt} format={formatPct} higherIsBetter={false} />
          <p style={{ color: "#555", fontSize: "12px", marginTop: "12px" }}>
            🟢 Green = better performing &nbsp; 🟠 Orange = worse performing
          </p>
        </div>
      )}
    </div>
  )
}