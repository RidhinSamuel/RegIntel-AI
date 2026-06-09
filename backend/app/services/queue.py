from redis import Redis
from rq import Queue

# Initialize a connection to the local Redis (or Valkey) server which acts as the message broker
redis_conn = Redis(host='localhost', port=6379)

# Set up the RQ (Redis Queue) instance for handling asynchronous background tasks
rq_queue = Queue(connection=redis_conn)
