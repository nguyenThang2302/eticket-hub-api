module.exports = {
  apps: [
    {
      script: 'dist/main.js',
      cwd: 'current',
      exec_mode: 'cluster',
      instances: 1,
      kill_timeout: 10000,
      log_data_format: 'YYYY-MM-DD HH:mm',
      max_memory_restart: '200M',
      merge_logs: true,
      name: 'api',
      time: true,
      wait_ready: true,
      exp_backoff_restart_delay: 100,
    },
  ],
};
