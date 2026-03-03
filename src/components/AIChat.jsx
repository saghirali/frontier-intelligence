import { useState } from "react"

export default function AIChat({ country, data }) {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(false)

  const askAI = async () => {
    if (!question.trim()) return
    setLoading(true)
    setAnswer("")

    const prompt = `You are an expert economic analyst. Here is the latest economic data for ${country.name}:
- GDP: ${data.gdp ? `$${(data.gdp / 1e12).toFixed(2)} Trillion` : "N/A"}
- Inflation Rate: ${data.inflation ? `${data.inflation.toFixed(1)}%` : "N/A"}
- Unemployment Rate: ${data.unemployment ? `${data.unemployment.toFixed(1)}%` : "N/A"}
- Debt to GDP: ${data.debt ? `${data.debt.toFixed(1)}%` : "N/A"}

Answer this question in 3-4 clear sentences: ${question}`

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
      console.log(result)
      console.log("ERROR DETAILS:", result.error)
      const text = result?.choices?.[0]?.message?.content
      setAnswer(text || "No response received.")
    } catch (err) {
      setAnswer("Error connecting to AI.")
    }

    setLoading(false)
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
        🤖 Ask AI Analyst
      </h2>

      <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && askAI()}
          placeholder={`Ask anything about ${country.name}'s economy...`}
          style={{
            flex: 1,
            background: "#0a0a0f",
            border: "1px solid #333",
            borderRadius: "8px",
            padding: "12px 16px",
            color: "#fff",
            fontSize: "14px",
            outline: "none"
          }}
        />
        <button
          onClick={askAI}
          disabled={loading}
          style={{
            background: "#4ade80",
            color: "#000",
            border: "none",
            borderRadius: "8px",
            padding: "12px 24px",
            fontWeight: "700",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? "..." : "Ask"}
        </button>
      </div>

      {answer && (
        <div style={{
          background: "#0a0a0f",
          border: "1px solid #4ade8033",
          borderRadius: "8px",
          padding: "16px",
          color: "#ccc",
          fontSize: "14px",
          lineHeight: "1.7"
        }}>
          {answer}
        </div>
      )}
    </div>
  )
}