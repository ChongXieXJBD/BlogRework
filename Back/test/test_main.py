import os
os.path.join(os.path.dirname(__file__), "../")


from pymongo import MongoClient
from watchdog.observers import Observer
from file_monitor import FileMonitor
from web_server import WebServer


if __name__ == "__main__":
    client = MongoClient()
    database = client.get_database("test")
    client.close()
    server = WebServer(database).web_server
    observer = Observer()
    file_monitor = FileMonitor(database, "./pages", True)
    observer.schedule(file_monitor, path="./pages", recursive=True)
    observer.start()
    server.run(debug=True)