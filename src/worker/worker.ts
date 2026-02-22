import { Worker } from 'bullmq';
import { SUMMARY_QUEUE_NAME } from '../lib/queue';
import { redis } from '../lib/cache/redis';
import pino from 'pino';

const logger = pino({ name: 'summary-worker' });

if (!redis) {
  logger.warn('REDIS_URL missing, worker not started.');
  process.exit(0);
}

const worker = new Worker(
  SUMMARY_QUEUE_NAME,
  async (job) => {
    logger.info({ jobId: job.id, data: job.data }, 'Processing summary refresh job');
    // MVP: 실제로는 DB 조회 후 재요약 수행
    return { ok: true };
  },
  { connection: redis }
);

worker.on('completed', (job) => logger.info({ jobId: job.id }, 'Job completed'));
worker.on('failed', (job, err) => logger.error({ jobId: job?.id, err }, 'Job failed'));
