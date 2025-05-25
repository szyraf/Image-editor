import time
import subprocess
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import os

# Absolute or relative path to your folder (adjust as needed for Windows)
WATCHED_FOLDER = os.path.abspath("cpp")  # e.g., "C:/cpp"

DOCKER_COMMAND = ["docker", "cp", f"{WATCHED_FOLDER}/.", "image-editor-wasm-1:/app/cpp"]


class ChangeHandler(FileSystemEventHandler):
    def __init__(self):
        self.last_copy_time = 0
        self.copy_cooldown = 1

    def on_any_event(self, event):
        current_time = time.time()
        if current_time - self.last_copy_time < self.copy_cooldown:
            return

        if event.is_directory:
            return

        if not event.src_path.startswith(WATCHED_FOLDER):
            return

        print(f"Detected change: {event.event_type} - {event.src_path}")
        try:
            subprocess.run(DOCKER_COMMAND, check=True)
            print("Docker copy successful.")
            self.last_copy_time = current_time
        except subprocess.CalledProcessError as e:
            print(f"Error during Docker copy: {e}")


if __name__ == "__main__":
    event_handler = ChangeHandler()
    observer = Observer()
    observer.schedule(event_handler, path=WATCHED_FOLDER, recursive=True)

    print(f"Watching folder: {WATCHED_FOLDER}")
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
