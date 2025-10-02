/**
 * Local Apollo Resolvers for Mock Data
 *
 * These resolvers provide the bridge between GraphQL operations and the mockDb.
 * They handle all CRUD operations locally during the prototyping phase.
 * When the backend is ready, these resolvers will be removed and Apollo will
 * connect directly to the NestJS GraphQL server.
 *
 * The resolver structure mirrors what the backend will implement, ensuring
 * a smooth transition with no changes to frontend components.
 *
 * IMPORTANT: This module can only be imported in server-side code!
 */

import 'server-only';
import { mockDb } from '../mockDb';
import { GraphQLScalarType, Kind } from 'graphql';

// Custom scalar for DateTime
const DateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'DateTime custom scalar type',
  serialize(value: any) {
    // Convert outgoing Date to ISO string for JSON
    return value instanceof Date ? value.toISOString() : value;
  },
  parseValue(value: any) {
    // Convert incoming ISO string to Date
    return typeof value === 'string' ? new Date(value) : value;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

// Custom scalar for JSON
const JSONScalar = new GraphQLScalarType({
  name: 'JSON',
  description: 'JSON custom scalar type',
  serialize(value: any) {
    return value; // JSON serialization happens automatically
  },
  parseValue(value: any) {
    return value; // Already parsed by JSON.parse
  },
  parseLiteral(ast) {
    switch (ast.kind) {
      case Kind.STRING:
        return JSON.parse(ast.value);
      case Kind.OBJECT:
        return parseObject(ast);
      default:
        return null;
    }
  },
});

// Helper function to parse GraphQL AST objects
function parseObject(ast: any): any {
  const value = Object.create(null);
  ast.fields.forEach((field: any) => {
    value[field.name.value] = parseLiteral(field.value);
  });
  return value;
}

function parseLiteral(ast: any): any {
  switch (ast.kind) {
    case Kind.STRING:
    case Kind.BOOLEAN:
      return ast.value;
    case Kind.INT:
    case Kind.FLOAT:
      return parseFloat(ast.value);
    case Kind.OBJECT:
      return parseObject(ast);
    case Kind.LIST:
      return ast.values.map(parseLiteral);
    default:
      return null;
  }
}

// Cache for date strings to avoid repeated Date object creation
const _currentDate = new Date().toISOString();
const _currentYear = new Date().getFullYear();

// Helper function to transform old educator data structure to new schema
function transformEducator(edu: any) {
  if (!edu) return null;

  try {
    // Handle both old format (name) and new format (firstName/lastName)
    let firstName = edu.firstName;
    let lastName = edu.lastName;

    if (!firstName && edu.name) {
      // Split name into firstName and lastName
      const nameParts = edu.name.split(' ');
      firstName = nameParts[0] || edu.name;
      lastName = nameParts.slice(1).join(' ') || '';
    }

    return {
      ...edu,
      firstName: firstName || 'Unknown',
      lastName: lastName || '',
      email: edu.email || edu.emailFallback || `${edu.id}@nextphoton.com`,
      subject: edu.subject || (edu.subjects && edu.subjects[0]) || 'General',
      qualifications: edu.qualifications || (edu.qualification ? [edu.qualification] : []),
      experience: edu.experience || edu.yearsWithNextPhoton || 0,
      bio: edu.bio || edu.intro || '',
      availability: edu.availability || {
        username: edu.username,
        levels: edu.levels,
        exams: edu.exams,
        priceTier: edu.priceTier,
        studentsTaught: edu.studentsTaught,
        hoursTaught: edu.hoursTaught,
        profileImage: edu.profileImage,
      },
      isActive: edu.isActive !== undefined ? edu.isActive : true,
      createdAt: edu.createdAt || _currentDate,
      updatedAt: edu.updatedAt || _currentDate,
    };
  } catch (error) {
    console.error('Error transforming educator:', edu?.id, error);
    return {
      id: edu?.id || 'unknown',
      firstName: 'Error',
      lastName: 'Loading',
      email: `${edu?.id || 'unknown'}@nextphoton.com`,
      subject: 'N/A',
      qualifications: [],
      experience: 0,
      bio: '',
      availability: null,
      isActive: true,
      createdAt: _currentDate,
      updatedAt: _currentDate,
    };
  }
}

// Helper function to transform old learner data structure to new schema
function transformLearner(learner: any) {
  if (!learner) return null;

  try {
    // Handle both old format (name) and new format (firstName/lastName)
    let firstName = learner.firstName;
    let lastName = learner.lastName;

    if (!firstName && learner.name) {
      // Split name into firstName and lastName
      const nameParts = learner.name.split(' ');
      firstName = nameParts[0] || learner.name;
      lastName = nameParts.slice(1).join(' ') || '';
    }

    const fullName = firstName && lastName ? `${firstName} ${lastName}` : firstName || learner.name || 'Unknown';

    // Extract guardianIds efficiently
    const guardianIds = learner.guardianIds ||
      (Array.isArray(learner.guardians) ? learner.guardians.map((g: any) => g.guardianId).filter(Boolean) : []);

    // Extract batchIds efficiently
    const batchIds = learner.batchIds || (learner.batchId ? [learner.batchId] : []);

    return {
      ...learner,
      // New GraphQL schema fields
      firstName: firstName || 'Unknown',
      lastName: lastName || '',
      email: learner.email || `${learner.id}@student.nextphoton.com`,
      phoneNumber: learner.phoneNumber || learner.phone || '',
      dateOfBirth: learner.dateOfBirth || null,
      grade: learner.grade || 'Not specified',
      enrollmentDate: learner.enrollmentDate || _currentDate,
      guardianIds,
      batchIds,
      profilePicture: learner.profilePicture || learner.profileImage || null,
      address: learner.address || {
        school: learner.school,
        board: learner.board,
        academicLevel: learner.academicLevel,
        targetExams: learner.targetExams,
        targetExamYear: learner.targetExamYear,
      },
      status: learner.status || 'active',
      isActive: learner.isActive !== undefined ? learner.isActive : true,
      createdAt: learner.createdAt || _currentDate,
      updatedAt: learner.updatedAt || _currentDate,
      // Backward compatibility fields (for UI components expecting old structure)
      name: fullName,
      username: learner.username || `@${firstName?.toLowerCase() || 'user'}`,
      phone: learner.phoneNumber || learner.phone || '',
      profileImage: learner.profilePicture || learner.profileImage || null,
      school: learner.address?.school || learner.school || 'Not specified',
      board: learner.address?.board || learner.board || 'Not specified',
      academicLevel: learner.address?.academicLevel || learner.academicLevel || 'Not specified',
      targetExams: learner.address?.targetExams || learner.targetExams || [],
      targetExamYear: learner.address?.targetExamYear || learner.targetExamYear || _currentYear,
      lastActive: learner.lastActive || _currentDate,
      guardians: learner.guardians || [],
      assignedEducators: learner.assignedEducators || [],
      attendance: learner.attendance || { overall: 0, lastMonth: 0 },
      performance: learner.performance || { averageScore: 0, lastTestScore: 0, trend: 'stable' },
      reviewedEducators: learner.reviewedEducators || [],
      learnerNotes: learner.learnerNotes || [],
      remarkTags: learner.remarkTags || [],
    };
  } catch (error) {
    console.error('Error transforming learner:', learner?.id, error);
    // Return a minimal valid learner object on error
    return {
      id: learner?.id || 'unknown',
      firstName: 'Error',
      lastName: 'Loading',
      name: 'Error Loading',
      email: `${learner?.id || 'unknown'}@student.nextphoton.com`,
      grade: 'N/A',
      enrollmentDate: _currentDate,
      guardianIds: [],
      batchIds: [],
      isActive: true,
      createdAt: _currentDate,
      updatedAt: _currentDate,
      username: '@error',
      phone: '',
      profileImage: null,
      school: 'N/A',
      board: 'N/A',
      academicLevel: 'N/A',
      targetExams: [],
      targetExamYear: _currentYear,
      guardians: [],
      assignedEducators: [],
      attendance: { overall: 0, lastMonth: 0 },
      performance: { averageScore: 0, lastTestScore: 0, trend: 'stable' },
      remarkTags: [],
    };
  }
}

// Cache for default objects to avoid repeated object creation
const _defaultPaymentInfo = {
  method: 'online',
  billingCycle: 'monthly',
  paymentStatus: 'pending',
  lastPaymentDate: _currentDate,
  nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
};

const _defaultCommPrefs = {
  academicUpdates: true,
  attendanceAlerts: true,
  performanceReports: true,
  paymentReminders: true,
  generalNotifications: true,
};

// Helper function to transform old guardian data structure to new schema
function transformGuardian(guardian: any) {
  if (!guardian) return null;

  try {
    // Handle both old format (name) and new format (firstName/lastName)
    let firstName = guardian.firstName;
    let lastName = guardian.lastName;

    if (!firstName && guardian.name) {
      // Split name into firstName and lastName
      const nameParts = guardian.name.split(' ');
      firstName = nameParts[0] || guardian.name;
      lastName = nameParts.slice(1).join(' ') || '';
    }

    // Extract nested data from address field if present (with null safety)
    const addressData = (typeof guardian.address === 'object' && guardian.address) || {};

    // Use cached defaults or extract from data
    const paymentInfoData = guardian.paymentInfo || addressData.paymentInfo || _defaultPaymentInfo;
    const commPrefsData = guardian.communicationPreferences || addressData.communicationPreferences || _defaultCommPrefs;
    const assignedLearnersData = Array.isArray(guardian.assignedLearners)
      ? guardian.assignedLearners
      : (Array.isArray(addressData.assignedLearners) ? addressData.assignedLearners : []);

    // Extract learnerIds efficiently
    const learnerIds = guardian.learnerIds ||
      (assignedLearnersData.length > 0 ? assignedLearnersData.map((l: any) => l.learnerId || l.id).filter(Boolean) : []);

    return {
      ...guardian,
      firstName: firstName || 'Unknown',
      lastName: lastName || '',
      email: guardian.email || `${guardian.id}@guardian.nextphoton.com`,
      phoneNumber: guardian.phoneNumber || guardian.phone || '',
      relationship: guardian.relationship || guardian.relation || 'Guardian',
      occupation: guardian.occupation || 'Not specified',
      address: guardian.address || null,
      emergencyContact: guardian.emergencyContact !== undefined ? guardian.emergencyContact : true,
      learnerIds,
      preferredContactMethod: guardian.preferredContactMethod || addressData.preferredContactMethod || 'phone',
      isActive: guardian.isActive !== undefined ? guardian.isActive : true,
      createdAt: guardian.createdAt || _currentDate,
      updatedAt: guardian.updatedAt || _currentDate,
      // Backward compatibility fields (for UI components expecting old structure)
      name: `${firstName} ${lastName}`.trim() || 'Unknown',
      relation: guardian.relationship || guardian.relation || 'Guardian',
      phone: guardian.phoneNumber || guardian.phone || '',
      assignedLearners: assignedLearnersData,
      paymentInfo: paymentInfoData,
      communicationPreferences: commPrefsData,
      lastInteraction: guardian.lastInteraction || _currentDate,
      profileImage: guardian.profileImage || null,
      preferredContactTime: guardian.preferredContactTime || addressData.preferredContactTime || 'Any time',
      notes: Array.isArray(guardian.notes) ? guardian.notes : [],
    };
  } catch (error) {
    console.error('Error transforming guardian:', guardian?.id, error);
    // Return a minimal valid guardian object on error
    return {
      id: guardian?.id || 'unknown',
      firstName: 'Error',
      lastName: 'Loading',
      name: 'Error Loading',
      email: `${guardian?.id || 'unknown'}@guardian.nextphoton.com`,
      phoneNumber: '',
      relationship: 'Guardian',
      occupation: 'N/A',
      address: null,
      emergencyContact: true,
      learnerIds: [],
      preferredContactMethod: 'phone',
      isActive: true,
      createdAt: _currentDate,
      updatedAt: _currentDate,
      relation: 'Guardian',
      phone: '',
      assignedLearners: [],
      paymentInfo: _defaultPaymentInfo,
      communicationPreferences: _defaultCommPrefs,
      lastInteraction: _currentDate,
      profileImage: null,
      preferredContactTime: 'Any time',
      notes: [],
    };
  }
}

// Resolver functions that interact with mockDb
export const resolvers = {
  // Custom scalars
  DateTime: DateTimeScalar,
  JSON: JSONScalar,

  Query: {
    // Educator queries
    educators: async () => {
      try {
        const educators = await mockDb.read('educators');
        // Transform old data structure to match GraphQL schema
        return educators.map((edu: any) => transformEducator(edu)).filter(Boolean);
      } catch (error) {
        console.error('Error fetching educators:', error);
        return [];
      }
    },
    educator: async (_: any, { id }: { id: string }) => {
      try {
        const educator = await mockDb.readById('educators', id);
        if (!educator) return null;
        // Transform old data structure to match GraphQL schema
        return transformEducator(educator);
      } catch (error) {
        console.error('Error fetching educator:', id, error);
        return null;
      }
    },
    educatorsBySubject: async (_: any, { subject }: { subject: string }) => {
      try {
        const educators = await mockDb.read('educators');
        return educators
          .filter((e: any) => e.subject === subject || e.subjects?.includes(subject))
          .map((edu: any) => transformEducator(edu))
          .filter(Boolean);
      } catch (error) {
        console.error('Error fetching educators by subject:', subject, error);
        return [];
      }
    },

    // Learner queries
    learners: async () => {
      try {
        const learners = await mockDb.read('learners');
        // Transform old data structure to match GraphQL schema
        return learners.map((learner: any) => transformLearner(learner)).filter(Boolean);
      } catch (error) {
        console.error('Error fetching learners:', error);
        return [];
      }
    },
    learner: async (_: any, { id }: { id: string }) => {
      try {
        const learner = await mockDb.readById('learners', id);
        if (!learner) return null;
        // Transform old data structure to match GraphQL schema
        return transformLearner(learner);
      } catch (error) {
        console.error('Error fetching learner:', id, error);
        return null;
      }
    },
    learnersByGrade: async (_: any, { grade }: { grade: string }) => {
      try {
        const learners = await mockDb.read('learners');
        return learners
          .filter((l: any) => l.grade === grade)
          .map((learner: any) => transformLearner(learner))
          .filter(Boolean);
      } catch (error) {
        console.error('Error fetching learners by grade:', grade, error);
        return [];
      }
    },
    learnersByBatch: async (_: any, { batchId }: { batchId: string }) => {
      try {
        const learners = await mockDb.read('learners');
        return learners
          .filter((l: any) => l.batchIds?.includes(batchId) || l.batchId === batchId)
          .map((learner: any) => transformLearner(learner))
          .filter(Boolean);
      } catch (error) {
        console.error('Error fetching learners by batch:', batchId, error);
        return [];
      }
    },

    // Guardian queries
    guardians: async () => {
      try {
        const guardians = await mockDb.read('guardians');
        // Transform old data structure to match GraphQL schema
        return guardians.map((guardian: any) => transformGuardian(guardian)).filter(Boolean);
      } catch (error) {
        console.error('Error fetching guardians:', error);
        return [];
      }
    },
    guardian: async (_: any, { id }: { id: string }) => {
      try {
        const guardian = await mockDb.readById('guardians', id);
        if (!guardian) return null;
        // Transform old data structure to match GraphQL schema
        return transformGuardian(guardian);
      } catch (error) {
        console.error('Error fetching guardian:', id, error);
        return null;
      }
    },
    guardiansByLearner: async (_: any, { learnerId }: { learnerId: string }) => {
      try {
        const guardians = await mockDb.read('guardians');
        return guardians
          .filter((g: any) => g.learnerIds?.includes(learnerId))
          .map((guardian: any) => transformGuardian(guardian))
          .filter(Boolean);
      } catch (error) {
        console.error('Error fetching guardians by learner:', learnerId, error);
        return [];
      }
    },

    // Employee queries
    employees: async () => {
      return await mockDb.read('employees');
    },
    employee: async (_: any, { id }: { id: string }) => {
      return await mockDb.readById('employees', id);
    },
    employeesByDepartment: async (_: any, { department }: { department: string }) => {
      const employees = await mockDb.read('employees');
      return employees.filter((e: any) => e.department === department);
    },

    // Intern queries
    interns: async () => {
      return await mockDb.read('interns');
    },
    intern: async (_: any, { id }: { id: string }) => {
      return await mockDb.readById('interns', id);
    },
    internsByDepartment: async (_: any, { department }: { department: string }) => {
      const interns = await mockDb.read('interns');
      return interns.filter((i: any) => i.department === department);
    },

    // Batch queries
    batches: async () => {
      return await mockDb.read('batches');
    },
    batch: async (_: any, { id }: { id: string }) => {
      return await mockDb.readById('batches', id);
    },
    batchesByEducator: async (_: any, { educatorId }: { educatorId: string }) => {
      const batches = await mockDb.read('batches');
      return batches.filter((b: any) => b.educatorId === educatorId);
    },
    activeBatches: async () => {
      const batches = await mockDb.read('batches');
      return batches.filter((b: any) => b.isActive === true);
    },

    // ClassSession queries
    classSessions: async () => {
      return await mockDb.read('class-sessions');
    },
    classSession: async (_: any, { id }: { id: string }) => {
      return await mockDb.readById('class-sessions', id);
    },
    sessionsByBatch: async (_: any, { batchId }: { batchId: string }) => {
      const sessions = await mockDb.read('class-sessions');
      return sessions.filter((s: any) => s.batchId === batchId);
    },
    upcomingSessions: async (_: any, { educatorId }: { educatorId?: string }) => {
      const sessions = await mockDb.read('class-sessions');
      const now = new Date().toISOString();
      let upcoming = sessions.filter((s: any) => s.date > now && !s.isCompleted);
      if (educatorId) {
        upcoming = upcoming.filter((s: any) => s.educatorId === educatorId);
      }
      return upcoming;
    },

    // Attendance queries
    attendanceRecords: async () => {
      return await mockDb.read('attendance');
    },
    attendance: async (_: any, { id }: { id: string }) => {
      return await mockDb.readById('attendance', id);
    },
    attendanceBySession: async (_: any, { sessionId }: { sessionId: string }) => {
      const records = await mockDb.read('attendance');
      return records.filter((a: any) => a.sessionId === sessionId);
    },
    attendanceByLearner: async (_: any, { learnerId }: { learnerId: string }) => {
      const records = await mockDb.read('attendance');
      return records.filter((a: any) => a.learnerId === learnerId);
    },

    // Assignment queries
    assignments: async () => {
      return await mockDb.read('assignments');
    },
    assignment: async (_: any, { id }: { id: string }) => {
      return await mockDb.readById('assignments', id);
    },
    assignmentsByBatch: async (_: any, { batchId }: { batchId: string }) => {
      const assignments = await mockDb.read('assignments');
      return assignments.filter((a: any) => a.batchId === batchId);
    },
    pendingAssignments: async (_: any, { batchId }: { batchId?: string }) => {
      const assignments = await mockDb.read('assignments');
      let pending = assignments.filter((a: any) => a.status === 'PENDING' || a.status === 'IN_PROGRESS');
      if (batchId) {
        pending = pending.filter((a: any) => a.batchId === batchId);
      }
      return pending;
    },

    // TestResult queries
    testResults: async () => {
      return await mockDb.read('test-results');
    },
    testResult: async (_: any, { id }: { id: string }) => {
      return await mockDb.readById('test-results', id);
    },
    testResultsByLearner: async (_: any, { learnerId }: { learnerId: string }) => {
      const results = await mockDb.read('test-results');
      return results.filter((t: any) => t.learnerId === learnerId);
    },
    testResultsByBatch: async (_: any, { batchId }: { batchId: string }) => {
      const results = await mockDb.read('test-results');
      return results.filter((t: any) => t.batchId === batchId);
    },

    // AcademicPlan queries
    academicPlans: async () => {
      return await mockDb.read('academic-plans');
    },
    academicPlan: async (_: any, { id }: { id: string }) => {
      return await mockDb.readById('academic-plans', id);
    },
    academicPlansByGrade: async (_: any, { grade }: { grade: string }) => {
      const plans = await mockDb.read('academic-plans');
      return plans.filter((p: any) => p.grade === grade);
    },

    // Communication queries
    communications: async () => {
      return await mockDb.read('communications');
    },
    communication: async (_: any, { id }: { id: string }) => {
      return await mockDb.readById('communications', id);
    },
    inbox: async (_: any, { recipientId }: { recipientId: string }) => {
      const messages = await mockDb.read('communications');
      return messages.filter((m: any) => m.recipientIds?.includes(recipientId));
    },
    sentMessages: async (_: any, { senderId }: { senderId: string }) => {
      const messages = await mockDb.read('communications');
      return messages.filter((m: any) => m.senderId === senderId);
    },
  },

  Mutation: {
    // Educator mutations
    createEducator: async (_: any, { input }: { input: any }) => {
      const newEducator = await mockDb.create('educators', {
        ...input,
        isActive: true,
      });
      // Transform the created educator to match GraphQL schema
      return transformEducator(newEducator);
    },
    updateEducator: async (_: any, { id, input }: { id: string; input: any }) => {
      const updated = await mockDb.update('educators', id, input);
      // Transform the updated educator to match GraphQL schema
      return transformEducator(updated);
    },
    deleteEducator: async (_: any, { id }: { id: string }) => {
      return await mockDb.delete('educators', id);
    },

    // Learner mutations
    createLearner: async (_: any, { input }: { input: any }) => {
      const newLearner = await mockDb.create('learners', {
        ...input,
        enrollmentDate: input.enrollmentDate || new Date().toISOString().split('T')[0],
        isActive: true,
        guardianIds: input.guardianIds || [],
        batchIds: input.batchIds || [],
      });
      // Transform the created learner to match GraphQL schema
      return transformLearner(newLearner);
    },
    updateLearner: async (_: any, { id, input }: { id: string; input: any }) => {
      const updated = await mockDb.update('learners', id, input);
      // Transform the updated learner to match GraphQL schema
      return transformLearner(updated);
    },
    deleteLearner: async (_: any, { id }: { id: string }) => {
      return await mockDb.delete('learners', id);
    },

    // Guardian mutations
    createGuardian: async (_: any, { input }: { input: any }) => {
      const newGuardian = await mockDb.create('guardians', {
        ...input,
        isActive: true,
        learnerIds: input.learnerIds || [],
      });
      // Transform the created guardian to match GraphQL schema
      return transformGuardian(newGuardian);
    },
    updateGuardian: async (_: any, { id, input }: { id: string; input: any }) => {
      const updated = await mockDb.update('guardians', id, input);
      // Transform the updated guardian to match GraphQL schema
      return transformGuardian(updated);
    },
    deleteGuardian: async (_: any, { id }: { id: string }) => {
      return await mockDb.delete('guardians', id);
    },

    // Batch mutations
    createBatch: async (_: any, { input }: { input: any }) => {
      return await mockDb.create('batches', {
        ...input,
        isActive: true,
        currentCapacity: input.learnerIds?.length || 0,
        learnerIds: input.learnerIds || [],
      });
    },
    updateBatch: async (_: any, { id, input }: { id: string; input: any }) => {
      if (input.learnerIds !== undefined) {
        input.currentCapacity = input.learnerIds.length;
      }
      return await mockDb.update('batches', id, input);
    },
    deleteBatch: async (_: any, { id }: { id: string }) => {
      return await mockDb.delete('batches', id);
    },

    // ClassSession mutations
    createClassSession: async (_: any, { input }: { input: any }) => {
      return await mockDb.create('class-sessions', {
        ...input,
        isCompleted: false,
        attendanceMarked: false,
      });
    },
    updateClassSession: async (_: any, { id, input }: { id: string; input: any }) => {
      return await mockDb.update('class-sessions', id, input);
    },
    deleteClassSession: async (_: any, { id }: { id: string }) => {
      return await mockDb.delete('class-sessions', id);
    },

    // Attendance mutations
    createAttendance: async (_: any, { input }: { input: any }) => {
      return await mockDb.create('attendance', {
        ...input,
        parentNotified: input.parentNotified ?? false,
      });
    },
    updateAttendance: async (_: any, { id, input }: { id: string; input: any }) => {
      return await mockDb.update('attendance', id, input);
    },
    markBulkAttendance: async (_: any, { sessionId, attendanceData }: { sessionId: string; attendanceData: any[] }) => {
      const records = [];
      for (const data of attendanceData) {
        const record = await mockDb.create('attendance', {
          ...data,
          sessionId,
          parentNotified: data.parentNotified ?? false,
        });
        records.push(record);
      }
      // Update session to mark attendance as completed
      await mockDb.update('class-sessions', sessionId, { attendanceMarked: true });
      return records;
    },

    // Assignment mutations
    createAssignment: async (_: any, { input }: { input: any }) => {
      return await mockDb.create('assignments', {
        ...input,
        status: 'PENDING',
        submissions: {},
      });
    },
    updateAssignment: async (_: any, { id, input }: { id: string; input: any }) => {
      return await mockDb.update('assignments', id, input);
    },
    deleteAssignment: async (_: any, { id }: { id: string }) => {
      return await mockDb.delete('assignments', id);
    },

    // TestResult mutations
    createTestResult: async (_: any, { input }: { input: any }) => {
      return await mockDb.create('test-results', input);
    },
    updateTestResult: async (_: any, { id, input }: { id: string; input: any }) => {
      return await mockDb.update('test-results', id, input);
    },
    deleteTestResult: async (_: any, { id }: { id: string }) => {
      return await mockDb.delete('test-results', id);
    },

    // Communication mutations
    createCommunication: async (_: any, { input }: { input: any }) => {
      return await mockDb.create('communications', {
        ...input,
        isRead: false,
        readBy: {},
        sentAt: input.scheduledAt || new Date().toISOString(),
      });
    },
    updateCommunication: async (_: any, { id, input }: { id: string; input: any }) => {
      return await mockDb.update('communications', id, input);
    },
    markAsRead: async (_: any, { id, userId }: { id: string; userId: string }) => {
      const communication = await mockDb.readById('communications', id);
      if (!communication) throw new Error('Communication not found');

      const readBy = communication.readBy || {};
      readBy[userId] = new Date().toISOString();

      return await mockDb.update('communications', id, {
        isRead: true,
        readBy,
      });
    },
    deleteCommunication: async (_: any, { id }: { id: string }) => {
      return await mockDb.delete('communications', id);
    },
  },

  // Field resolvers for relationships (these will be resolved on-demand)
  Educator: {
    classSessions: async (parent: any) => {
      const sessions = await mockDb.read('class-sessions');
      return sessions.filter((s: any) => s.educatorId === parent.id);
    },
    assignments: async (parent: any) => {
      const assignments = await mockDb.read('assignments');
      return assignments.filter((a: any) => a.educatorId === parent.id);
    },
    batches: async (parent: any) => {
      const batches = await mockDb.read('batches');
      return batches.filter((b: any) => b.educatorId === parent.id);
    },
  },

  Learner: {
    guardians: async (parent: any) => {
      if (!parent.guardianIds?.length) return [];
      const guardians = await mockDb.read('guardians');
      return guardians.filter((g: any) => parent.guardianIds.includes(g.id));
    },
    batches: async (parent: any) => {
      if (!parent.batchIds?.length) return [];
      const batches = await mockDb.read('batches');
      return batches.filter((b: any) => parent.batchIds.includes(b.id));
    },
    attendance: async (parent: any) => {
      const records = await mockDb.read('attendance');
      return records.filter((a: any) => a.learnerId === parent.id);
    },
    testResults: async (parent: any) => {
      const results = await mockDb.read('test-results');
      return results.filter((t: any) => t.learnerId === parent.id);
    },
  },

  Guardian: {
    learners: async (parent: any) => {
      if (!parent.learnerIds?.length) return [];
      const learners = await mockDb.read('learners');
      return learners.filter((l: any) => parent.learnerIds.includes(l.id));
    },
  },

  Employee: {
    manager: async (parent: any) => {
      if (!parent.managerId) return null;
      return await mockDb.readById('employees', parent.managerId);
    },
    subordinates: async (parent: any) => {
      const employees = await mockDb.read('employees');
      return employees.filter((e: any) => e.managerId === parent.id);
    },
  },

  Intern: {
    mentor: async (parent: any) => {
      if (!parent.mentorId) return null;
      return await mockDb.readById('employees', parent.mentorId);
    },
  },

  Batch: {
    educator: async (parent: any) => {
      return await mockDb.readById('educators', parent.educatorId);
    },
    learners: async (parent: any) => {
      if (!parent.learnerIds?.length) return [];
      const learners = await mockDb.read('learners');
      return learners.filter((l: any) => parent.learnerIds.includes(l.id));
    },
    classSessions: async (parent: any) => {
      const sessions = await mockDb.read('class-sessions');
      return sessions.filter((s: any) => s.batchId === parent.id);
    },
  },

  ClassSession: {
    batch: async (parent: any) => {
      return await mockDb.readById('batches', parent.batchId);
    },
    educator: async (parent: any) => {
      return await mockDb.readById('educators', parent.educatorId);
    },
    attendance: async (parent: any) => {
      const records = await mockDb.read('attendance');
      return records.filter((a: any) => a.sessionId === parent.id);
    },
  },

  Attendance: {
    session: async (parent: any) => {
      return await mockDb.readById('class-sessions', parent.sessionId);
    },
    learner: async (parent: any) => {
      return await mockDb.readById('learners', parent.learnerId);
    },
  },

  Assignment: {
    batch: async (parent: any) => {
      return await mockDb.readById('batches', parent.batchId);
    },
    educator: async (parent: any) => {
      return await mockDb.readById('educators', parent.educatorId);
    },
  },

  TestResult: {
    learner: async (parent: any) => {
      return await mockDb.readById('learners', parent.learnerId);
    },
    batch: async (parent: any) => {
      return await mockDb.readById('batches', parent.batchId);
    },
  },
};