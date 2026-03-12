import { useState, useEffect } from "react"
import CountrySelector from "./components/CountrySelector"
import IndicatorCards from "./components/IndicatorCards"
import AIChat from "./components/AIChat"
import HistoricalChart from "./components/HistoricalChart"
import CountryInfo from "./components/CountryInfo"
import RiskScore from "./components/RiskScore"
import CountryComparator from "./components/CountryComparator"

const TICKER_DATA = [
  { label: "🇺🇸 USA GDP", value: "$27.4T", change: "+2.5%" },
  { label: "🇨🇳 China Inflation", value: "0.3%", change: "-0.1%" },
  { label: "🇩🇪 Germany Unemployment", value: "3.0%", change: "+0.1%" },
  { label: "🇮🇳 India GDP Growth", value: "8.2%", change: "+1.2%" },
  { label: "🇬🇧 UK Debt/GDP", value: "101%", change: "+2.1%" },
  { label: "🇯🇵 Japan Inflation", value: "2.8%", change: "+0.3%" },
  { label: "🇧🇷 Brazil Unemployment", value: "7.8%", change: "-0.5%" },
  { label: "🇸🇦 Saudi GDP", value: "$1.06T", change: "+3.8%" },
  { label: "🇵🇰 Pakistan Inflation", value: "23.4%", change: "-1.2%" },
  { label: "🇰🇷 South Korea GDP", value: "$1.71T", change: "+2.1%" },
]

function Ticker() {
  const items = [...TICKER_DATA, ...TICKER_DATA]
  return (
    <div style={{
      background: "#060912",
      borderBottom: "1px solid #1e2a3a",
      padding: "8px 0",
      overflow: "hidden"
    }}>
      <div className="ticker-move" style={{ display: "flex", gap: "0" }}>
        {items.map((item, i) => (
          <div key={i} style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "0 32px",
            borderRight: "1px solid #1e2a3a",
            whiteSpace: "nowrap"
          }}>
            <span style={{ color: "#64748b", fontSize: "11px" }}>{item.label}</span>
            <span style={{ color: "#f1f5f9", fontSize: "11px", fontWeight: "600" }}>{item.value}</span>
            <span style={{
              fontSize: "10px",
              color: item.change.startsWith("+") ? "#22c55e" : "#ef4444",
              fontWeight: "600"
            }}>{item.change}</span>
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

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ minHeight: "100vh", background: "#0a0e1a", display: "flex", flexDirection: "column" }}>

      {/* TOP HEADER */}
      <div style={{
        background: "#060912",
        borderBottom: "1px solid #1e2a3a",
        padding: "0 24px",
        height: "52px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "28px", height: "28px",
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            borderRadius: "6px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "14px"
          }}>🌐</div>
          <div>
            <span style={{ fontSize: "14px", fontWeight: "700", color: "#f1f5f9", letterSpacing: "0.5px" }}>
              ORBIS
            </span>
            <span style={{ fontSize: "14px", fontWeight: "300", color: "#3b82f6", marginLeft: "6px" }}>
              Intelligence
            </span>
          </div>
          <div style={{
            marginLeft: "8px",
            background: "#0f2010",
            border: "1px solid #166534",
            borderRadius: "4px",
            padding: "2px 8px",
            display: "flex", alignItems: "center", gap: "4px"
          }}>
            <div style={{ width: "5px", height: "5px", background: "#22c55e", borderRadius: "50%", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: "9px", color: "#22c55e", fontWeight: "600", letterSpacing: "1px" }}>LIVE</span>
          </div>
        </div>

        {/* Center — time */}
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: "11px", color: "#64748b", letterSpacing: "1px" }}>ORBIS INTELLIGENCE · G20 ECONOMIC PLATFORM</span>
          <p style={{ fontSize: "11px", color: "#3b82f6", fontWeight: "600" }}>
            {time.toUTCString().slice(0, 25)}
          </p>
        </div>

        {/* Country Selector */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "11px", color: "#64748b" }}>SELECT ECONOMY</span>
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
      <div style={{ display: "flex", flex: 1 }}>

        {/* SIDEBAR */}
        <div style={{
          width: "180px",
          background: "#060912",
          borderRight: "1px solid #1e2a3a",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          paddingTop: "16px"
        }}>
          <p style={{ fontSize: "9px", color: "#334155", letterSpacing: "2px", padding: "0 16px", marginBottom: "8px" }}>
            MODULES
          </p>
         {NAV_ITEMS.map(item => {
            const isFeatured = item.id === "analyst" || item.id === "compare"
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  background: isActive
                    ? isFeatured
                      ? "linear-gradient(90deg, #ffffff18, #ffffff08)"
                      : "linear-gradient(90deg, #1e3a5f22, transparent)"
                    : "transparent",
                  color: isActive
                    ? isFeatured ? "#ffffff" : "#3b82f6"
                    : isFeatured ? "#94a3b8" : "#475569",
                  borderLeft: isActive
                    ? isFeatured ? "2px solid #ffffff" : "2px solid #3b82f6"
                    : isFeatured ? "2px solid #ffffff33" : "2px solid transparent",
                  border: "none",
                  borderLeft: isActive
                    ? isFeatured ? "2px solid #ffffff" : "2px solid #3b82f6"
                    : isFeatured ? "2px solid #ffffff22" : "2px solid transparent",
                  padding: "12px 16px",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: isFeatured ? "600" : "400",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  width: "100%",
                  transition: "all 0.2s",
                  boxShadow: isActive && isFeatured ? "0 0 12px #ffffff15" : "none",
                  marginBottom: item.id === "overview" ? "12px" : "2px",
                  borderTop: item.id === "analyst" ? "1px solid #1e2a3a" : "none",
                  paddingTop: item.id === "analyst" ? "16px" : "12px",
                  marginTop: item.id === "analyst" ? "8px" : "0",
                }}
              >
                <span style={{
                  fontSize: "14px",
                  filter: isFeatured && isActive ? "drop-shadow(0 0 4px #ffffff88)" : "none"
                }}>{item.icon}</span>
                <span>{item.label}</span>
                {isFeatured && (
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

          <div style={{ marginTop: "auto", padding: "16px", borderTop: "1px solid #1e2a3a" }}>
            <p style={{ fontSize: "9px", color: "#1e2a3a", letterSpacing: "1px", lineHeight: "1.6" }}>
              DATA SOURCES<br />
              World Bank · IMF<br />
              Groq AI · OECD
            </p>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div style={{ flex: 1, overflow: "auto", padding: "20px", background: "#0a0e1a" }}>

          {!selectedCountry ? (
            <div style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              height: "70vh", gap: "16px", textAlign: "center"
            }}>
              <div style={{
                width: "64px", height: "64px",
                background: "linear-gradient(135deg, #1e3a5f, #0f2040)",
                borderRadius: "16px",
                border: "1px solid #1e3a5f",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "28px"
              }}>🌐</div>
              <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#f1f5f9" }}>
                G20 Economic Intelligence
              </h2>
              <p style={{ color: "#475569", fontSize: "14px", maxWidth: "360px", lineHeight: "1.7" }}>
                Select a country from the top bar to access real-time economic data, AI risk analysis, historical charts, and cross-country comparisons.
              </p>
              <div style={{
                display: "flex", gap: "12px", marginTop: "8px", flexWrap: "wrap", justifyContent: "center"
              }}>
                {["Real-time Data", "AI Risk Scoring", "Historical Charts", "Country Comparison", "AI Analyst"].map(f => (
                  <span key={f} style={{
                    background: "#0f172a",
                    border: "1px solid #1e2a3a",
                    borderRadius: "20px",
                    padding: "6px 14px",
                    fontSize: "11px",
                    color: "#64748b"
                  }}>{f}</span>
                ))}
              </div>
            </div>
          ) : countryData && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

              {/* Country Header */}
              <CountryInfo country={selectedCountry} />

              {/* Indicator Cards */}
              <IndicatorCards data={countryData} />

              {/* Tab Content */}
              {activeTab === "overview" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
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