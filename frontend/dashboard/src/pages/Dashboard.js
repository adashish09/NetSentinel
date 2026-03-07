import React, { useEffect, useState } from "react"
import PacketStream from "../components/PacketStream"
import AlertTable from "../components/AlertTable"
import API from "../services/api"

function Dashboard() {

  const [alerts, setAlerts] = useState([])

  useEffect(() => {

    async function loadAlerts() {

      const res = await API.get("/alerts")

      setAlerts(res.data.slice(0,5))   // only latest alerts

    }

    loadAlerts()

  }, [])

  return (

    <div className="container mt-4">

      <h2>NetSentinel Dashboard</h2>

      <div className="row mt-4">

        <div className="col-md-8">
          <PacketStream />
        </div>

        <div className="col-md-4">

          <div className="card p-3">
            <h5>Recent Alerts</h5>
            <AlertTable alerts={alerts}/>
          </div>

        </div>

      </div>

    </div>

  )

}

export default Dashboard