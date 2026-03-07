import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

client = MongoClient(MONGO_URI)

db = client[DB_NAME]

# collections
traffic_collection = db["traffic"]
features_collection = db["features"]
alerts_collection = db["alerts"]
logs_collection = db["logs"]