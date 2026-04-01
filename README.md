# NetSentinel

## Real-Time AI-Powered Intrusion Detection System (IDS)

NetSentinel is a **real-time AI-powered Intrusion Detection System (IDS)** built to monitor network traffic, extract meaningful traffic features, detect suspicious activities using **rule-based detection** and **machine learning**, and present everything through a modern live dashboard.

This project combines **packet sniffing**, **real-time feature extraction**, **anomaly detection**, **alert generation**, and **interactive visualization** into a practical cybersecurity monitoring solution.

---

## Table of Contents

* [Overview](#overview)
* [Project Objectives](#project-objectives)
* [Key Features](#key-features)
* [Technology Stack](#technology-stack)
* [Project Structure](#project-structure)
* [System Workflow](#system-workflow)
* [Detection Logic](#detection-logic)
* [Dashboard Modules](#dashboard-modules)
* [Attack Simulation Modes](#attack-simulation-modes)
* [Installation and Setup](#installation-and-setup)
* [Linux Packet Capture Permissions](#linux-packet-capture-permissions)
* [Dataset and Model Training](#dataset-and-model-training)
* [Future Enhancements](#future-enhancements)
* [Academic Relevance](#academic-relevance)
* [Author](#author)

---

## Overview

NetSentinel continuously captures packets from the local network, analyzes them in real time, detects suspicious behavior such as **traffic spikes**, **port scans**, and **abnormal traffic patterns**, and displays the results in a visually rich dashboard.

The system supports two operational modes:

### 1. Live Mode

Monitors actual network traffic from the host machine or connected network interface.

### 2. Demo / Simulation Mode

Generates controlled suspicious or attack traffic for testing, evaluation, and project demonstrations.

NetSentinel is designed as a practical cybersecurity project to demonstrate how **real-time network monitoring** and **AI-based anomaly detection** can be integrated into a usable intrusion detection platform.

---

## Project Objectives

The main goals of NetSentinel are:

* Capture live network packets in real time
* Extract useful traffic-level features from captured packets
* Detect intrusions using:

  * Rule-based analysis
  * Machine learning anomaly detection
* Generate alerts for suspicious or malicious traffic
* Visualize traffic activity and anomalies in a live dashboard
* Simulate attack traffic for testing and demonstrations
* Build a practical IDS workflow suitable for academic and demo environments

---

## Key Features

## 1) Real-Time Packet Monitoring

* Captures live network traffic using **Scapy**
* Extracts key packet details such as:

  * Source IP
  * Destination IP
  * Source Port
  * Destination Port
  * MAC Addresses
  * Protocol
  * Packet Length

---

## 2) Intrusion Detection Engine

NetSentinel detects suspicious traffic using both **rule-based logic** and **machine learning models**.

### Rule-Based Detection

Supports detection of:

* **Port Scans**
* **Traffic Spikes**
* **Flood-like Behavior**

### Machine Learning Detection

Uses **Isolation Forest** to identify traffic behavior that deviates from normal network activity.

---

## 3) Alerting System

The system generates alerts with multiple severity levels:

* **LOW**
* **MEDIUM**
* **HIGH**
* **CRITICAL**

Each alert is triggered based on suspicious packet behavior or anomaly patterns.

---

## 4) Interactive Dashboard

The React-based dashboard provides real-time visualization of traffic and threats, including:

* Live Packet Stream
* Threat Alerts
* Protocol Distribution
* Top Attackers
* Traffic Activity Graph
* Threat Score
* Alert Timeline
* Geo Map / Heat Visualization
* Packet Inspection Modal

---

## 5) Attack Simulation Support

NetSentinel includes a built-in simulation module for generating demo traffic such as:

* Normal Traffic
* Low Suspicious Traffic
* Medium Attack Traffic
* High Port Scan Traffic
* Critical Flood Traffic
* Mixed Attack Demonstration

This is useful for testing, presentations, and dashboard evaluation.

---

## 6) MongoDB Integration

The system stores important data such as:

* Alerts
* Extracted Features
* Traffic Events

This enables logging, monitoring, and future analysis.

---

## Technology Stack

## Frontend

* **React.js**
* **Bootstrap**
* **Recharts**
* **WebSocket**

## Backend

* **FastAPI**
* **Python**
* **Scapy**
* **AsyncIO / Threading**

## Database

* **MongoDB**

## Machine Learning

* **Scikit-learn**
* **Isolation Forest**
* **Pandas**
* **NumPy**

---

## Project Structure

```bash
NetSentinel/
│
├── backend/
│   ├── api/              # API routes and endpoints
│   ├── alerts/           # Alert generation and handling
│   ├── capture/          # Packet sniffing and capture logic
│   ├── core/             # Core backend configurations
│   ├── database/         # MongoDB connection and DB operations
│   ├── detection/        # Rule-based and ML detection logic
│   ├── features/         # Feature extraction from packets
│   ├── simulator/        # Attack traffic simulation
│   ├── training/         # Model training scripts
│   ├── utils/            # Helper functions and utilities
│   └── main.py           # FastAPI application entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Dashboard pages
│   │   ├── services/     # API and WebSocket services
│   │   └── App.js        # Main React app
│
├── datasets/             # Training / testing datasets
├── models/               # Trained ML models
├── .gitignore
└── README.md
```

---

## System Workflow

NetSentinel follows the workflow below:

### 1. Packet Capture

Scapy captures packets from the selected network interface in real time.

### 2. Feature Extraction

Captured packet data is converted into structured traffic features.

### 3. Detection

The detection engine performs:

* Rule-based threshold checks
* Machine learning anomaly analysis

### 4. Alert Generation

Suspicious traffic is classified and converted into alerts with severity labels.

### 5. Data Storage

Alerts, packet metadata, and extracted features are stored in MongoDB.

### 6. Live Visualization

WebSocket pushes real-time updates to the React dashboard for instant monitoring.

---

## Detection Logic

## Rule-Based Detection

NetSentinel currently checks for the following suspicious behaviors:

### Port Scan Detection

Detects when a source attempts connections to many different destination ports in a short period.

### Traffic Spike Detection

Detects sudden surges in packet volume within a short time window.

### Flood Detection

Detects abnormally high traffic rates that may indicate flooding or denial-of-service behavior.

---

## Machine Learning Detection

In addition to rule-based detection, NetSentinel uses an **Isolation Forest** anomaly detection model trained on traffic data to identify unusual network behavior that may not match fixed rules.

This helps the system detect:

* unknown anomalies
* abnormal traffic flows
* suspicious deviations from normal behavior

---

## Dashboard Modules

The dashboard includes the following monitoring panels:

### Live Packet Stream

Displays the latest captured packets and their classification.

### Threat Alerts

Shows recent alerts with severity information.

### Threat Score

Represents the current threat posture of the network.

### Traffic Graph

Visualizes packet activity over time.

### Protocol Chart

Displays protocol distribution such as:

* TCP
* UDP
* ICMP

### Top Attackers

Highlights the most suspicious or active source IP addresses.

### Alert Timeline

Shows alert generation trends over time.

### Geo Map / Heatmap

Visualizes traffic source distribution geographically.

### Packet Inspection Modal

Allows detailed inspection of selected packet data.

---

## Attack Simulation Modes

The built-in attack simulator supports the following demo modes:

* **Low Demo**
* **Medium Demo**
* **High Demo**
* **Critical Demo**
* **Mixed Demo**

### Use Cases

These simulation modes are useful for:

* Project demonstrations
* Dashboard testing
* Model evaluation
* Attack scenario simulation

---

## Installation and Setup

Follow the steps below to run NetSentinel locally.

---

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd NetSentinel
```

---

### 2. Create and Activate a Python Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate
```

---

### 3. Install Backend Dependencies

```bash
pip install -r requirements.txt
```

---

### 4. Start MongoDB

Make sure MongoDB is installed and running locally.

Example:

```bash
sudo systemctl start mongod
```

---

### 5. Start the Backend Server

```bash
cd backend
uvicorn main:app --reload
```

Backend will run on:

```bash
http://127.0.0.1:8000
```

---

### 6. Start the Frontend

Open a new terminal and run:

```bash
cd frontend
npm install
npm start
```

Frontend will run on:

```bash
http://localhost:3000
```

---

### 7. Run the Attack Simulator (Optional)

From the project root directory:

```bash
python3 backend/simulator/attack_simulator.py
```

This can be used to generate suspicious traffic for testing and demonstration purposes.

---

## Linux Packet Capture Permissions

Packet sniffing often requires elevated permissions on Linux systems.

If you encounter permission issues while capturing packets, run:

```bash
sudo setcap cap_net_raw,cap_net_admin=eip $(which python3.12)
```

> **Note:**
> This typically needs to be done only once, unless Python is updated or reinstalled.

---

## Dataset and Model Training

NetSentinel can be trained using intrusion detection datasets such as:

* **CICIDS / CIC-IDS2017 style datasets**
* **CSV-based labeled traffic datasets**

### Training Pipeline Includes

* Data cleaning
* Feature engineering
* Feature selection
* Anomaly model training
* Model export and reuse

---

## Future Enhancements

Possible future improvements for NetSentinel include:

* Deep learning-based intrusion detection
* Hybrid signature + anomaly detection engine
* Dashboard login and authentication
* Multi-device distributed monitoring
* Packet capture history playback
* PDF report generation
* Real-time admin notification system
* Role-based SOC dashboard
* Better geolocation accuracy
* Attack signature visualization

---

## Academic Relevance

NetSentinel demonstrates practical concepts from the following domains:

* Cybersecurity
* Network Monitoring
* Intrusion Detection Systems
* Machine Learning
* Real-Time Dashboards
* WebSockets
* Full-Stack Development

### Suitable For

* Final Year Projects
* Cybersecurity Demonstrations
* AI + Networking Academic Projects
* IDS / SOC Concept Demonstrations

---

## Author

**Ashish Kumar**
**Project:** *NetSentinel – Real-Time AI-Powered Intrusion Detection System*
