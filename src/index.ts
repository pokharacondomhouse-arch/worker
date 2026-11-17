import { initializeQueueWorker } from './queue';
import { processTaskJob } from './processors/task.processor';

let isShuttingDown = false;
let heartbeatTimer: ReturnType<typeof setInterval> | null = null;

async function startWorker() {
  console.log('----------------------------------------------------');
  console.log('[Worker] Starting PCH Background Worker on Render...');
  console.log(`[Worker] Runtime: Bun ${typeof Bun !== 'undefined' ? Bun.version : 'Node.js'}`);
  console.log(`[Worker] Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('----------------------------------------------------');

  const redisUrl = process.env.REDIS_URL;
  const bullWorker = initializeQueueWorker(redisUrl);

  // If no Redis is configured, run an interval demonstration task every 30s
  if (!bullWorker) {
    let tickCount = 0;
    heartbeatTimer = setInterval(async () => {
      if (isShuttingDown) return;
      tickCount += 1;
      console.log(`[Worker Heartbeat #${tickCount}] Worker alive at ${new Date().toISOString()}`);

      // Periodic sample WASM task
      await processTaskJob({
        id: `interval-job-${tickCount}`,
        name: 'periodic-wasm-compute',
        payload: { a: 10 * tickCount, b: 5 },
      });
    }, 30000);
  }

  // Graceful shutdown handling for Render container lifecycle
  const handleShutdown = async (signal: string) => {
    if (isShuttingDown) return;
    isShuttingDown = true;
    console.log(`\n[Worker] Received ${signal}. Starting graceful shutdown...`);

    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
    }

    if (bullWorker) {
      console.log('[Worker] Closing BullMQ connections...');
      await bullWorker.close();
    }

    console.log('[Worker] Shutdown complete. Exiting.');
    process.exit(0);
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
}

startWorker().catch((err) => {
  console.error('[Worker Fatal Error]:', err);
  process.exit(1);
});
