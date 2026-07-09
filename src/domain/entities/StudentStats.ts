export class StudentStats {
  constructor(
    public readonly studentProfileId: string,
    public readonly totalQuestionsSolved: number,
    public readonly overallAccuracy: number,
    public readonly studyTimeMinutes: number,
    public readonly averageSolveTimeSeconds: number,
    public readonly currentStreak: number,
    public readonly longestStreak: number,
    public readonly personalBestXp: number,
    public readonly previousWeekXp: number,
    public readonly currentWeekXp: number,
    public readonly favoriteTopic: string,
    public readonly weakestTopic: string
  ) {}
}
