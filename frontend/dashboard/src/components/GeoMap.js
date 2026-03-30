import React, { useEffect, useState } from "react"
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"

function isPrivateIP(ip) {
  return (
    ip.startsWith("127.") ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    ip.startsWith("172.16.") ||
    ip.startsWith("172.17.") ||
    ip.startsWith("172.18.") ||
    ip.startsWith("172.19.") ||
    ip.startsWith("172.2") ||
    ip.startsWith("172.30.") ||
    ip.startsWith("172.31.")
  )
}

function GeoMap() {
  const [locations, setLocations] = useState([])

  useEffect(() => {
    const seenIPs = new Set()

    const ws = new WebSocket("ws://127.0.0.1:8000/ws/packets")

    ws.onmessage = async (event) => {
      const packet = JSON.parse(event.data)

      if (!packet.anomaly) return
      if (!packet.src_ip || isPrivateIP(packet.src_ip)) return
      if (seenIPs.has(packet.src_ip)) return

      try {
        const res = await fetch(`https://ipapi.co/${packet.src_ip}/json/`)
        const data = await res.json()

        if (data.latitude && data.longitude) {
          seenIPs.add(packet.src_ip)

          setLocations(prev => [
            ...prev,
            {
              ip: packet.src_ip,
              lat: data.latitude,
              lon: data.longitude,
              city: data.city,
              country: data.country_name
            }
          ])
        }
      } catch (err) {
        console.log("Geo lookup failed")
      }
    }

    return () => ws.close()
  }, [])

  // fallback demo markers if nothing appears
  const fallbackLocations = [
    { ip: "Demo-US", lat: 37.7749, lon: -122.4194, city: "San Francisco", country: "USA" },
    { ip: "Demo-EU", lat: 51.5074, lon: -0.1278, city: "London", country: "UK" },
    { ip: "Demo-ASIA", lat: 28.6139, lon: 77.2090, city: "Delhi", country: "India" }
  ]

  const displayLocations = locations.length > 0 ? locations : fallbackLocations

  return (
    <div className="card p-3 h-100 d-flex flex-column">

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">🌍 Attack Source Map</h5>
        <span className="badge bg-primary">
          {locations.length > 0 ? `${locations.length} Sources` : "Demo Mode"}
        </span>
      </div>

      <div style={{ height: "300px", borderRadius: "12px", overflow: "hidden" }}>
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {displayLocations.map((loc, i) => (
            <CircleMarker
              key={i}
              center={[loc.lat, loc.lon]}
              radius={10}
              pathOptions={{
                color: "#ef4444",
                fillColor: "#ef4444",
                fillOpacity: 0.7
              }}
            >
              <Popup>
                <b>{loc.ip}</b><br />
                {loc.city}, {loc.country}
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

    </div>
  )
}

export default GeoMap