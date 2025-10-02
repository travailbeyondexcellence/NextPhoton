/**
 * GraphQL Mutation Documents
 *
 * This file contains all GraphQL mutation definitions used throughout the application.
 * These mutations work with both local resolvers (current) and remote GraphQL endpoints (future).
 * The same mutations will be used when transitioning to the NestJS backend.
 */

import { gql } from '@apollo/client';

// ============================================
// EDUCATOR MUTATIONS
// ============================================

export const CREATE_EDUCATOR = gql`
  mutation CreateEducator($input: CreateEducatorInput!) {
    createEducator(input: $input) {
      id
      firstName
      lastName
      email
      phoneNumber
      subject
      qualifications
      experience
      bio
      availability
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_EDUCATOR = gql`
  mutation UpdateEducator($id: ID!, $input: UpdateEducatorInput!) {
    updateEducator(id: $id, input: $input) {
      id
      firstName
      lastName
      email
      phoneNumber
      subject
      qualifications
      experience
      bio
      availability
      isActive
      updatedAt
    }
  }
`;

export const DELETE_EDUCATOR = gql`
  mutation DeleteEducator($id: ID!) {
    deleteEducator(id: $id)
  }
`;

// ============================================
// LEARNER MUTATIONS
// ============================================

export const CREATE_LEARNER = gql`
  mutation CreateLearner($input: CreateLearnerInput!) {
    createLearner(input: $input) {
      id
      firstName
      lastName
      email
      phoneNumber
      dateOfBirth
      grade
      enrollmentDate
      guardianIds
      batchIds
      isActive
      profilePicture
      address
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_LEARNER = gql`
  mutation UpdateLearner($id: ID!, $input: UpdateLearnerInput!) {
    updateLearner(id: $id, input: $input) {
      id
      firstName
      lastName
      email
      phoneNumber
      dateOfBirth
      grade
      guardianIds
      batchIds
      isActive
      profilePicture
      address
      updatedAt
    }
  }
`;

export const DELETE_LEARNER = gql`
  mutation DeleteLearner($id: ID!) {
    deleteLearner(id: $id)
  }
`;

// ============================================
// GUARDIAN MUTATIONS
// ============================================

export const CREATE_GUARDIAN = gql`
  mutation CreateGuardian($input: CreateGuardianInput!) {
    createGuardian(input: $input) {
      id
      firstName
      lastName
      email
      phoneNumber
      relationship
      occupation
      address
      emergencyContact
      learnerIds
      isActive
      preferredContactMethod
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_GUARDIAN = gql`
  mutation UpdateGuardian($id: ID!, $input: UpdateGuardianInput!) {
    updateGuardian(id: $id, input: $input) {
      id
      firstName
      lastName
      email
      phoneNumber
      relationship
      occupation
      address
      emergencyContact
      learnerIds
      isActive
      preferredContactMethod
      updatedAt
    }
  }
`;

export const DELETE_GUARDIAN = gql`
  mutation DeleteGuardian($id: ID!) {
    deleteGuardian(id: $id)
  }
`;

// ============================================
// BATCH MUTATIONS
// ============================================

export const CREATE_BATCH = gql`
  mutation CreateBatch($input: CreateBatchInput!) {
    createBatch(input: $input) {
      id
      name
      subject
      grade
      educatorId
      learnerIds
      startDate
      endDate
      schedule
      maxCapacity
      currentCapacity
      isActive
      description
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_BATCH = gql`
  mutation UpdateBatch($id: ID!, $input: UpdateBatchInput!) {
    updateBatch(id: $id, input: $input) {
      id
      name
      subject
      grade
      educatorId
      learnerIds
      startDate
      endDate
      schedule
      maxCapacity
      currentCapacity
      isActive
      description
      updatedAt
    }
  }
`;

export const DELETE_BATCH = gql`
  mutation DeleteBatch($id: ID!) {
    deleteBatch(id: $id)
  }
`;

// ============================================
// CLASS SESSION MUTATIONS
// ============================================

export const CREATE_CLASS_SESSION = gql`
  mutation CreateClassSession($input: CreateClassSessionInput!) {
    createClassSession(input: $input) {
      id
      batchId
      educatorId
      date
      startTime
      endTime
      topic
      description
      materials
      homework
      isCompleted
      attendanceMarked
      notes
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_CLASS_SESSION = gql`
  mutation UpdateClassSession($id: ID!, $input: UpdateClassSessionInput!) {
    updateClassSession(id: $id, input: $input) {
      id
      date
      startTime
      endTime
      topic
      description
      materials
      homework
      isCompleted
      attendanceMarked
      notes
      updatedAt
    }
  }
`;

export const DELETE_CLASS_SESSION = gql`
  mutation DeleteClassSession($id: ID!) {
    deleteClassSession(id: $id)
  }
`;

// ============================================
// ATTENDANCE MUTATIONS
// ============================================

export const CREATE_ATTENDANCE = gql`
  mutation CreateAttendance($input: CreateAttendanceInput!) {
    createAttendance(input: $input) {
      id
      sessionId
      learnerId
      status
      checkInTime
      checkOutTime
      remarks
      markedById
      lateReason
      parentNotified
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_ATTENDANCE = gql`
  mutation UpdateAttendance($id: ID!, $input: UpdateAttendanceInput!) {
    updateAttendance(id: $id, input: $input) {
      id
      status
      checkInTime
      checkOutTime
      remarks
      lateReason
      parentNotified
      updatedAt
    }
  }
`;

export const MARK_BULK_ATTENDANCE = gql`
  mutation MarkBulkAttendance($sessionId: ID!, $attendanceData: [CreateAttendanceInput!]!) {
    markBulkAttendance(sessionId: $sessionId, attendanceData: $attendanceData) {
      id
      sessionId
      learnerId
      status
      checkInTime
      checkOutTime
      remarks
      markedById
      lateReason
      parentNotified
      createdAt
    }
  }
`;

// ============================================
// ASSIGNMENT MUTATIONS
// ============================================

export const CREATE_ASSIGNMENT = gql`
  mutation CreateAssignment($input: CreateAssignmentInput!) {
    createAssignment(input: $input) {
      id
      title
      description
      batchId
      educatorId
      dueDate
      totalPoints
      instructions
      attachments
      status
      submissions
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_ASSIGNMENT = gql`
  mutation UpdateAssignment($id: ID!, $input: UpdateAssignmentInput!) {
    updateAssignment(id: $id, input: $input) {
      id
      title
      description
      dueDate
      totalPoints
      instructions
      attachments
      status
      submissions
      updatedAt
    }
  }
`;

export const DELETE_ASSIGNMENT = gql`
  mutation DeleteAssignment($id: ID!) {
    deleteAssignment(id: $id)
  }
`;

// ============================================
// TEST RESULT MUTATIONS
// ============================================

export const CREATE_TEST_RESULT = gql`
  mutation CreateTestResult($input: CreateTestResultInput!) {
    createTestResult(input: $input) {
      id
      learnerId
      batchId
      testName
      testDate
      totalMarks
      obtainedMarks
      percentage
      grade
      remarks
      evaluatedById
      testType
      subjects
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_TEST_RESULT = gql`
  mutation UpdateTestResult($id: ID!, $input: UpdateTestResultInput!) {
    updateTestResult(id: $id, input: $input) {
      id
      testName
      testDate
      totalMarks
      obtainedMarks
      percentage
      grade
      remarks
      subjects
      updatedAt
    }
  }
`;

export const DELETE_TEST_RESULT = gql`
  mutation DeleteTestResult($id: ID!) {
    deleteTestResult(id: $id)
  }
`;

// ============================================
// COMMUNICATION MUTATIONS
// ============================================

export const CREATE_COMMUNICATION = gql`
  mutation CreateCommunication($input: CreateCommunicationInput!) {
    createCommunication(input: $input) {
      id
      type
      subject
      content
      senderId
      recipientIds
      batchId
      priority
      isRead
      readBy
      attachments
      scheduledAt
      sentAt
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_COMMUNICATION = gql`
  mutation UpdateCommunication($id: ID!, $input: UpdateCommunicationInput!) {
    updateCommunication(id: $id, input: $input) {
      id
      subject
      content
      priority
      isRead
      readBy
      updatedAt
    }
  }
`;

export const MARK_AS_READ = gql`
  mutation MarkAsRead($id: ID!, $userId: ID!) {
    markAsRead(id: $id, userId: $userId) {
      id
      isRead
      readBy
      updatedAt
    }
  }
`;

export const DELETE_COMMUNICATION = gql`
  mutation DeleteCommunication($id: ID!) {
    deleteCommunication(id: $id)
  }
`;