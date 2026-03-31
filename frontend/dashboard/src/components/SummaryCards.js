import React, { useEffect, useRef, useState } from "react"
import ThreatScoreCard from "./ThreatScoreCard"

function SummaryCards() {
  const [totalPackets, setTotalPackets] = useState(0)
  const [anomalies, setAnomalies] = useState(0)
  const [criticalThreats, setCriticalThreats] = useState(0)

  const wsRef = useRef(null)
  const reconnectTimeout = useRef(null)
  const lastPacketTime = useRef(Date.now())

  useEffect(() => {
    let isMounted = true

    const connectWebSocket = () => {
      if (!isMounted) return

      const ws = new WebSocket("ws://127.0.0.1:8000/ws/packets")
      wsRef.current = ws

      ws.onopen = () => {
        console.log("SummaryCards WebSocket connected")
      }

      ws.onmessage = (event) => {
        const packet = JSON.parse(event.data)

        if (!isMounted) return

        lastPacketTime.current = Date.now()
        setTotalPackets((prev) => prev + 1)

        if (packet.anomaly) {
          setAnomalies((prev) => prev + 1)
        }

        if (packet.severity === "CRITICAL") {
          setCriticalThreats((prev) => prev + 1)
        }
      }

      ws.onerror = (err) => {
        console.error("SummaryCards WebSocket error:", err)
      }

      ws.onclose = () => {
        console.log("SummaryCards WebSocket closed. Reconnecting...")
        if (isMounted) {
          reconnectTimeout.current = setTimeout(connectWebSocket, 2000)
        }
      }
    }

    connectWebSocket()

    // Intelligent cooldown / decay
    const decayInterval = setInterval(() => {
      const now = Date.now()
      const idleFor = now - lastPacketTime.current

      // Start cooling down after 10 sec inactivity
      if (idleFor > 10000) {
        setAnomalies((prev) => Math.max(0, prev - 1))
        setCriticalThreats((prev) => Math.max(0, prev - 1))
      }

      // Slowly reduce total packets after long inactivity (optional realism)
      if (idleFor > 30000) {
        setTotalPackets((prev) => Math.max(0, prev - 1))
      }
    }, 3000)

    return () => {
      isMounted = false
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current)
      if (wsRef.current) wsRef.current.close()
      clearInterval(decayInterval)
    }
  }, [])

  return (
    <div className="row g-3 mb-4">
      <div className="col-md-6 col-xl-3">
        <div className="card summary-card">
          <h6 className="summary-label">Total Packets</h6>
          <h2 className="summary-value">{totalPackets}</h2>
          <small className="summary-subtext">Observed traffic events</small>
        </div>
      </div>

      <div className="col-md-6 col-xl-3">
        <div className="card summary-card">
          <h6 className="summary-label">Anomalies</h6>
          <h2 className="summary-value" style={{ color: "#facc15" }}>
            {anomalies}
          </h2>
          <small className="summary-subtext">Suspicious detections logged</small>
        </div>
      </div>

      <div className="col-md-6 col-xl-3">
        <div className="card summary-card">
          <h6 className="summary-label">Critical Threats</h6>
          <h2 className="summary-value" style={{ color: "#f43f5e" }}>
            {criticalThreats}
          </h2>
          <small className="summary-subtext">High-risk incidents detected</small>
        </div>
      </div>

      <div className="col-md-6 col-xl-3">
        <ThreatScoreCard />
      </div>
    </div>
  )
}

export default SummaryCards