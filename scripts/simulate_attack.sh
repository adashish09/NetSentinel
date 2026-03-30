#!/bin/bash

echo "NetSentinel Attack Simulator"

case "$1" in

  portscan)
    echo "Running Port Scan..."
    nmap -p 1-200 localhost
    ;;

  flood)
    echo "Running Ping Flood (5 sec)..."
    ping -f 127.0.0.1 -c 100
    ;;

  syn)
    echo "Running SYN Attack..."
    sudo hping3 -S -p 80 -c 100 127.0.0.1
    ;;

  *)
    echo "Usage:"
    echo "./simulate_attack.sh portscan"
    echo "./simulate_attack.sh flood"
    echo "./simulate_attack.sh syn"
    ;;

esac