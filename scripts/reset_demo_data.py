import sys
import os

# Add backend folder to Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../backend")))

from database.mongodb import alerts_collection, features_collection, traffic_collection

alerts_collection.delete_many({})
features_collection.delete_many({})
traffic_collection.delete_many({})

print("✅ Demo data cleared successfully.")