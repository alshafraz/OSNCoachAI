require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding MathOSN database...');

  // 1. Clean existing records
  await prisma.attempt.deleteMany().catch(() => {});
  await prisma.question.deleteMany().catch(() => {});
  await prisma.studentProfile.deleteMany().catch(() => {});
  await prisma.user.deleteMany().catch(() => {});

  console.log('Cleaned existing records.');

  const passwordHash = await bcrypt.hash('password', 10);

  // 2. Create Parent user
  const parent = await prisma.user.create({
    data: {
      email: 'parent@mathosn.com',
      passwordHash: passwordHash,
      role: 'PARENT',
      name: 'Sarah Mercer',
    },
  });

  // 3. Create Student user
  const student = await prisma.user.create({
    data: {
      email: 'student@mathosn.com',
      passwordHash: passwordHash,
      role: 'STUDENT',
      name: 'Toby Mercer',
    },
  });

  // 4. Create Student Profile linked to Parent
  await prisma.studentProfile.create({
    data: {
      userId: student.id,
      parentId: parent.id,
      points: 120,
      level: 1,
      currentStreak: 3,
    },
  });

  console.log('Users and student profiles seeded.');

  // 5. Seed OSN Questions
  const questions = [
    {
      title: "Divisibility Secrets",
      body: "A three-digit number 2A3 is added to 326, giving a three-digit number 5B9. If 5B9 is divisible by 9, what is the value of A + B?",
      difficulty: "MEDIUM",
      topic: "Number Theory",
      correctAnswer: "6",
      explanation: "Since 2A3 + 326 = 5B9, looking at the units: 3+6=9. In the hundreds place: 2+3=5. Thus, in the tens place: A+2=B (with no carry over).\n\nSince 5B9 is divisible by 9, the sum of its digits (5 + B + 9) must be a multiple of 9. Therefore, 14 + B is a multiple of 9.\n\nSince B is a single digit (from 0 to 9), B must be 4.\n\nUsing A+2=B, we get A+2=4, so A=2.\n\nTherefore, A + B = 2 + 4 = 6."
    },
    {
      title: "Angle Chasing in Triangles",
      body: "In a triangle ABC, the angle A is 40 degrees. If the bisectors of angle B and C intersect at point I, what is the measure of angle BIC in degrees?",
      difficulty: "MEDIUM",
      topic: "Geometry",
      correctAnswer: "110",
      explanation: "In any triangle ABC, the sum of the angles is 180 degrees. So, A + B + C = 180. Given that A = 40 degrees, we have:\nB + C = 180 - 40 = 140 degrees.\n\nThe line segments BI and CI bisect angles B and C respectively. Therefore, in triangle BIC:\nangle IBC = B / 2\nangle ICB = C / 2\n\nThe sum of angles in triangle BIC is:\nangle BIC + angle IBC + angle ICB = 180\nangle BIC + (B / 2) + (C / 2) = 180\nangle BIC + (B + C) / 2 = 180\n\nSubstitute B + C = 140 into the equation:\nangle BIC + 140 / 2 = 180\nangle BIC + 70 = 180\nangle BIC = 110 degrees."
    },
    {
      title: "Olympiad Handshake Puzzle",
      body: "At a Math Olympiad camp meeting, 8 students greet each other by shaking hands exactly once with every other student. How many handshakes take place in total?",
      difficulty: "EASY",
      topic: "Combinatorics",
      correctAnswer: "28",
      explanation: "This is a combination problem where we need to choose 2 students out of 8 to shake hands. The order does not matter.\n\nUsing the combination formula C(n, k) = n! / (k!(n-k)!), with n = 8 and k = 2:\n\nC(8, 2) = (8 * 7) / (2 * 1) = 56 / 2 = 28.\n\nAlternatively, student 1 shakes hands with 7 others, student 2 shakes hands with 6 others (excluding student 1), and so on. The total sum is:\n7 + 6 + 5 + 4 + 3 + 2 + 1 = 28 handshakes."
    }
  ];

  for (const q of questions) {
    await prisma.question.create({
      data: q
    });
  }

  console.log('Math OSN questions seeded successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error('Error during seeding:', e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
