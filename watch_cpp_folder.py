import time
import subprocess
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import os
import glob

# Absolute or relative path to your folder (adjust as needed for Windows)
WATCHED_FOLDER = os.path.abspath("cpp")  # e.g., "C:/cpp"


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

        if not event.src_path.endswith(".cpp"):
            return

        print(f"Detected change: {event.event_type} - {event.src_path}")
        try:
            self.copy_cpp_files()
            print("Docker copy of .cpp files successful.")
            self.last_copy_time = current_time

        except subprocess.CalledProcessError as e:
            print(f"Error during Docker copy: {e}")

        try:
            self.create_test_file()
            print("Test file created.")
        except subprocess.CalledProcessError as e:
            print(f"Error during test file creation: {e}")

        print("\n\n\n")

    def copy_cpp_files(self):
        cpp_files = glob.glob(os.path.join(WATCHED_FOLDER, "*.cpp"))
        for cpp_file in cpp_files:
            docker_command = ["docker", "cp", cpp_file, "image-editor-wasm-1:/app/cpp/"]
            subprocess.run(docker_command, check=True)

    def create_test_file(self):
        docker_command = [
            "docker",
            "exec",
            "-it",
            "image-editor-wasm-1",
            "bash",
            "-c",
            "touch /app/cpp/test.txt",
        ]
        subprocess.run(docker_command, check=True)


if __name__ == "__main__":
    event_handler = ChangeHandler()
    observer = Observer()
    observer.schedule(event_handler, path=WATCHED_FOLDER, recursive=True)

    print(f"Watching folder: {WATCHED_FOLDER} for .cpp files")
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
