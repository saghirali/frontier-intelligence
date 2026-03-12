import { useState } from "react"

export default function RiskScore({ country, data }) {
  const [risk, setRisk] = useState(null)
  const [loading, setLoading] = useState(false)

  const calculateRisk = async () => {
    setLoading(true)
    setRisk(null)

    const prompt = `You are an expert economic risk analyst. Based on this data for ${country.name}:
- GDP: ${data.gdp ? `$${(data.gdp / 1e12).toFixed(2)} Trillion` : "N/A"}
- Inflation: ${data.inflation ? `${data.inflation.toFixed(1)}%` : "N/A"}
- Unemployment: ${data.unemployment ? `${data.unemployment.toFixed(1)}%` : "N/A"}
- Debt to GDP: ${data.debt ? `${data.debt.toFixed(1)}%` : "N/A"}

Respond in this exact JSON format only, no extra text:
{
  "score": <number between 0-100, where 0 is no risk and 100 is extreme risk>,
  "level": "<Low|Medium|High|Critical>",
  "summary": "<one sentence explanation>",
  "factors": ["<risk factor 1>", "<risk factor 2>", "<risk factor 3>"]
}`

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 300
        })
      })
    
     const result = await res.json()
     console.log("FULL RESULT:", JSON.stringify(result))     
     const text = result?.choices?.[0]?.message?.content
      console.log("RAW RESPONSE:", text)
      const cleaned = text.replace(/```json|```/g, "").trim()
      const parsed = JSON.parse(cleaned)
      setRisk(parsed)
    } catch {
      setRisk({ score: 0, level: "Error", summary: "Could not calculate risk.", factors: [] })
    }
    setLoading(false)
  }

  const getColor = (level) => {
    if (level === "Low") return "#4ade80"
    if (level === "Medium") return "#facc15"
    if (level === "High") return "#f97316"
    if (level === "Critical") return "#ef4444"
    return "#888"
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
        📊 AI Risk Assessment
      </h2>

      {!risk && !loading && (
        <button
          onClick={calculateRisk}
          style={{
            background: "#f97316",
            color: "#000",
            border: "none",
            borderRadius: "8px",
            padding: "12px 24px",
            fontWeight: "700",
            cursor: "pointer"
          }}
        >
          Calculate Risk Score
        </button>
      )}

      {loading && <p style={{ color: "#888" }}>Analyzing economic risk...</p>}

      {risk && risk.level !== "Error" && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "16px" }}>
            <div style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: `${getColor(risk.level)}22`,
              border: `3px solid ${getColor(risk.level)}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: "700",
              color: getColor(risk.level)
            }}>
              {risk.score}
            </div>
            <div>
              <p style={{ fontSize: "20px", fontWeight: "700", color: getColor(risk.level) }}>
                {risk.level} Risk
              </p>
              <p style={{ color: "#888", fontSize: "14px" }}>{risk.summary}</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {risk.factors.map((factor, i) => (
              <div key={i} style={{
                background: "#0a0a0f",
                borderRadius: "6px",
                padding: "10px 14px",
                color: "#ccc",
                fontSize: "14px",
                borderLeft: `3px solid ${getColor(risk.level)}`
              }}>
                ⚠️ {factor}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}