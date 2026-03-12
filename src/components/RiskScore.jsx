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
  "score": <number between 0-100>,
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
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 300
        })
      })
      const result = await res.json()
      const text = result?.choices?.[0]?.message?.content
      const cleaned = text.replace(/```json|```/g, "").trim()
      const parsed = JSON.parse(cleaned)
      setRisk(parsed)
    } catch {
      setRisk({ score: 0, level: "Error", summary: "Could not calculate risk.", factors: [] })
    }
    setLoading(false)
  }

  const getColor = (level) => {
    if (level === "Low") return "#22c55e"
    if (level === "Medium") return "#facc15"
    if (level === "High") return "#f97316"
    if (level === "Critical") return "#ef4444"
    return "#475569"
  }

  const getScore = (score) => {
    const pct = Math.min(100, Math.max(0, score))
    return pct
  }

  return (
    <div style={{
      background: "#060912",
      border: "1px solid #1e2a3a",
      borderRadius: "12px",
      padding: "20px",
    }}>
      {/* Header */}
      <div style={{ marginBottom: "16px" }}>
        <p style={{ fontSize: "9px", color: "#64748b", letterSpacing: "1px", marginBottom: "2px" }}>AI RISK ASSESSMENT</p>
        <p style={{ fontSize: "14px", fontWeight: "600", color: "#f1f5f9" }}>{country.name} · Economic Risk</p>
      </div>

      {!risk && !loading && (
        <button
          onClick={calculateRisk}
          style={{
            width: "100%",
            background: "linear-gradient(135deg, #1e3a5f, #1d4ed8)",
            color: "#fff",
            border: "1px solid #3b82f6",
            borderRadius: "8px",
            padding: "12px",
            fontWeight: "600",
            cursor: "pointer",
            fontSize: "13px",
            letterSpacing: "0.5px"
          }}
        >
          ◈ Calculate Risk Score
        </button>
      )}

      {loading && (
        <div style={{ textAlign: "center", padding: "24px 0" }}>
          <p style={{ color: "#475569", fontSize: "12px", letterSpacing: "1px" }}>ANALYZING ECONOMIC DATA...</p>
        </div>
      )}

      {risk && risk.level !== "Error" && (
        <div>
          {/* Score Circle + Level */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
            <div style={{
              width: "72px", height: "72px", flexShrink: 0,
              borderRadius: "50%",
              background: `conic-gradient(${getColor(risk.level)} ${getScore(risk.score) * 3.6}deg, #1e2a3a 0deg)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative"
            }}>
              <div style={{
                width: "54px", height: "54px", borderRadius: "50%",
                background: "#060912",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexDirection: "column"
              }}>
                <span style={{ color: getColor(risk.level), fontSize: "16px", fontWeight: "800" }}>{risk.score}</span>
                <span style={{ color: "#334155", fontSize: "8px" }}>/ 100</span>
              </div>
            </div>
            <div>
              <p style={{ color: getColor(risk.level), fontSize: "18px", fontWeight: "700" }}>
                {risk.level} Risk
              </p>
              <p style={{ color: "#e2e8f0", fontSize: "11px", lineHeight: "1.5", marginTop: "2px" }}>
                {risk.summary}
              </p>
            </div>
          </div>

          {/* Risk Factors */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <p style={{ fontSize: "9px", color: "#334155", letterSpacing: "1px", marginBottom: "4px" }}>RISK FACTORS</p>
            {risk.factors.map((factor, i) => (
              <div key={i} style={{
                background: "#0a0e1a",
                borderRadius: "6px",
                padding: "8px 12px",
                color: "#94a3b8",
                fontSize: "12px",
                borderLeft: `2px solid ${getColor(risk.level)}`,
                display: "flex", alignItems: "center", gap: "8px"
              }}>
                <span style={{ color: getColor(risk.level), fontSize: "10px" }}>▸</span>
                {factor}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}