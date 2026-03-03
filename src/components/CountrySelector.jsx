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

const fetchIndicator = async (countryCode, indicator) => {
  try {
    const res = await axios.get(
      `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicator}?format=json&mrv=1`
    )
    return res.data[1]?.[0]?.value ?? null
  } catch {
    return null
  }
}

export default function CountrySelector({ selectedCountry, setSelectedCountry, setCountryData }) {
  const [loading, setLoading] = useState(false)

  const handleSelect = async (e) => {
    const country = G20_COUNTRIES.find(c => c.code === e.target.value)
    if (!country) return
    setSelectedCountry(country)
    setLoading(true)
    setCountryData(null)

    const [gdp, inflation, unemployment, debt] = await Promise.all([
      fetchIndicator(country.code, "NY.GDP.MKTP.CD"),
      fetchIndicator(country.code, "FP.CPI.TOTL.ZG"),
      fetchIndicator(country.code, "SL.UEM.TOTL.ZS"),
      fetchIndicator(country.code, "GC.DOD.TOTL.GD.ZS"),
    ])

    setCountryData({ gdp, inflation, unemployment, debt })
    setLoading(false)
  }

  return (
    <div style={{ marginBottom: "32px" }}>
      <select
        onChange={handleSelect}
        defaultValue=""
        style={{
          background: "#1a1a2e",
          color: "#fff",
          border: "1px solid #333",
          padding: "12px 20px",
          borderRadius: "8px",
          fontSize: "16px",
          cursor: "pointer",
          width: "280px"
        }}
      >
        <option value="" disabled>Select a country...</option>
        {G20_COUNTRIES.map(c => (
          <option key={c.code} value={c.code}>{c.name}</option>
        ))}
      </select>
      {loading && <p style={{ marginTop: "12px", color: "#888" }}>Fetching data...</p>}
    </div>
  )
}