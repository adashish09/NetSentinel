import React, { useEffect, useState } from "react"
import PacketStream from "../components/PacketStream"
import AlertTable from "../components/AlertTable"
import ProtocolChart from "../components/ProtocolChart"
import TopAttackers from "../components/TopAttackers"
import TrafficGraph from "../components/TrafficGraph"
import AnomalyDetails from "../components/AnomalyDetails"
import API from "../services/api"
import SummaryCards from "../components/SummaryCards"
import AlertTimeline from "../components/AlertTimeline"
import GeoMap from "../components/GeoMap"

function Dashboard() {

  const [alerts, setAlerts] = useState([])
  const [selectedPacket, setSelectedPacket] = useState(null)

  useEffect(() => {
    async function loadAlerts() {
      const res = await API.get("/alerts")
      setAlerts(res.data.slice(0, 5))
    }

    loadAlerts()
    const interval = setInterval(loadAlerts, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="container-fluid p-4">

      {/* HEADER */}
      <div
        className="d-flex justify-content-between align-items-center mb-4 px-4 py-3"
        style={{
          background: "linear-gradient(90deg, #020617, #0f172a, #111827)",
          border: "1px solid #1e293b",
          borderRadius: "16px",
          boxShadow: "0 0 20px rgba(56, 189, 248, 0.08)"
        }}
      >
        <div>
          <h1
            className="fw-bold mb-1"
            style={{
              color: "#38bdf8",
              letterSpacing: "0.5px",
              fontSize: "2.1rem"
            }}
          >
            NetSentinel
          </h1>
          <p className="mb-0 text-secondary" style={{ fontSize: "0.95rem" }}>
            Real-Time Intrusion Detection System
          </p>
        </div>

        <div className="d-flex gap-2">
          <span className="badge bg-success">Active</span>
          <span className="badge bg-primary">Monitoring</span>
        </div>
      </div>

      <SummaryCards />

      {/* ROW 1 */}
      <div className="row g-4">

        <div className="col-xl-8">
          <PacketStream onSelectPacket={setSelectedPacket} />
        </div>

        <div className="col-xl-4">
          <div className="card p-3 h-100">
            <h5 style={{ color: "#f87171" }}>🚨 Threat Alerts</h5>
            <AlertTable alerts={alerts} />
          </div>
        </div>

      </div>

      {/* ROW 2 */}
      <div className="row g-4 mt-1">
        <div className="col-12">
          <TrafficGraph />
        </div>
      </div>

      {/* ROW 3 */}
      <div className="row g-4 mt-1 align-items-stretch">

        <div className="col-xl-6 d-flex">
          <div className="w-100 h-100">
            <ProtocolChart />
          </div>
        </div>

        <div className="col-xl-6 d-flex">
          <div className="w-100 h-100">
            <TopAttackers />
          </div>
        </div>

      </div>

      {/* ROW 4 */}
      <div className="row g-4 mt-1 align-items-stretch">

        <div className="col-xl-6 d-flex">
          <div className="w-100 h-100">
            <AlertTimeline />
          </div>
        </div>

        <div className="col-xl-6 d-flex">
          <div className="w-100 h-100">
            <GeoMap />
          </div>
        </div>

      </div>

      {/* MODAL */}
      {selectedPacket && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{
            background: "rgba(2, 6, 23, 0.82)",
            backdropFilter: "blur(4px)"
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="modal-title mb-1" style={{ color: "#38bdf8" }}>
                    Packet Inspection
                  </h5>
                  <small className="text-secondary">
                    Deep inspection of selected network activity
                  </small>
                </div>

                <button
                  className="btn-close"
                  style={{
                    filter: "invert(1) brightness(3)",
                    opacity: 1
                  }}
                  onClick={() => setSelectedPacket(null)}
                ></button>
              </div>

              <div className="modal-body">
                <AnomalyDetails packet={selectedPacket} />
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Dashboard