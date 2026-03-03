import { useState } from "react"
import CountrySelector from "./components/CountrySelector"
import IndicatorCards from "./components/IndicatorCards"
import AIChat from "./components/AIChat"

function App() {
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [countryData, setCountryData] = useState(null)

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px", color: "#fff" }}>
        🌐 Frontier Intelligence
      </h1>
      <p style={{ color: "#888", marginBottom: "32px" }}>
        AI-powered economic intelligence across G20 economies
      </p>

      <CountrySelector
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        setCountryData={setCountryData}
      />

      {countryData && (
        <>
          <IndicatorCards data={countryData} />
          <AIChat country={selectedCountry} data={countryData} />
        </>
      )}
    </div>
  )
}

export default App