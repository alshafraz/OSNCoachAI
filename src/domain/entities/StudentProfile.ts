export class StudentProfile {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly points: number,
    public readonly level: number,
    public readonly currentStreak: number,
    public readonly parentId?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}
}
