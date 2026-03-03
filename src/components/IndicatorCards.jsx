const formatGDP = (value) => {
  if (!value) return "N/A"
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
  return `$${value.toFixed(2)}`
}

const Card = ({ title, value, unit, color }) => (
  <div style={{
    background: "#1a1a2e",
    border: `1px solid ${color}33`,
    borderRadius: "12px",
    padding: "24px",
    flex: "1",
    minWidth: "200px"
  }}>
    <p style={{ color: "#888", fontSize: "13px", marginBottom: "8px" }}>{title}</p>
    <p style={{ color: color, fontSize: "28px", fontWeight: "700" }}>{value}</p>
    {unit && <p style={{ color: "#555", fontSize: "12px", marginTop: "4px" }}>{unit}</p>}
  </div>
)

export default function IndicatorCards({ data }) {
  return (
    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "32px" }}>
      <Card
        title="GDP"
        value={formatGDP(data.gdp)}
        unit="Total Economy Size"
        color="#4ade80"
      />
      <Card
        title="Inflation Rate"
        value={data.inflation ? `${data.inflation.toFixed(1)}%` : "N/A"}
        unit="Consumer Price Index"
        color="#f97316"
      />
      <Card
        title="Unemployment"
        value={data.unemployment ? `${data.unemployment.toFixed(1)}%` : "N/A"}
        unit="% of Labor Force"
        color="#60a5fa"
      />
      <Card
        title="Debt to GDP"
        value={data.debt ? `${data.debt.toFixed(1)}%` : "N/A"}
        unit="Government Debt"
        color="#c084fc"
      />
    </div>
  )
}