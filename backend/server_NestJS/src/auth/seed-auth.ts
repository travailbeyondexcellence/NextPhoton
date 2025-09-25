/**
 * Authentication Seed Script
 * 
 * This script populates the database with:
 * 1. Default roles (admin, educator, learner, etc.)
 * 2. Basic permissions
 * 3. Dummy users for testing
 * 
 * WARNING: This script is for development only!
 * Never run this in production environments.
 */

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

/**
 * Generate a unique ID for database records
 */
function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create default roles in the system
 */
async function seedRoles() {
  console.log('🔧 Creating default roles...');

  const roles = [
    {
      name: 'admin',
      displayName: 'Administrator',
      description: 'Full system access and management capabilities',
      isDefault: false,
    },
    {
      name: 'educator',
      displayName: 'Educator',
      description: 'Teaching professionals providing educational services',
      isDefault: false,
    },
    {
      name: 'learner',
      displayName: 'Learner',
      description: 'Students enrolled in educational programs',
      isDefault: true,
    },
    {
      name: 'guardian',
      displayName: 'Guardian',
      description: 'Parents or guardians monitoring learner progress',
      isDefault: false,
    },
    {
      name: 'ecm',
      displayName: 'EduCare Manager',
      description: 'Managers overseeing educational care and coordination',
      isDefault: false,
    },
    {
      name: 'employee',
      displayName: 'Employee',
      description: 'Staff members managing platform operations',
      isDefault: false,
    },
    {
      name: 'intern',
      displayName: 'Intern',
      description: 'Interns assisting with various platform activities',
      isDefault: false,
    },
  ];

  for (const role of roles) {
    try {
      // Check if role already exists
      const existingRole = await prisma.role.findUnique({
        where: { name: role.name },
      });

      if (!existingRole) {
        await prisma.role.create({
          data: {
            id: generateId(),
            ...role,
            isActive: true,
          },
        });
        console.log(`✅ Created role: ${role.displayName}`);
      } else {
        console.log(`ℹ️  Role already exists: ${role.displayName}`);
      }
    } catch (error) {
      console.error(`❌ Error creating role ${role.name}:`, error);
    }
  }
}

/**
 * Create basic permissions in the system
 */
async function seedPermissions() {
  console.log('🔧 Creating basic permissions...');

  const permissions = [
    // User permissions
    { resource: 'users', action: 'create', description: 'Create new users' },
    { resource: 'users', action: 'read', description: 'View user information' },
    { resource: 'users', action: 'update', description: 'Update user information' },
    { resource: 'users', action: 'delete', description: 'Delete users' },
    
    // Session permissions
    { resource: 'sessions', action: 'create', description: 'Create learning sessions' },
    { resource: 'sessions', action: 'read', description: 'View session information' },
    { resource: 'sessions', action: 'update', description: 'Update session details' },
    { resource: 'sessions', action: 'delete', description: 'Cancel sessions' },
    
    // Curriculum permissions
    { resource: 'curriculum', action: 'create', description: 'Create curriculum content' },
    { resource: 'curriculum', action: 'read', description: 'View curriculum' },
    { resource: 'curriculum', action: 'update', description: 'Modify curriculum' },
    { resource: 'curriculum', action: 'delete', description: 'Remove curriculum' },
    
    // Analytics permissions
    { resource: 'analytics', action: 'read', description: 'View analytics and reports' },
    { resource: 'analytics', action: 'export', description: 'Export analytics data' },
  ];

  for (const permission of permissions) {
    try {
      // Check if permission already exists
      const existingPermission = await prisma.permission.findUnique({
        where: {
          resource_action: {
            resource: permission.resource,
            action: permission.action,
          },
        },
      });

      if (!existingPermission) {
        await prisma.permission.create({
          data: {
            id: generateId(),
            ...permission,
          },
        });
        console.log(`✅ Created permission: ${permission.resource}:${permission.action}`);
      } else {
        console.log(`ℹ️  Permission already exists: ${permission.resource}:${permission.action}`);
      }
    } catch (error) {
      console.error(`❌ Error creating permission ${permission.resource}:${permission.action}:`, error);
    }
  }
}

/**
 * Create role-specific profile based on the role
 */
async function createRoleProfile(tx: any, userId: string, role: string, userName: string) {
  // Split the full name into first and last name
  const nameParts = userName.split(' ');
  const firstName = nameParts[0] || 'First';
  const lastName = nameParts.slice(1).join(' ') || 'Name';
  
  const profileData = {
    id: generateId(),
    userId,
    firstName,
    lastName,
    phoneNumber: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  switch (role.toLowerCase()) {
    case 'learner':
      await tx.learnerProfile.create({
        data: {
          ...profileData,
          dateOfBirth: new Date('2008-01-01'), // Sample date for learner
          currentGrade: 'Grade 10',
          school: 'NextPhoton Academy',
          learningStyle: 'visual',
          preferredLanguage: 'English',
          subjects: ['Mathematics', 'Science', 'English'],
          targetExams: ['JEE', 'SAT'],
        },
      });
      break;

    case 'guardian':
      await tx.guardianProfile.create({
        data: {
          ...profileData,
          relationship: 'Parent',
          occupation: 'Professional',
        },
      });
      break;

    case 'educator':
      await tx.educatorProfile.create({
        data: {
          ...profileData,
          dateOfBirth: new Date('1985-01-01'),
          qualifications: ['B.Ed', 'M.Sc'],
          specializations: ['Mathematics', 'Physics'],
          experience: 5,
          documentsUploaded: [],
          languages: ['English'],
          availableTimings: { monday: '9-5', tuesday: '9-5' },
        },
      });
      break;

    case 'ecm':
      await tx.eCMProfile.create({
        data: {
          ...profileData,
          department: 'Education Management',
          specialization: ['K-12', 'Special Education'],
          experience: 5,
        },
      });
      break;

    case 'employee':
      await tx.employeeProfile.create({
        data: {
          ...profileData,
          employeeId: `EMP${Date.now()}`,
          department: 'Operations',
          position: 'Platform Manager',
          joiningDate: new Date(),
        },
      });
      break;

    case 'intern':
      await tx.internProfile.create({
        data: {
          ...profileData,
          institution: 'Tech University',
          course: 'Computer Science',
          year: '3',
          department: 'Engineering',
          internshipType: 'full-time',
          mentorId: null,
          startDate: new Date(),
          endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        },
      });
      break;

    case 'admin':
      await tx.adminProfile.create({
        data: {
          ...profileData,
          adminLevel: 'platform',
        },
      });
      break;

    default:
      console.warn(`No profile template for role: ${role}`);
  }
}

/**
 * Create dummy users from the JSON file
 */
async function seedUsers() {
  console.log('🔧 Creating dummy users...');

  // Read the dummy users JSON file
  const dummyUsersPath = path.join(__dirname, 'dummy-users.json');
  const dummyUsersData = JSON.parse(fs.readFileSync(dummyUsersPath, 'utf-8'));
  const users = dummyUsersData.users;

  for (const userData of users) {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        console.log(`ℹ️  User already exists: ${userData.email}`);
        continue;
      }

      // Get the role
      const role = await prisma.role.findUnique({
        where: { name: userData.role },
      });

      if (!role) {
        console.error(`❌ Role not found: ${userData.role}`);
        continue;
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Create user with account and role in a transaction
      await prisma.$transaction(async (tx) => {
        // Create the user
        const user = await tx.user.create({
          data: {
            id: generateId(),
            email: userData.email,
            name: userData.name,
            emailVerified: true, // Set to true for test users
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        // Create the email/password account
        await tx.account.create({
          data: {
            id: generateId(),
            userId: user.id,
            accountId: userData.email,
            providerId: 'email',
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        // Assign the role to the user
        await tx.userRole.create({
          data: {
            id: generateId(),
            userId: user.id,
            roleId: role.id,
            assignedAt: new Date(),
            assignedBy: 'seed-script',
          },
        });

        // Create role-specific profile
        await createRoleProfile(tx, user.id, userData.role, userData.name);

        console.log(`✅ Created user: ${userData.name} (${userData.email}) - Role: ${userData.role}`);
      });
    } catch (error) {
      console.error(`❌ Error creating user ${userData.email}:`, error);
    }
  }
}

/**
 * Main seed function
 */
async function main() {
  console.log('🚀 Starting authentication seed script...');
  console.log('⚠️  WARNING: This script is for development only!');
  console.log('');

  try {
    // Seed roles first
    await seedRoles();
    console.log('');

    // Seed permissions
    await seedPermissions();
    console.log('');

    // Seed users
    await seedUsers();
    console.log('');

    console.log('✨ Seeding completed successfully!');
    console.log('');
    console.log('📝 Test Credentials:');
    console.log('Admin: admin@nextphoton.com / Admin@123456');
    console.log('Educator: john.educator@nextphoton.com / Educator@123');
    console.log('Learner: mike.learner@nextphoton.com / Learner@123');
    console.log('Guardian: robert.guardian@nextphoton.com / Guardian@123');
    console.log('ECM: sarah.ecm@nextphoton.com / EcManager@123');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed script
main()
  .catch((error) => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });