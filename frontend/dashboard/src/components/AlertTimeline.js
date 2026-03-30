import React, { useEffect, useState, useRef } from "react"
import {
    Line
} from "react-chartjs-2"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
} from "chart.js"

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
)

function AlertTimeline() {

    const [labels, setLabels] = useState([])
    const [alertsData, setAlertsData] = useState([])

    const alertBuffer = useRef([])

    useEffect(() => {

        const ws = new WebSocket("ws://127.0.0.1:8000/ws/packets")

        ws.onmessage = (event) => {
            const packet = JSON.parse(event.data)

            if (packet.anomaly) {
                alertBuffer.current.push(1)
            }
        }

        const interval = setInterval(() => {

            const now = new Date().toLocaleTimeString()
            const count = alertBuffer.current.length

            alertBuffer.current = []

            setLabels(prev => [...prev, now].slice(-60))
            setAlertsData(prev => [...prev, count].slice(-60))

        }, 1000)

        return () => {
            ws.close()
            clearInterval(interval)
        }

    }, [])

    const data = {
        labels,
        datasets: [
            {
                label: "Alerts/sec",
                data: alertsData,
                borderColor: "#ef4444",
                backgroundColor: "rgba(239,68,68,0.2)",
                tension: 0.3
            }
        ]
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                labels: { color: "#e5e7eb" }
            }
        },
        scales: {
            x: { ticks: { color: "#9ca3af" } },
            y: { ticks: { color: "#9ca3af" } }
        }
    }

    return (
        <div className="card p-3 h-100 d-flex flex-column">

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">📈 Alert Timeline</h5>
                <span className="badge bg-warning text-dark">
                    Live
                </span>
            </div>

            <div style={{ height: "300px" }}>
                <Line data={data} options={{ ...options, maintainAspectRatio: false }} />
            </div>

        </div>
    )
}

export default AlertTimeline