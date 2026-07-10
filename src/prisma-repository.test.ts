import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import assert from 'assert';

const testDbPath = path.join(process.cwd(), 'test.db');

import { User } from './domain/entities/User';
import { StudentProfile } from './domain/entities/StudentProfile';
import { Question } from './domain/entities/Question';
import { Attempt } from './domain/entities/Attempt';

async function runTests() {
  console.log('Setting up integration test database...');
  try {
    // Set test environment database URL before importing anything else
    process.env.DATABASE_URL = `file:${testDbPath}`;

    // Clean any old test database files
    const filesToClean = [
      testDbPath,
      `${testDbPath}-journal`,
      `${testDbPath}-wal`,
      `${testDbPath}-shm`
    ];
    for (const f of filesToClean) {
      if (fs.existsSync(f)) {
        fs.unlinkSync(f);
      }
    }

    // Push the schema to test.db
    execSync('npx.cmd prisma db push --accept-data-loss', { stdio: 'inherit' });
    console.log('Test database schema successfully pushed.');

    // Dynamically import repositories to ensure process.env.DATABASE_URL is set first
    const { PrismaUserRepository } = await import('./infrastructure/repositories/PrismaUserRepository');
    const { PrismaQuestionRepository } = await import('./infrastructure/repositories/PrismaQuestionRepository');

    const userRepo = new PrismaUserRepository();
    const questionRepo = new PrismaQuestionRepository();

    console.log('\n--- Running PrismaUserRepository Tests ---');

    // 1. Create Parent User
    const parentUser = await userRepo.create(
      new User('', 'parent-test@mathosn.com', 'hashed_pw', 'PARENT', 'Sarah Test')
    );
    assert.ok(parentUser.id, 'Parent User should have generated id');
    assert.strictEqual(parentUser.email, 'parent-test@mathosn.com');
    assert.strictEqual(parentUser.role, 'PARENT');
    assert.strictEqual(parentUser.name, 'Sarah Test');
    console.log('✔ PASS: Create Parent User');

    // 2. Create Student User
    const studentUser = await userRepo.create(
      new User('', 'student-test@mathosn.com', 'hashed_pw_student', 'STUDENT', 'Toby Test')
    );
    assert.ok(studentUser.id, 'Student User should have generated id');
    assert.strictEqual(studentUser.email, 'student-test@mathosn.com');
    assert.strictEqual(studentUser.role, 'STUDENT');
    console.log('✔ PASS: Create Student User');

    // 3. Find User by ID and Email
    const foundById = await userRepo.findById(studentUser.id);
    assert.ok(foundById);
    assert.strictEqual(foundById.email, 'student-test@mathosn.com');

    const foundByEmail = await userRepo.findByEmail('parent-test@mathosn.com');
    assert.ok(foundByEmail);
    assert.strictEqual(foundByEmail.id, parentUser.id);
    console.log('✔ PASS: Find User by ID / Email');

    // 4. Update User
    const updatedUser = await userRepo.updateUser(studentUser.id, {
      name: 'Toby Updated',
      email: 'student-updated@mathosn.com'
    });
    assert.strictEqual(updatedUser.name, 'Toby Updated');
    assert.strictEqual(updatedUser.email, 'student-updated@mathosn.com');
    console.log('✔ PASS: Update User details');

    // 5. Create Student Profile
    const profile = await userRepo.createStudentProfile(
      new StudentProfile('', studentUser.id, 50, 1, 2, parentUser.id)
    );
    assert.ok(profile.id, 'Profile should have generated id');
    assert.strictEqual(profile.userId, studentUser.id);
    assert.strictEqual(profile.points, 50);
    assert.strictEqual(profile.currentStreak, 2);
    assert.strictEqual(profile.parentId, parentUser.id);
    console.log('✔ PASS: Create Student Profile');

    // 6. Find Student Profile
    const profileByUserId = await userRepo.findStudentProfileByUserId(studentUser.id);
    assert.ok(profileByUserId);
    assert.strictEqual(profileByUserId.id, profile.id);

    const profileById = await userRepo.findStudentProfileById(profile.id);
    assert.ok(profileById);
    assert.strictEqual(profileById.points, 50);
    console.log('✔ PASS: Find Student Profile by User ID / Profile ID');

    // 7. Update Student points and streak (Check automatic level up logic)
    const updatedProfile = await userRepo.updateStudentPointsAndStreak(profile.id, 150, 4);
    assert.strictEqual(updatedProfile.points, 150);
    assert.strictEqual(updatedProfile.currentStreak, 4);
    assert.strictEqual(updatedProfile.level, 2, 'Level should calculate as points/100 + 1 (150/100 + 1 = 2)');
    console.log('✔ PASS: Update Student Points, Streak, and Level Calculation');

    // 8. Find Students by Parent ID
    const parentStudents = await userRepo.findStudentsByParentId(parentUser.id);
    assert.strictEqual(parentStudents.length, 1);
    assert.strictEqual(parentStudents[0].id, profile.id);
    console.log('✔ PASS: Find Students by Parent ID');


    console.log('\n--- Running PrismaQuestionRepository Tests ---');

    // 1. Create Multiple Choice Question
    const mcq = await questionRepo.create(
      new Question(
        '',
        'Divisibility test',
        'Is 12345 divisible by 3?',
        'EASY',
        'Number Theory',
        'Yes',
        'Sum of digits is 15, which is divisible by 3.',
        'MULTIPLE_CHOICE',
        ['Yes', 'No', 'Maybe', 'None'],
        undefined,
        'Add the digits',
        'OSN Primary 2024',
        ['divisibility', 'arithmetic']
      )
    );
    assert.ok(mcq.id, 'Question should have a generated id');
    assert.strictEqual(mcq.title, 'Divisibility test');
    assert.deepStrictEqual(mcq.options, ['Yes', 'No', 'Maybe', 'None'], 'Options array should be preserved');
    assert.deepStrictEqual(mcq.tags, ['divisibility', 'arithmetic'], 'Tags array should be preserved');
    console.log('✔ PASS: Create Question (preserving arrays as JSON strings)');

    // 2. Find Question by ID & Find All
    const foundQuestion = await questionRepo.findById(mcq.id);
    assert.ok(foundQuestion);
    assert.strictEqual(foundQuestion.title, 'Divisibility test');
    assert.deepStrictEqual(foundQuestion.options, ['Yes', 'No', 'Maybe', 'None']);

    const allQuestions = await questionRepo.findAll();
    assert.strictEqual(allQuestions.length, 1);
    assert.strictEqual(allQuestions[0].id, mcq.id);
    console.log('✔ PASS: Find Question by ID / Find All');

    // 3. Paged Queries and Filters
    const pagedRes = await questionRepo.findPaged({
      page: 1,
      limit: 10,
      search: 'divisible',
      topic: 'Number Theory',
      difficulty: 'EASY',
      source: 'OSN Primary'
    });
    assert.strictEqual(pagedRes.total, 1);
    assert.strictEqual(pagedRes.questions[0].id, mcq.id);
    console.log('✔ PASS: Find Paged with search, topic, difficulty, and source filters');

    // 4. Update Question (updating tags and options)
    const updatedQuestion = await questionRepo.update(mcq.id, {
      title: 'Divisibility test updated',
      options: ['Yes', 'No'],
      tags: ['divisibility']
    });
    assert.strictEqual(updatedQuestion.title, 'Divisibility test updated');
    assert.deepStrictEqual(updatedQuestion.options, ['Yes', 'No']);
    assert.deepStrictEqual(updatedQuestion.tags, ['divisibility']);
    console.log('✔ PASS: Update Question fields and arrays');

    // 5. Save and Find Attempts
    const attempt = await questionRepo.saveAttempt({
      studentProfileId: profile.id,
      questionId: mcq.id,
      studentAnswer: 'Yes',
      isCorrect: true,
      coachConversation: { chat: 'Good job!' }
    });
    assert.ok(attempt.id);
    assert.strictEqual(attempt.studentAnswer, 'Yes');
    assert.strictEqual(attempt.isCorrect, true);

    const studentAttempts = await questionRepo.findAttemptsByStudentId(profile.id);
    assert.strictEqual(studentAttempts.length, 1);
    assert.strictEqual(studentAttempts[0].id, attempt.id);
    console.log('✔ PASS: Save and Find Attempts');

    // 6. Delete Question
    const deleteRes = await questionRepo.delete(mcq.id);
    assert.strictEqual(deleteRes, true);
    const checkDeleted = await questionRepo.findById(mcq.id);
    assert.strictEqual(checkDeleted, null);
    console.log('✔ PASS: Delete Question');

    console.log('\n================================');
    console.log('\x1b[32mAll Prisma Repository Tests Passed Successfully!\x1b[0m');

  } catch (err) {
    console.error('\n❌ Test execution failed with error:', err);
    process.exit(1);
  } finally {
    // Clean up test database files
    try {
      const filesToClean = [
        testDbPath,
        `${testDbPath}-journal`,
        `${testDbPath}-wal`,
        `${testDbPath}-shm`
      ];
      for (const f of filesToClean) {
        if (fs.existsSync(f)) {
          fs.unlinkSync(f);
        }
      }
      console.log('Cleanup completed: test database files removed.');
    } catch (cleanErr) {
      console.error('Failed to clean up test database files:', cleanErr);
    }
  }
}

runTests();
