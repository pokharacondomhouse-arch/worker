import { Worker as BullWorker, Job } from 'bullmq';
import { Redis } from 'ioredis';
import { processTaskJob, TaskJobData } from './processors/task.processor';

export function initializeQueueWorker(redisUrl?: string): BullWorker | null {
  if (!redisUrl) {
    console.log('[Worker Queue] No REDIS_URL provided. Running in standalone scheduled mode.');
    return null;
  }

  try {
    const connection = new Redis(redisUrl, {
      maxRetriesPerRequest: null,
    });

    const worker = new BullWorker<TaskJobData>(
      'pch-tasks',
      async (job: Job<TaskJobData>) => {
        return processTaskJob(job.data);
      },
      { connection }
    );

    worker.on('completed', (job) => {
      console.log(`[Worker Queue] Job ${job.id} completed successfully.`);
    });

    worker.on('failed', (job, err) => {
      console.error(`[Worker Queue] Job ${job?.id} failed:`, err);
    });

    console.log('[Worker Queue] BullMQ worker initialized on queue "pch-tasks".');
    return worker;
  } catch (err) {
    console.error('[Worker Queue] Failed to initialize BullMQ worker:', err);
    return null;
  }
}
