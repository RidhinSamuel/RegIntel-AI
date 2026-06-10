import subprocess
import os
import sys

def kill_rq_workers():
    try:
        # Get Command Line, Name, and Process ID of processes
        cmd = 'wmic process get ProcessId, Name, CommandLine'
        output = subprocess.check_output(cmd, shell=True, text=True)
        
        my_pid = os.getpid()
        killed_count = 0
        
        # Parse lines
        lines = output.strip().split("\n")
        header = lines[0]
        process_lines = lines[1:]
        
        for line in process_lines:
            line = line.strip()
            if not line:
                continue
                
            parts = line.split()
            if len(parts) < 2:
                continue
                
            pid_str = parts[-1]
            name = parts[-2]
            command_line = " ".join(parts[:-2])
            
            try:
                pid = int(pid_str)
            except ValueError:
                continue
                
            if pid == my_pid:
                continue
                
            if "kill_rq_workers" in command_line.lower():
                continue
                
            # Match rq.exe, or command lines containing both "rq" and "worker"
            lower_cl = command_line.lower()
            is_rq_process = (
                name.lower() == "rq.exe" or 
                name.lower() == "rq" or
                ("rq" in lower_cl and "worker" in lower_cl)
            )
            
            if is_rq_process:
                print(f"Found RQ process [PID {pid}, Name {name}]: {command_line}")
                try:
                    subprocess.run(f"taskkill /F /PID {pid}", shell=True, check=True)
                    print(f"Successfully killed process {pid}")
                    killed_count += 1
                except Exception as ex:
                    print(f"Failed to kill process {pid}: {ex}")
                    
        if killed_count == 0:
            print("No RQ processes found.")
        else:
            print(f"Killed {killed_count} RQ worker processes.")
            
    except Exception as e:
        print("Error scanning/killing processes:", e)

if __name__ == "__main__":
    kill_rq_workers()
