"use client"

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <div style={{ padding: "40px", textAlign: "center", fontFamily: "Arial" }}>
          <h1 style={{ color: "#dc2626" }}>Error Global</h1>
          <p style={{ color: "#6b7280", marginBottom: "20px" }}>
            {error?.message || "Ha ocurrido un error crítico"}
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: "10px 20px",
              background: "#dc2626", 
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Reiniciar aplicación
          </button>
        </div>
      </body>
    </html>
  )
}
