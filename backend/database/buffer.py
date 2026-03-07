import threading
import time
from queue import Queue
from database.mongodb import traffic_collection

packet_queue = Queue()

BATCH_SIZE = 100
FLUSH_INTERVAL = 3


def add_packet(packet):

    packet_queue.put(packet)


def buffer_worker():

    buffer = []

    while True:

        try:
            packet = packet_queue.get(timeout=FLUSH_INTERVAL)
            buffer.append(packet)

            if len(buffer) >= BATCH_SIZE:
                traffic_collection.insert_many(buffer)
                buffer.clear()

        except:
            if buffer:
                traffic_collection.insert_many(buffer)
                buffer.clear()


def start_buffer():

    thread = threading.Thread(target=buffer_worker, daemon=True)
    thread.start()