import { prisma } from './index';

/**
 * Prisma Database Connection Test
 * 
 * This file contains test utilities to verify that the Prisma client
 * has been properly generated and can connect to the database.
 * 
 * Usage:
 * - Run during development to verify database setup
 * - Use in CI/CD to validate database connectivity
 * - Debug Prisma client generation issues
 * 
 * Commands to run this test:
 * - From root: npm run test:db
 * - Direct: npx tsx shared/db/test-connection.ts
 * - Node: node --loader ts-node/esm shared/db/test-connection.ts
 */

/**
 * Test basic Prisma client functionality and database connection
 */
async function testPrismaConnection() {
  console.log('\n🧪 === Prisma Database Connection Test ===');
  console.log("📂 Current Working Directory:", process.cwd());
  console.log("🔍 DATABASE_URL configured:", !!process.env.DATABASE_URL);
  console.log("🗄️ Database URL (masked):", process.env.DATABASE_URL?.replace(/\/\/.*@/, '//***:***@'));

  try {
    // Test 1: Basic connection
    console.log('\n📡 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Test 2: Schema validation - check if User model exists
    console.log('\n🔍 Testing Prisma client generation...');
    const userCount = await prisma.user.count();
    console.log(`✅ Prisma client working - User table accessible (${userCount} users found)`);

    // Test 3: Fetch sample users (if any exist)
    console.log('\n👥 Fetching sample users...');
    const users = await prisma.user.findMany({
      take: 3,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      }
    });

    if (users.length > 0) {
      console.log(`✅ Found ${users.length} users in database:`);
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.name} (${user.email}) - ${user.id}`);
      });
    } else {
      console.log('ℹ️  No users found in database (this is normal for a fresh setup)');
    }

    // Test 4: Check other Better-auth models
    console.log('\n🔐 Testing Better-auth models...');
    const sessionCount = await prisma.session.count();
    const accountCount = await prisma.account.count();
    const verificationCount = await prisma.verification.count();
    
    console.log(`✅ Sessions: ${sessionCount}`);
    console.log(`✅ Accounts: ${accountCount}`);
    console.log(`✅ Verifications: ${verificationCount}`);

    console.log('\n🎉 All Prisma tests passed successfully!');
    
  } catch (error) {
    console.error('\n❌ Prisma test failed:');
    console.error('Error details:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('connect')) {
        console.error('\n💡 Troubleshooting tips:');
        console.error('   1. Check if DATABASE_URL is correctly set in .env');
        console.error('   2. Verify database server is running');
        console.error('   3. Check network connectivity to database');
        console.error('   4. Validate database credentials');
      } else if (error.message.includes('does not exist')) {
        console.error('\n💡 Troubleshooting tips:');
        console.error('   1. Run: npm run prisma:push');
        console.error('   2. Check if schema.prisma is correct');
        console.error('   3. Verify database migration status');
      }
    }
    
    throw error;
  }
}

/**
 * Test Prisma client performance with a simple benchmark
 */
async function testPrismaPerformance() {
  console.log('\n⚡ === Prisma Performance Test ===');
  
  const start = Date.now();
  
  // Run 10 simple queries to test connection pooling
  const promises = Array.from({ length: 10 }, () => 
    prisma.user.count()
  );
  
  await Promise.all(promises);
  
  const duration = Date.now() - start;
  console.log(`✅ 10 concurrent queries completed in ${duration}ms`);
  console.log(`📊 Average query time: ${duration / 10}ms`);
}

/**
 * Main test runner
 */
async function main() {
  try {
    await testPrismaConnection();
    await testPrismaPerformance();
    
    console.log('\n🏆 All database tests completed successfully!');
    console.log('🚀 Prisma client is ready for use in your application');
    
  } catch (error) {
    console.error('\n💥 Database tests failed');
    process.exit(1);
  } finally {
    // Ensure clean shutdown
    await prisma.$disconnect();
    console.log('\n🔌 Database connection closed');
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

// Export test functions for use in other test files
export {
  testPrismaConnection,
  testPrismaPerformance,
  main as runAllTests
};