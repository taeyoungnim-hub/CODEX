import { Queue } from 'bullmq';
import { redis } from '../cache/redis';

export const SUMMARY_QUEUE_NAME = 'summary-jobs';

export const summaryQueue = redis
  ? new Queue(SUMMARY_QUEUE_NAME, {
      connection: redis
    })
  : null;
