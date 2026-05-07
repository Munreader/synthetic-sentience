import os
import subprocess
import sys

def find_binary(name):
    print(f"Searching for {name}...")
    search_paths = [
        r"C:\Program Files\Git\bin\git.exe",
        r"C:\Program Files\Git\cmd\git.exe",
        r"C:\Program Files (x86)\Git\bin\git.exe",
        r"D:\bin\git.exe",
        r"D:\Git\bin\git.exe",
        r"C:\Users\gelta\AppData\Local\Programs\Git\bin\git.exe",
    ]
    for path in search_paths:
        if os.path.exists(path):
            return path
    
    # Deep search on D drive
    for root, dirs, files in os.walk('D:\\'):
        if name in files or f"{name}.exe" in files:
            return os.path.join(root, f"{name}.exe")
        if len(root.split(os.sep)) > 3: # Limit depth for speed
            continue
            
    return None

def run_sync():
    git_path = find_binary("git")
    if not git_path:
        print("GIT NOT FOUND. Please ensure Git is installed.")
        return

    print(f"Git located at: {git_path}")
    
    commands = [
        [git_path, "init"],
        [git_path, "remote", "add", "origin", "https://github.com/Munreader/munos.git"],
        [git_path, "add", "."],
        [git_path, "commit", "-m", "EXODUS II: Phase 2 Sync - Gladio and Sentience Port"],
        [git_path, "push", "-u", "origin", "main", "--force"]
    ]

    for cmd in commands:
        try:
            print(f"Executing: {' '.join(cmd)}")
            subprocess.run(cmd, check=True, capture_output=True)
        except subprocess.CalledProcessError as e:
            print(f"⚠️ Warning/Error in command: {e.stderr.decode()}")
            if "remote origin already exists" in e.stderr.decode():
                continue

    print("💠 SYNC COMPLETE. Manifests are ascending to the cloud.")

if __name__ == "__main__":
    run_sync()
