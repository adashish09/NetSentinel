import React from "react"

function getSeverityBadge(severity) {
  switch (severity) {
    case "CRITICAL":
      return "bg-danger"
    case "HIGH":
      return "bg-warning text-dark"
    case "MEDIUM":
      return "bg-info text-dark"
    default:
      return "bg-secondary"
  }
}

function AlertTable({ alerts }) {
  return (
    <div className="table-responsive">
      <table className="table table-sm align-middle">
        <thead>
          <tr>
            <th>Type</th>
            <th>Source</th>
            <th>Severity</th>
          </tr>
        </thead>
        <tbody>
          {alerts.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center text-secondary">
                No alerts yet
              </td>
            </tr>
          ) : (
            alerts.map((alert, i) => (
              <tr
                key={i}
                className="alert-row"
                style={{
                  background: "#020617",
                  borderLeft: `5px solid ${alert.severity === "CRITICAL" ? "#ef4444" :
                      alert.severity === "HIGH" ? "#f97316" :
                        alert.severity === "MEDIUM" ? "#eab308" :
                          "#3b82f6"
                    }`
                }}
              >
                <td>{alert.type}</td>
                <td>{alert.src_ip}</td>
                <td>
                  <span className={`badge ${getSeverityBadge(alert.severity)} ${alert.severity === "CRITICAL" ? "blink" : ""
                    }`}>
                    {alert.severity || "LOW"}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default AlertTable