// src/infra/logger.ts
/**
 * Simple logger wrapper around console.
 * In a real project you would replace this with Winston or another logging library.
 */
export class Logger {
  constructor(private readonly context: string) {}

  info(message: string, meta?: Record<string, any>) {
    console.info(`[INFO] [${this.context}] ${message}`, meta ?? {});
  }

  warn(message: string, meta?: Record<string, any>) {
    console.warn(`[WARN] [${this.context}] ${message}`, meta ?? {});
  }

  error(message: string, meta?: Record<string, any>) {
    console.error(`[ERROR] [${this.context}] ${message}`, meta ?? {});
  }
}
