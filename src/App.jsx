import { useState, useEffect } from "react"
import CountrySelector from "./components/CountrySelector"
import IndicatorCards from "./components/IndicatorCards"
import AIChat from "./components/AIChat"
import HistoricalChart from "./components/HistoricalChart"
import CountryInfo from "./components/CountryInfo"
import RiskScore from "./components/RiskScore"
import CountryComparator from "./components/CountryComparator"

function Ticker() {
  const [items, setItems] = useState([])

  useEffect(() => {
    const G20 = [
      { code: "US", wbCode: "USA", flag: "🇺🇸", name: "USA" },
      { code: "CN", wbCode: "CHN", flag: "🇨🇳", name: "China" },
      { code: "DE", wbCode: "DEU", flag: "🇩🇪", name: "Germany" },
      { code: "IN", wbCode: "IND", flag: "🇮🇳", name: "India" },
      { code: "GB", wbCode: "GBR", flag: "🇬🇧", name: "UK" },
      { code: "JP", wbCode: "JPN", flag: "🇯🇵", name: "Japan" },
      { code: "BR", wbCode: "BRA", flag: "🇧🇷", name: "Brazil" },
      { code: "SA", wbCode: "SAU", flag: "🇸🇦", name: "Saudi" },
      { code: "PK", wbCode: "PAK", flag: "🇵🇰", name: "Pakistan" },
      { code: "KR", wbCode: "KOR", flag: "🇰🇷", name: "S.Korea" },
    ]

    const fetchTicker = async () => {
      const results = await Promise.all(
        G20.map(async (c) => {
          try {
            const [gdpRes, inflRes] = await Promise.all([
              fetch(`https://api.worldbank.org/v2/country/${c.wbCode}/indicator/NY.GDP.MKTP.CD?format=json&mrv=1`),
              fetch(`https://api.worldbank.org/v2/country/${c.wbCode}/indicator/FP.CPI.TOTL.ZG?format=json&mrv=1`)
            ])
            const gdpData = await gdpRes.json()
            const inflData = await inflRes.json()
            const gdp = gdpData[1]?.[0]?.value
            const infl = inflData[1]?.[0]?.value
           return [
              gdp ? { flagCode: c.code.toLowerCase(), name: c.name, type: "GDP", value: `$${(gdp / 1e12).toFixed(2)}T`, positive: true } : null,
              infl ? { flagCode: c.code.toLowerCase(), name: c.name, type: "Inflation", value: `${infl.toFixed(1)}%`, positive: infl < 3 } : null,
            ]
          } catch { return [null] }
        })
      )
      const flat = results.flat().filter(Boolean)
      setItems([...flat, ...flat])
    }

    fetchTicker()
  }, [])

  if (items.length === 0) return (
    <div style={{ background: "#060912", borderBottom: "1px solid #1e2a3a", padding: "8px 24px" }}>
      <span style={{ color: "#334155", fontSize: "11px", letterSpacing: "1px" }}>LOADING LIVE DATA...</span>
    </div>
  )

  return (
    <div style={{ background: "#060912", borderBottom: "1px solid #1e2a3a", padding: "8px 0", overflow: "hidden" }}>
      <div className="ticker-move" style={{ display: "flex" }}>
        {items.map((item, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "0 32px", borderRight: "1px solid #1e2a3a", whiteSpace: "nowrap"
          }}>
            <img
  src={`https://flagcdn.com/w20/${item.flagCode}.png`}
  style={{ width: "16px", height: "11px", borderRadius: "2px", objectFit: "cover" }}
/>
<span style={{ color: "#94a3b8", fontSize: "11px" }}>{item.name} {item.type}</span>
            <span style={{
              color: item.positive ? "#22c55e" : "#ef4444",
              fontSize: "11px", fontWeight: "600"
            }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: "⊞" },
  { id: "charts", label: "Charts", icon: "↗" },
  { id: "risk", label: "Risk", icon: "◈" },
  { id: "compare", label: "Compare", icon: "⇌" },
  { id: "analyst", label: "AI Analyst", icon: "◎" },
]

export default function App() {
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [countryData, setCountryData] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [time, setTime] = useState(new Date())
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const Sidebar = () => (
    <div style={{
      width: isMobile ? "100%" : "180px",
      background: "#060912",
      borderRight: isMobile ? "none" : "1px solid #1e2a3a",
      borderBottom: isMobile ? "1px solid #1e2a3a" : "none",
      display: "flex",
      flexDirection: isMobile ? "row" : "column",
      flexShrink: 0,
      paddingTop: isMobile ? "0" : "16px",
      overflowX: isMobile ? "auto" : "visible",
      flexWrap: isMobile ? "nowrap" : "wrap",
    }}>
      {!isMobile && (
        <p style={{ fontSize: "9px", color: "#334155", letterSpacing: "2px", padding: "0 16px", marginBottom: "8px" }}>
          MODULES
        </p>
      )}
      {NAV_ITEMS.map(item => {
        const isFeatured = item.id === "analyst" || item.id === "compare"
        const isActive = activeTab === item.id
        return (
          <button
            key={item.id}
            onClick={() => { setActiveTab(item.id); setMenuOpen(false) }}
            style={{
              background: isActive
                ? isFeatured ? "linear-gradient(90deg, #ffffff18, #ffffff08)" : "linear-gradient(90deg, #1e3a5f22, transparent)"
                : "transparent",
             color: isActive ? (isFeatured ? "#ffffff" : "#ffffff") : (isFeatured ? "#94a3b8" : "#94a3b8"),
              borderLeft: isMobile ? "none" : (isActive ? (isFeatured ? "2px solid #ffffff" : "2px solid #3b82f6") : (isFeatured ? "2px solid #ffffff22" : "2px solid transparent")),
              borderBottom: isMobile ? (isActive ? "2px solid #3b82f6" : "2px solid transparent") : "none",
              border: "none",
              borderLeft: isMobile ? "none" : (isActive ? (isFeatured ? "2px solid #ffffff" : "2px solid #3b82f6") : (isFeatured ? "2px solid #ffffff22" : "2px solid transparent")),
              borderBottom: isMobile ? (isActive ? (isFeatured ? "2px solid #ffffff" : "2px solid #3b82f6") : "2px solid transparent") : "none",
              padding: "12px 20px",
              minHeight: "44px",
              cursor: "pointer",
              textAlign: "left",
              fontSize: "12px",
              fontWeight: isFeatured ? "600" : "400",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              whiteSpace: "nowrap",
              flexShrink: 0,
              transition: "all 0.2s",
              boxShadow: isActive && isFeatured ? "0 0 12px #ffffff15" : "none",
              marginTop: !isMobile && item.id === "analyst" ? "8px" : "0",
              borderTop: !isMobile && item.id === "analyst" ? "1px solid #1e2a3a" : "none",
              paddingTop: !isMobile && item.id === "analyst" ? "16px" : "12px",
            }}
          >
            <span style={{ fontSize: "14px", filter: isFeatured && isActive ? "drop-shadow(0 0 4px #ffffff88)" : "none" }}>
              {item.icon}
            </span>
            {item.label}
            {isFeatured && !isMobile && (
              <span style={{
                marginLeft: "auto",
                background: isActive ? "#ffffff22" : "#ffffff11",
                color: "#94a3b8",
                fontSize: "8px",
                padding: "2px 6px",
                borderRadius: "4px",
                letterSpacing: "0.5px",
                fontWeight: "700"
              }}>AI</span>
            )}
          </button>
        )
      })}
    </div>
  )

  return (
    <div style={{ minHeight: "100vh", background: "#0a0e1a", display: "flex", flexDirection: "column" }}>

      {/* TOP HEADER */}
      <div style={{
        background: "#060912",
        borderBottom: "1px solid #1e2a3a",
        padding: isMobile ? "0 12px" : "0 24px",
        height: isMobile ? "auto" : "52px",
        minHeight: "52px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
        flexWrap: isMobile ? "wrap" : "nowrap",
        gap: isMobile ? "8px" : "0",
        paddingTop: isMobile ? "10px" : "0",
        paddingBottom: isMobile ? "10px" : "0",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "28px", height: "28px",
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            borderRadius: "6px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "14px", flexShrink: 0
          }}>🌐</div>
          <div>
            <span style={{ fontSize: "14px", fontWeight: "700", color: "#f1f5f9", letterSpacing: "0.5px" }}>QVANT</span>
            <span style={{ fontSize: "14px", fontWeight: "300", color: "#3b82f6", marginLeft: "6px" }}>Intelligence</span>
          </div>
          <div style={{
            background: "#0f2010", border: "1px solid #166534",
            borderRadius: "4px", padding: "2px 8px",
            display: "flex", alignItems: "center", gap: "4px"
          }}>
            <div style={{ width: "5px", height: "5px", background: "#22c55e", borderRadius: "50%" }} />
            <span style={{ fontSize: "9px", color: "#22c55e", fontWeight: "600", letterSpacing: "1px" }}>LIVE</span>
          </div>
        </div>

        {/* Center time - hidden on mobile */}
        {!isMobile && (
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "11px", color: "#64748b", letterSpacing: "1px" }}>QVANT INTELLIGENCE · G20 ECONOMIC PLATFORM</p>
            <p style={{ fontSize: "11px", color: "#3b82f6", fontWeight: "600" }}>{time.toUTCString().slice(0, 25)}</p>
          </div>
        )}

        {/* Country Selector */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {!isMobile && <span style={{ fontSize: "11px", color: "#64748b" }}>SELECT ECONOMY</span>}
          <CountrySelector
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            setCountryData={setCountryData}
          />
        </div>
      </div>

      {/* TICKER */}
      <Ticker />

      {/* BODY */}
      <div style={{ display: "flex", flex: 1, flexDirection: isMobile ? "column" : "row" }}>

        {/* SIDEBAR */}
        <Sidebar />

        {/* MAIN CONTENT */}
        <div style={{ flex: 1, overflow: "auto", padding: isMobile ? "12px" : "20px", background: "#0a0e1a" }}>

          {!selectedCountry ? (
            <div style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              height: "70vh", gap: "16px", textAlign: "center", padding: "20px"
            }}>
              <div style={{
                width: "64px", height: "64px",
                background: "linear-gradient(135deg, #1e3a5f, #0f2040)",
                borderRadius: "16px", border: "1px solid #1e3a5f",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px"
              }}>🌐</div>
              <h2 style={{ fontSize: isMobile ? "18px" : "22px", fontWeight: "700", color: "#f1f5f9" }}>
                QVANT Intelligence
              </h2>
              <p style={{ color: "#475569", fontSize: "13px", maxWidth: "360px", lineHeight: "1.7" }}>
                Select a country from the top bar to access real-time economic data, AI risk analysis, historical charts, and cross-country comparisons.
              </p>
              <div style={{ display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap", justifyContent: "center" }}>
                {["Real-time Data", "AI Risk Scoring", "Historical Charts", "Country Comparison", "AI Analyst"].map(f => (
                  <span key={f} style={{
                    background: "#0f172a", border: "1px solid #1e2a3a",
                    borderRadius: "20px", padding: "6px 14px",
                    fontSize: "11px", color: "#64748b"
                  }}>{f}</span>
                ))}
              </div>
            </div>
          ) : countryData && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <CountryInfo country={selectedCountry} />
              <IndicatorCards data={countryData} />

              {activeTab === "overview" && (
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "12px" }}>
                  <HistoricalChart country={selectedCountry} />
                  <RiskScore country={selectedCountry} data={countryData} />
                </div>
              )}
              {activeTab === "charts" && <HistoricalChart country={selectedCountry} />}
              {activeTab === "risk" && <RiskScore country={selectedCountry} data={countryData} />}
              {activeTab === "compare" && <CountryComparator />}
              {activeTab === "analyst" && <AIChat country={selectedCountry} data={countryData} />}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}