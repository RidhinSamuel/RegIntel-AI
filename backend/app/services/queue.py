"""Redis Queue integration for async task processing.

This module initializes the connection to the Redis server and exports
the default RQ queue instance.
"""

from redis import Redis
from rq import Queue

# Initialize a connection to the local Redis (or Valkey) server which acts as the message broker
redis_conn: Redis = Redis(host='localhost', port=6379)

# Set up the RQ (Redis Queue) instance for handling asynchronous background tasks
rq_queue: Queue = Queue(connection=redis_conn)

