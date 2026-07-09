/**
 * LPE — Timer Service Implementation
 *
 * Reusable utility to compute countdowns, elapsed times, and stopwatch states.
 * Keeps business logic clean and time calculations synchronized.
 */

export class TimerServiceImpl {
  calculateRemainingSeconds(startTime: Date, timeLimitSeconds: number): number {
    const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);
    return Math.max(0, timeLimitSeconds - elapsed);
  }

  calculateElapsedSeconds(startTime: Date, endTime?: Date): number {
    const end = endTime ? endTime.getTime() : Date.now();
    return Math.floor((end - startTime.getTime()) / 1000);
  }

  isExpired(startTime: Date, timeLimitSeconds: number): boolean {
    return this.calculateRemainingSeconds(startTime, timeLimitSeconds) <= 0;
  }
}
