from datetime import datetime
from database.mongodb import logs_collection


def log_event(module, message):

    log = {
        "module": module,
        "message": message,
        "timestamp": datetime.utcnow()
    }

    logs_collection.insert_one(log)