export default function CountryInfo({ country }) {
  return (
    <div style={{
      background: "#060912",
      border: "1px solid #1e2a3a",
      borderRadius: "10px",
      padding: "14px 18px",
      display: "flex",
      alignItems: "center",
      gap: "16px",
      flexWrap: "wrap"
    }}>
      <img
        src={`https://flagcdn.com/w80/${country.flag}.png`}
        alt={country.name}
        style={{ height: "32px", borderRadius: "4px", border: "1px solid #1e2a3a" }}
      />
      <div style={{ flex: 1, minWidth: "150px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#f1f5f9" }}>{country.name}</h2>
        <p style={{ color: "#cbd5e1", fontSize: "11px", marginTop: "2px" }}>
          🏛 {country.capital} &nbsp;·&nbsp; 🌍 {country.region}
        </p>
      </div>
    </div>
  )
}