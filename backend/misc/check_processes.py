import subprocess

def scan_all_relevant_processes():
    try:
        print("=== Scanning Processes (rq, uv, python) ===")
        # Query wmic for CommandLine, Name, and ProcessId
        cmd = 'wmic process get ProcessId, Name, CommandLine'
        output = subprocess.check_output(cmd, shell=True, text=True)
        
        lines = output.strip().split("\n")
        header = lines[0]
        process_lines = lines[1:]
        
        found = False
        print(f"{'PID':<10} | {'Name':<20} | {'Command Line'}")
        print("-" * 80)
        
        for line in process_lines:
            line = line.strip()
            if not line:
                continue
            
            # Split line to find PID (which is the last column in default WMIC output)
            parts = line.split()
            if len(parts) < 2:
                continue
                
            pid = parts[-1]
            name = parts[-2] if len(parts) >= 2 else ""
            command_line = " ".join(parts[:-2]) if len(parts) > 2 else ""
            
            # Match rq, uv, or python in name or command line
            lower_line = line.lower()
            if any(x in lower_line for x in ["rq.exe", "uv.exe", "python.exe", "rq-worker", "rq worker"]):
                print(f"{pid:<10} | {name:<20} | {command_line}")
                found = True
                
        if not found:
            print("No matching processes found.")
            
    except Exception as e:
        print("Error getting process list:", e)

if __name__ == "__main__":
    scan_all_relevant_processes()
