# worker_processes 8
worker_processes 2

pid "/var/run/unicorn.pid"
listen "/var/tmp/unicorn.sock"

stdout_path "./log/unicorn.stdout.log"
stderr_path "./log/unicorn.stderr.log"
