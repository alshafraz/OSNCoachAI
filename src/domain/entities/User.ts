export type UserRole = 'PARENT' | 'STUDENT';

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly role: UserRole,
    public readonly name?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}
}
