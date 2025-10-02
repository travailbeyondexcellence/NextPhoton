/**
 * GraphQL Type Definitions for Local Apollo Client
 *
 * This file defines the complete GraphQL schema for the frontend-only Apollo setup.
 * These type definitions mirror what will eventually be implemented in the NestJS backend,
 * allowing seamless transition from local mock data to real GraphQL endpoints.
 *
 * The schema follows the NextPhoton data model and includes all entities needed
 * for the rapid prototyping phase. When backend is ready, only the Apollo client
 * configuration needs to change - all queries and mutations remain the same.
 */

import { gql } from '@apollo/client';

export const typeDefs = gql`
  # Scalar types for common fields
  scalar DateTime
  scalar JSON

  # Enum for user roles in the system
  enum UserRole {
    LEARNER
    GUARDIAN
    EDUCATOR
    ECM
    EMPLOYEE
    INTERN
    ADMIN
  }

  # Enum for communication types
  enum CommunicationType {
    ANNOUNCEMENT
    MESSAGE
    NOTIFICATION
    ALERT
  }

  # Enum for attendance status
  enum AttendanceStatus {
    PRESENT
    ABSENT
    LATE
    EXCUSED
    HOLIDAY
  }

  # Enum for assignment status
  enum AssignmentStatus {
    PENDING
    IN_PROGRESS
    SUBMITTED
    REVIEWED
    COMPLETED
  }

  # Base fields shared by all entities
  interface BaseEntity {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  # Educator entity
  type Educator implements BaseEntity {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String
    subject: String!
    qualifications: [String!]!
    experience: Int
    bio: String
    availability: JSON
    isActive: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    # Relations
    classSessions: [ClassSession!]
    assignments: [Assignment!]
    batches: [Batch!]
  }

  # Learner entity
  type Learner implements BaseEntity {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String
    dateOfBirth: String
    grade: String!
    enrollmentDate: String!
    guardianIds: [ID!]!
    batchIds: [ID!]!
    isActive: Boolean!
    profilePicture: String
    address: JSON
    createdAt: DateTime!
    updatedAt: DateTime!
    # Backward compatibility fields (for UI components)
    name: String
    username: String
    phone: String
    profileImage: String
    school: String
    board: String
    academicLevel: String
    targetExams: [String!]
    targetExamYear: Int
    status: String
    assignedEducators: JSON
    attendance: JSON
    performance: JSON
    remarkTags: [String!]
    # Relations
    guardians: [Guardian!]
    batches: [Batch!]
    # attendance: [Attendance!]  # Commenting out relation since we have attendance as JSON above
    testResults: [TestResult!]
  }

  # Guardian entity
  type Guardian implements BaseEntity {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String!
    relationship: String!
    occupation: String
    address: JSON
    emergencyContact: Boolean!
    learnerIds: [ID!]!
    isActive: Boolean!
    preferredContactMethod: String
    createdAt: DateTime!
    updatedAt: DateTime!
    # Relations
    learners: [Learner!]
    # Backward compatibility fields (for UI components)
    name: String
    relation: String
    phone: String
    assignedLearners: JSON
    paymentInfo: JSON
    communicationPreferences: JSON
    lastInteraction: String
    profileImage: String
    preferredContactTime: String
    notes: JSON
  }

  # Employee entity
  type Employee implements BaseEntity {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String
    department: String!
    position: String!
    hireDate: String!
    salary: Float
    isActive: Boolean!
    managerId: ID
    createdAt: DateTime!
    updatedAt: DateTime!
    # Relations
    manager: Employee
    subordinates: [Employee!]
  }

  # Intern entity
  type Intern implements BaseEntity {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String
    university: String!
    major: String!
    startDate: String!
    endDate: String
    mentorId: ID
    department: String!
    stipend: Float
    isActive: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    # Relations
    mentor: Employee
  }

  # Batch entity
  type Batch implements BaseEntity {
    id: ID!
    name: String!
    subject: String!
    grade: String!
    educatorId: ID!
    learnerIds: [ID!]!
    startDate: String!
    endDate: String
    schedule: JSON
    maxCapacity: Int!
    currentCapacity: Int!
    isActive: Boolean!
    description: String
    createdAt: DateTime!
    updatedAt: DateTime!
    # Relations
    educator: Educator
    learners: [Learner!]
    classSessions: [ClassSession!]
  }

  # ClassSession entity
  type ClassSession implements BaseEntity {
    id: ID!
    batchId: ID!
    educatorId: ID!
    date: String!
    startTime: String!
    endTime: String!
    topic: String!
    description: String
    materials: JSON
    homework: String
    isCompleted: Boolean!
    attendanceMarked: Boolean!
    notes: String
    createdAt: DateTime!
    updatedAt: DateTime!
    # Relations
    batch: Batch
    educator: Educator
    attendance: [Attendance!]
  }

  # Attendance entity
  type Attendance implements BaseEntity {
    id: ID!
    sessionId: ID!
    learnerId: ID!
    status: AttendanceStatus!
    checkInTime: String
    checkOutTime: String
    remarks: String
    markedById: ID!
    lateReason: String
    parentNotified: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    # Relations
    session: ClassSession
    learner: Learner
  }

  # Assignment entity
  type Assignment implements BaseEntity {
    id: ID!
    title: String!
    description: String!
    batchId: ID!
    educatorId: ID!
    dueDate: String!
    totalPoints: Int!
    instructions: String
    attachments: JSON
    status: AssignmentStatus!
    submissions: JSON
    createdAt: DateTime!
    updatedAt: DateTime!
    # Relations
    batch: Batch
    educator: Educator
  }

  # TestResult entity
  type TestResult implements BaseEntity {
    id: ID!
    learnerId: ID!
    batchId: ID!
    testName: String!
    testDate: String!
    totalMarks: Int!
    obtainedMarks: Int!
    percentage: Float!
    grade: String!
    remarks: String
    evaluatedById: ID!
    testType: String!
    subjects: JSON
    createdAt: DateTime!
    updatedAt: DateTime!
    # Relations
    learner: Learner
    batch: Batch
  }

  # AcademicPlan entity
  type AcademicPlan implements BaseEntity {
    id: ID!
    title: String!
    description: String!
    grade: String!
    subject: String!
    startDate: String!
    endDate: String!
    objectives: [String!]!
    topics: JSON
    resources: JSON
    assessmentCriteria: JSON
    createdById: ID!
    isActive: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  # Communication entity
  type Communication implements BaseEntity {
    id: ID!
    type: CommunicationType!
    subject: String!
    content: String!
    senderId: ID!
    recipientIds: [ID!]!
    batchId: ID
    priority: String!
    isRead: Boolean!
    readBy: JSON
    attachments: JSON
    scheduledAt: String
    sentAt: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  # Input types for mutations
  input CreateEducatorInput {
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String
    subject: String!
    qualifications: [String!]!
    experience: Int
    bio: String
    availability: JSON
  }

  input UpdateEducatorInput {
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
    subject: String
    qualifications: [String!]
    experience: Int
    bio: String
    availability: JSON
    isActive: Boolean
  }

  input CreateLearnerInput {
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String
    dateOfBirth: String
    grade: String!
    guardianIds: [ID!]
    batchIds: [ID!]
    profilePicture: String
    address: JSON
  }

  input UpdateLearnerInput {
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
    dateOfBirth: String
    grade: String
    guardianIds: [ID!]
    batchIds: [ID!]
    isActive: Boolean
    profilePicture: String
    address: JSON
  }

  input CreateGuardianInput {
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String!
    relationship: String!
    occupation: String
    address: JSON
    emergencyContact: Boolean
    learnerIds: [ID!]!
    preferredContactMethod: String
  }

  input UpdateGuardianInput {
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
    relationship: String
    occupation: String
    address: JSON
    emergencyContact: Boolean
    learnerIds: [ID!]
    isActive: Boolean
    preferredContactMethod: String
  }

  input CreateBatchInput {
    name: String!
    subject: String!
    grade: String!
    educatorId: ID!
    learnerIds: [ID!]
    startDate: String!
    endDate: String
    schedule: JSON
    maxCapacity: Int!
    description: String
  }

  input UpdateBatchInput {
    name: String
    subject: String
    grade: String
    educatorId: ID
    learnerIds: [ID!]
    startDate: String
    endDate: String
    schedule: JSON
    maxCapacity: Int
    isActive: Boolean
    description: String
  }

  input CreateClassSessionInput {
    batchId: ID!
    educatorId: ID!
    date: String!
    startTime: String!
    endTime: String!
    topic: String!
    description: String
    materials: JSON
    homework: String
  }

  input UpdateClassSessionInput {
    date: String
    startTime: String
    endTime: String
    topic: String
    description: String
    materials: JSON
    homework: String
    isCompleted: Boolean
    attendanceMarked: Boolean
    notes: String
  }

  input CreateAttendanceInput {
    sessionId: ID!
    learnerId: ID!
    status: AttendanceStatus!
    checkInTime: String
    checkOutTime: String
    remarks: String
    markedById: ID!
    lateReason: String
    parentNotified: Boolean
  }

  input UpdateAttendanceInput {
    status: AttendanceStatus
    checkInTime: String
    checkOutTime: String
    remarks: String
    lateReason: String
    parentNotified: Boolean
  }

  input CreateAssignmentInput {
    title: String!
    description: String!
    batchId: ID!
    educatorId: ID!
    dueDate: String!
    totalPoints: Int!
    instructions: String
    attachments: JSON
  }

  input UpdateAssignmentInput {
    title: String
    description: String
    dueDate: String
    totalPoints: Int
    instructions: String
    attachments: JSON
    status: AssignmentStatus
    submissions: JSON
  }

  input CreateTestResultInput {
    learnerId: ID!
    batchId: ID!
    testName: String!
    testDate: String!
    totalMarks: Int!
    obtainedMarks: Int!
    percentage: Float!
    grade: String!
    remarks: String
    evaluatedById: ID!
    testType: String!
    subjects: JSON
  }

  input UpdateTestResultInput {
    testName: String
    testDate: String
    totalMarks: Int
    obtainedMarks: Int
    percentage: Float
    grade: String
    remarks: String
    subjects: JSON
  }

  input CreateCommunicationInput {
    type: CommunicationType!
    subject: String!
    content: String!
    senderId: ID!
    recipientIds: [ID!]!
    batchId: ID
    priority: String!
    attachments: JSON
    scheduledAt: String
  }

  input UpdateCommunicationInput {
    subject: String
    content: String
    priority: String
    isRead: Boolean
    readBy: JSON
  }

  # Query root type
  type Query {
    # Educator queries
    educators: [Educator!]!
    educator(id: ID!): Educator
    educatorsBySubject(subject: String!): [Educator!]!

    # Learner queries
    learners: [Learner!]!
    learner(id: ID!): Learner
    learnersByGrade(grade: String!): [Learner!]!
    learnersByBatch(batchId: ID!): [Learner!]!

    # Guardian queries
    guardians: [Guardian!]!
    guardian(id: ID!): Guardian
    guardiansByLearner(learnerId: ID!): [Guardian!]!

    # Employee queries
    employees: [Employee!]!
    employee(id: ID!): Employee
    employeesByDepartment(department: String!): [Employee!]!

    # Intern queries
    interns: [Intern!]!
    intern(id: ID!): Intern
    internsByDepartment(department: String!): [Intern!]!

    # Batch queries
    batches: [Batch!]!
    batch(id: ID!): Batch
    batchesByEducator(educatorId: ID!): [Batch!]!
    activeBatches: [Batch!]!

    # ClassSession queries
    classSessions: [ClassSession!]!
    classSession(id: ID!): ClassSession
    sessionsByBatch(batchId: ID!): [ClassSession!]!
    upcomingSessions(educatorId: ID): [ClassSession!]!

    # Attendance queries
    attendanceRecords: [Attendance!]!
    attendance(id: ID!): Attendance
    attendanceBySession(sessionId: ID!): [Attendance!]!
    attendanceByLearner(learnerId: ID!): [Attendance!]!

    # Assignment queries
    assignments: [Assignment!]!
    assignment(id: ID!): Assignment
    assignmentsByBatch(batchId: ID!): [Assignment!]!
    pendingAssignments(batchId: ID): [Assignment!]!

    # TestResult queries
    testResults: [TestResult!]!
    testResult(id: ID!): TestResult
    testResultsByLearner(learnerId: ID!): [TestResult!]!
    testResultsByBatch(batchId: ID!): [TestResult!]!

    # AcademicPlan queries
    academicPlans: [AcademicPlan!]!
    academicPlan(id: ID!): AcademicPlan
    academicPlansByGrade(grade: String!): [AcademicPlan!]!

    # Communication queries
    communications: [Communication!]!
    communication(id: ID!): Communication
    inbox(recipientId: ID!): [Communication!]!
    sentMessages(senderId: ID!): [Communication!]!
  }

  # Mutation root type
  type Mutation {
    # Educator mutations
    createEducator(input: CreateEducatorInput!): Educator!
    updateEducator(id: ID!, input: UpdateEducatorInput!): Educator!
    deleteEducator(id: ID!): Boolean!

    # Learner mutations
    createLearner(input: CreateLearnerInput!): Learner!
    updateLearner(id: ID!, input: UpdateLearnerInput!): Learner!
    deleteLearner(id: ID!): Boolean!

    # Guardian mutations
    createGuardian(input: CreateGuardianInput!): Guardian!
    updateGuardian(id: ID!, input: UpdateGuardianInput!): Guardian!
    deleteGuardian(id: ID!): Boolean!

    # Batch mutations
    createBatch(input: CreateBatchInput!): Batch!
    updateBatch(id: ID!, input: UpdateBatchInput!): Batch!
    deleteBatch(id: ID!): Boolean!

    # ClassSession mutations
    createClassSession(input: CreateClassSessionInput!): ClassSession!
    updateClassSession(id: ID!, input: UpdateClassSessionInput!): ClassSession!
    deleteClassSession(id: ID!): Boolean!

    # Attendance mutations
    createAttendance(input: CreateAttendanceInput!): Attendance!
    updateAttendance(id: ID!, input: UpdateAttendanceInput!): Attendance!
    markBulkAttendance(sessionId: ID!, attendanceData: [CreateAttendanceInput!]!): [Attendance!]!

    # Assignment mutations
    createAssignment(input: CreateAssignmentInput!): Assignment!
    updateAssignment(id: ID!, input: UpdateAssignmentInput!): Assignment!
    deleteAssignment(id: ID!): Boolean!

    # TestResult mutations
    createTestResult(input: CreateTestResultInput!): TestResult!
    updateTestResult(id: ID!, input: UpdateTestResultInput!): TestResult!
    deleteTestResult(id: ID!): Boolean!

    # Communication mutations
    createCommunication(input: CreateCommunicationInput!): Communication!
    updateCommunication(id: ID!, input: UpdateCommunicationInput!): Communication!
    markAsRead(id: ID!, userId: ID!): Communication!
    deleteCommunication(id: ID!): Boolean!
  }
`;