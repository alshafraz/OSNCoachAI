export class Achievement {
  constructor(
    public readonly id: string,
    public readonly studentProfileId: string,
    public readonly title: string,
    public readonly description: string,
    public readonly category: string,
    public readonly xpReward: number,
    public readonly unlockedAt: Date | null,
    public readonly isLocked: boolean
  ) {}
}
