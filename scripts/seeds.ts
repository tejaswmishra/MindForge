import { db } from '@/lib/database';
import { users, syllabi, quiz, questions } from 'drizzle/schema';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Add seed data here if needed for development
    console.log('✅ Database seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  seed();
}