import { useState } from "react"

const SUGGESTED = [
  "What is the economic outlook?",
  "Is inflation under control?",
  "How is unemployment trending?",
  "Is this a good time to invest?",
]

export default function AIChat({ country, data }) {
  const [question, setQuestion] = useState("")
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const askAI = async (q) => {
    const query = q || question
    if (!query.trim()) return
    setLoading(true)
    setMessages(prev => [...prev, { role: "user", text: query }])
    setQuestion("")

    const prompt = `You are an expert economic analyst for QVANT Intelligence. Here is the latest economic data for ${country.name}:
- GDP: ${data.gdp ? `$${(data.gdp / 1e12).toFixed(2)} Trillion` : "N/A"}
- Inflation: ${data.inflation ? `${data.inflation.toFixed(1)}%` : "N/A"}
- Unemployment: ${data.unemployment ? `${data.unemployment.toFixed(1)}%` : "N/A"}
- Debt to GDP: ${data.debt ? `${data.debt.toFixed(1)}%` : "N/A"}

Answer in 3-4 clear sentences: ${query}`

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
      setMessages(prev => [...prev, { role: "ai", text: text || "No response received." }])
    } catch {
      setMessages(prev => [...prev, { role: "ai", text: "Error connecting to AI." }])
    }
    setLoading(false)
  }

  return (
    <div style={{
      background: "#060912",
      border: "1px solid #1e2a3a",
      borderRadius: "12px",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "12px"
    }}>
      {/* Header */}
      <div>
        <p style={{ fontSize: "9px", color: "#3b82f6", letterSpacing: "1px", marginBottom: "2px" }}>AI ANALYST</p>
        <p style={{ fontSize: "14px", fontWeight: "600", color: "#ffffff" }}>Ask about {country.name}</p>
      </div>
      {/* Suggested Questions */}
      {messages.length === 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {SUGGESTED.map((q, i) => (
            <button
              key={i}
              onClick={() => askAI(q)}
              style={{
                background: "#0a0e1a",
                border: "1px solid #1e2a3a",
                borderRadius: "20px",
                padding: "6px 12px",
               color: "#cbd5e1",
               fontSize: "11px",
               cursor: "pointer",
               transition: "all 0.2s",
               background: "#0f172a",
               border: "1px solid #3b82f633",
              }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      {messages.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "300px", overflowY: "auto" }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start"
            }}>
              <div style={{
                background: msg.role === "user" ? "#1e3a5f" : "#0a0e1a",
                border: `1px solid ${msg.role === "user" ? "#3b82f6" : "#1e2a3a"}`,
                borderRadius: msg.role === "user" ? "12px 12px 0 12px" : "12px 12px 12px 0",
                padding: "10px 14px",
                maxWidth: "85%",
                color: msg.role === "user" ? "#ffffff" : "#ffffff",
                fontSize: "12px",
                lineHeight: "1.6"
              }}>
                {msg.role === "ai" && (
                  <p style={{ fontSize: "9px", color: "#3b82f6", letterSpacing: "1px", marginBottom: "4px" }}>QVANT AI</p>
                )}
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div style={{
                background: "#0a0e1a", border: "1px solid #1e2a3a",
                borderRadius: "12px 12px 12px 0", padding: "10px 14px"
              }}>
                <p style={{ color: "#334155", fontSize: "11px", letterSpacing: "1px" }}>ANALYZING...</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Input */}
      <div style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && askAI()}
          placeholder="Ask anything about this economy..."
style={{
            flex: 1,
            background: "#0a0e1a",
            border: "1px solid #3b82f644",
            borderRadius: "8px",
            padding: "10px 14px",
            color: "#ffffff",
            fontSize: "12px",
            outline: "none"
          }}
        />
        <button
          onClick={() => askAI()}
          disabled={loading}
          style={{
            background: "linear-gradient(135deg, #1e3a5f, #1d4ed8)",
            color: "#fff",
            border: "1px solid #3b82f6",
            borderRadius: "8px",
            padding: "10px 16px",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "12px",
            opacity: loading ? 0.7 : 1,
            flexShrink: 0
          }}
        >
          Ask
        </button>
      </div>
    </div>
  )
}