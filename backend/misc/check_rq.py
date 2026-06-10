import os
import sys
from redis import Redis
from rq import Queue
from rq.registry import StartedJobRegistry, FailedJobRegistry, FinishedJobRegistry

# Add the parent app directory to PYTHONPATH so it can locate app modules if needed
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

redis_conn = Redis(host='localhost', port=6379)
queue = Queue(connection=redis_conn)

print("=== RQ Queue Status ===")
print("Queued jobs count:", len(queue))
print("Queued jobs IDs:", queue.job_ids)

started = StartedJobRegistry(queue=queue)
print("\nStarted jobs count:", len(started))
print("Started jobs IDs:", started.get_job_ids())

failed = FailedJobRegistry(queue=queue)
print("\nFailed jobs count:", len(failed))
print("Failed jobs IDs:", failed.get_job_ids())
for job_id in failed.get_job_ids():
    job = queue.fetch_job(job_id)
    if job:
        print(f"\n--- Failed Job {job_id} ---")
        print(f"Function: {job.func_name}")
        print(f"Arguments: {job.args}")
        print(f"Exception Traceback:\n{job.exc_info}")
    else:
        print(f"Failed job ID {job_id} - could not fetch job details.")

finished = FinishedJobRegistry(queue=queue)
print("\nFinished jobs count:", len(finished))
print("Finished jobs IDs:", finished.get_job_ids())
