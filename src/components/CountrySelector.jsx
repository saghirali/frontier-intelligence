import { useState } from "react"
import axios from "axios"

const G20_COUNTRIES = [
  { name: "Argentina", code: "ARG", flag: "ar", capital: "Buenos Aires", region: "South America" },
  { name: "Australia", code: "AUS", flag: "au", capital: "Canberra", region: "Oceania" },
  { name: "Brazil", code: "BRA", flag: "br", capital: "Brasília", region: "South America" },
  { name: "Canada", code: "CAN", flag: "ca", capital: "Ottawa", region: "North America" },
  { name: "China", code: "CHN", flag: "cn", capital: "Beijing", region: "Asia" },
  { name: "France", code: "FRA", flag: "fr", capital: "Paris", region: "Europe" },
  { name: "Germany", code: "DEU", flag: "de", capital: "Berlin", region: "Europe" },
  { name: "India", code: "IND", flag: "in", capital: "New Delhi", region: "Asia" },
  { name: "Indonesia", code: "IDN", flag: "id", capital: "Jakarta", region: "Asia" },
  { name: "Italy", code: "ITA", flag: "it", capital: "Rome", region: "Europe" },
  { name: "Japan", code: "JPN", flag: "jp", capital: "Tokyo", region: "Asia" },
  { name: "Mexico", code: "MEX", flag: "mx", capital: "Mexico City", region: "North America" },
  { name: "Russia", code: "RUS", flag: "ru", capital: "Moscow", region: "Europe" },
  { name: "Saudi Arabia", code: "SAU", flag: "sa", capital: "Riyadh", region: "Middle East" },
  { name: "South Africa", code: "ZAF", flag: "za", capital: "Pretoria", region: "Africa" },
  { name: "South Korea", code: "KOR", flag: "kr", capital: "Seoul", region: "Asia" },
  { name: "Turkey", code: "TUR", flag: "tr", capital: "Ankara", region: "Middle East" },
  { name: "United Kingdom", code: "GBR", flag: "gb", capital: "London", region: "Europe" },
  { name: "United States", code: "USA", flag: "us", capital: "Washington D.C.", region: "North America" },
  { name: "Pakistan", code: "PAK", flag: "pk", capital: "Islamabad", region: "Asia" },
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
        background: "#0f172a",
        color: "#f1f5f9",
        border: "1px solid #1e3a5f",
        padding: "8px 16px",
        borderRadius: "6px",
        fontSize: "12px",
        cursor: "pointer",
        width: "200px",
        fontWeight: "500",
        letterSpacing: "0.3px",
        outline: "none"
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