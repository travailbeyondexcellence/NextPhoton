/**
 * GraphQL Query Documents
 *
 * This file contains all GraphQL query definitions used throughout the application.
 * These queries work with both local resolvers (current) and remote GraphQL endpoints (future).
 * The same queries will be used when transitioning to the NestJS backend.
 */

import { gql } from '@apollo/client';

// ============================================
// EDUCATOR QUERIES
// ============================================

export const GET_EDUCATORS = gql`
  query GetEducators {
    educators {
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

export const GET_EDUCATOR = gql`
  query GetEducator($id: ID!) {
    educator(id: $id) {
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

export const GET_EDUCATORS_BY_SUBJECT = gql`
  query GetEducatorsBySubject($subject: String!) {
    educatorsBySubject(subject: $subject) {
      id
      firstName
      lastName
      email
      subject
      experience
      isActive
    }
  }
`;

// ============================================
// LEARNER QUERIES
// ============================================

export const GET_LEARNERS = gql`
  query GetLearners {
    learners {
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
      # Backward compatibility fields for UI
      name
      username
      phone
      profileImage
      school
      board
      academicLevel
      targetExams
      targetExamYear
      status
      assignedEducators
      attendance
      performance
      remarkTags
    }
  }
`;

export const GET_LEARNER = gql`
  query GetLearner($id: ID!) {
    learner(id: $id) {
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
      # Backward compatibility fields for UI
      name
      username
      phone
      profileImage
      school
      board
      academicLevel
      targetExams
      targetExamYear
      status
      lastActive
      assignedEducators
      guardians {
        guardianId
        guardianName
        relation
      }
      attendance {
        overall
        lastMonth
      }
      performance {
        averageScore
        lastTestScore
        trend
      }
      reviewedEducators {
        educatorId
        educatorName
        exam
        rating
        comment
        date
      }
      learnerNotes {
        author
        timestamp
        note
        type
      }
      remarkTags
    }
  }
`;

// Alias for backward compatibility
export const GET_LEARNER_BY_ID = GET_LEARNER;

export const GET_LEARNERS_BY_GRADE = gql`
  query GetLearnersByGrade($grade: String!) {
    learnersByGrade(grade: $grade) {
      id
      firstName
      lastName
      email
      grade
      isActive
    }
  }
`;

export const GET_LEARNERS_BY_BATCH = gql`
  query GetLearnersByBatch($batchId: ID!) {
    learnersByBatch(batchId: $batchId) {
      id
      firstName
      lastName
      email
      grade
      profilePicture
      isActive
    }
  }
`;

// ============================================
// GUARDIAN QUERIES
// ============================================

export const GET_GUARDIANS = gql`
  query GetGuardians {
    guardians {
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
      # Backward compatibility fields for UI
      name
      relation
      phone
      assignedLearners
      paymentInfo
      communicationPreferences
      lastInteraction
      profileImage
      preferredContactTime
      notes
    }
  }
`;

export const GET_GUARDIAN = gql`
  query GetGuardian($id: ID!) {
    guardian(id: $id) {
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
      learners {
        id
        firstName
        lastName
        grade
      }
    }
  }
`;

export const GET_GUARDIANS_BY_LEARNER = gql`
  query GetGuardiansByLearner($learnerId: ID!) {
    guardiansByLearner(learnerId: $learnerId) {
      id
      firstName
      lastName
      relationship
      phoneNumber
      emergencyContact
    }
  }
`;

// ============================================
// BATCH QUERIES
// ============================================

export const GET_BATCHES = gql`
  query GetBatches {
    batches {
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

export const GET_BATCH = gql`
  query GetBatch($id: ID!) {
    batch(id: $id) {
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
      educator {
        id
        firstName
        lastName
        subject
      }
      learners {
        id
        firstName
        lastName
        grade
      }
      classSessions {
        id
        date
        topic
        isCompleted
      }
    }
  }
`;

export const GET_BATCHES_BY_EDUCATOR = gql`
  query GetBatchesByEducator($educatorId: ID!) {
    batchesByEducator(educatorId: $educatorId) {
      id
      name
      subject
      grade
      currentCapacity
      maxCapacity
      isActive
    }
  }
`;

export const GET_ACTIVE_BATCHES = gql`
  query GetActiveBatches {
    activeBatches {
      id
      name
      subject
      grade
      educatorId
      currentCapacity
      maxCapacity
      startDate
      endDate
    }
  }
`;

// ============================================
// CLASS SESSION QUERIES
// ============================================

export const GET_CLASS_SESSIONS = gql`
  query GetClassSessions {
    classSessions {
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

export const GET_CLASS_SESSION = gql`
  query GetClassSession($id: ID!) {
    classSession(id: $id) {
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
      batch {
        id
        name
        subject
        grade
      }
      educator {
        id
        firstName
        lastName
      }
      attendance {
        id
        learnerId
        status
        remarks
      }
    }
  }
`;

export const GET_SESSIONS_BY_BATCH = gql`
  query GetSessionsByBatch($batchId: ID!) {
    sessionsByBatch(batchId: $batchId) {
      id
      date
      startTime
      endTime
      topic
      isCompleted
      attendanceMarked
    }
  }
`;

export const GET_UPCOMING_SESSIONS = gql`
  query GetUpcomingSessions($educatorId: ID) {
    upcomingSessions(educatorId: $educatorId) {
      id
      batchId
      date
      startTime
      endTime
      topic
      batch {
        name
        subject
        grade
      }
    }
  }
`;

// ============================================
// ATTENDANCE QUERIES
// ============================================

export const GET_ATTENDANCE_RECORDS = gql`
  query GetAttendanceRecords {
    attendanceRecords {
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

export const GET_ATTENDANCE_BY_SESSION = gql`
  query GetAttendanceBySession($sessionId: ID!) {
    attendanceBySession(sessionId: $sessionId) {
      id
      learnerId
      status
      checkInTime
      checkOutTime
      remarks
      lateReason
      parentNotified
      learner {
        id
        firstName
        lastName
        grade
      }
    }
  }
`;

export const GET_ATTENDANCE_BY_LEARNER = gql`
  query GetAttendanceByLearner($learnerId: ID!) {
    attendanceByLearner(learnerId: $learnerId) {
      id
      sessionId
      status
      checkInTime
      checkOutTime
      remarks
      session {
        id
        date
        topic
        batch {
          name
          subject
        }
      }
    }
  }
`;

// ============================================
// ASSIGNMENT QUERIES
// ============================================

export const GET_ASSIGNMENTS = gql`
  query GetAssignments {
    assignments {
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

export const GET_ASSIGNMENT = gql`
  query GetAssignment($id: ID!) {
    assignment(id: $id) {
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
      batch {
        id
        name
        subject
        grade
      }
      educator {
        id
        firstName
        lastName
      }
    }
  }
`;

export const GET_ASSIGNMENTS_BY_BATCH = gql`
  query GetAssignmentsByBatch($batchId: ID!) {
    assignmentsByBatch(batchId: $batchId) {
      id
      title
      dueDate
      totalPoints
      status
      educator {
        firstName
        lastName
      }
    }
  }
`;

export const GET_PENDING_ASSIGNMENTS = gql`
  query GetPendingAssignments($batchId: ID) {
    pendingAssignments(batchId: $batchId) {
      id
      title
      dueDate
      totalPoints
      status
      batch {
        name
        subject
      }
    }
  }
`;

// ============================================
// TEST RESULT QUERIES
// ============================================

export const GET_TEST_RESULTS = gql`
  query GetTestResults {
    testResults {
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

export const GET_TEST_RESULT = gql`
  query GetTestResult($id: ID!) {
    testResult(id: $id) {
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
      learner {
        id
        firstName
        lastName
        grade
      }
      batch {
        id
        name
        subject
      }
    }
  }
`;

export const GET_TEST_RESULTS_BY_LEARNER = gql`
  query GetTestResultsByLearner($learnerId: ID!) {
    testResultsByLearner(learnerId: $learnerId) {
      id
      testName
      testDate
      percentage
      grade
      testType
      batch {
        name
        subject
      }
    }
  }
`;

export const GET_TEST_RESULTS_BY_BATCH = gql`
  query GetTestResultsByBatch($batchId: ID!) {
    testResultsByBatch(batchId: $batchId) {
      id
      testName
      testDate
      totalMarks
      obtainedMarks
      percentage
      grade
      learner {
        id
        firstName
        lastName
      }
    }
  }
`;

// ============================================
// ACADEMIC PLAN QUERIES
// ============================================

export const GET_ACADEMIC_PLANS = gql`
  query GetAcademicPlans {
    academicPlans {
      id
      title
      description
      grade
      subject
      startDate
      endDate
      objectives
      topics
      resources
      assessmentCriteria
      createdById
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_ACADEMIC_PLAN = gql`
  query GetAcademicPlan($id: ID!) {
    academicPlan(id: $id) {
      id
      title
      description
      grade
      subject
      startDate
      endDate
      objectives
      topics
      resources
      assessmentCriteria
      createdById
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_ACADEMIC_PLANS_BY_GRADE = gql`
  query GetAcademicPlansByGrade($grade: String!) {
    academicPlansByGrade(grade: $grade) {
      id
      title
      subject
      startDate
      endDate
      isActive
    }
  }
`;

// ============================================
// COMMUNICATION QUERIES
// ============================================

export const GET_COMMUNICATIONS = gql`
  query GetCommunications {
    communications {
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

export const GET_COMMUNICATION = gql`
  query GetCommunication($id: ID!) {
    communication(id: $id) {
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

export const GET_INBOX = gql`
  query GetInbox($recipientId: ID!) {
    inbox(recipientId: $recipientId) {
      id
      type
      subject
      content
      senderId
      priority
      isRead
      sentAt
      attachments
    }
  }
`;

export const GET_SENT_MESSAGES = gql`
  query GetSentMessages($senderId: ID!) {
    sentMessages(senderId: $senderId) {
      id
      type
      subject
      content
      recipientIds
      priority
      isRead
      sentAt
      readBy
    }
  }
`;

// ============================================
// EMPLOYEE QUERIES
// ============================================

export const GET_EMPLOYEES = gql`
  query GetEmployees {
    employees {
      id
      firstName
      lastName
      email
      phoneNumber
      department
      position
      hireDate
      salary
      isActive
      managerId
      createdAt
      updatedAt
    }
  }
`;

export const GET_EMPLOYEE = gql`
  query GetEmployee($id: ID!) {
    employee(id: $id) {
      id
      firstName
      lastName
      email
      phoneNumber
      department
      position
      hireDate
      salary
      isActive
      managerId
      createdAt
      updatedAt
      manager {
        id
        firstName
        lastName
        position
      }
      subordinates {
        id
        firstName
        lastName
        position
      }
    }
  }
`;

export const GET_EMPLOYEES_BY_DEPARTMENT = gql`
  query GetEmployeesByDepartment($department: String!) {
    employeesByDepartment(department: $department) {
      id
      firstName
      lastName
      position
      isActive
    }
  }
`;

// ============================================
// INTERN QUERIES
// ============================================

export const GET_INTERNS = gql`
  query GetInterns {
    interns {
      id
      firstName
      lastName
      email
      phoneNumber
      university
      major
      startDate
      endDate
      mentorId
      department
      stipend
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_INTERN = gql`
  query GetIntern($id: ID!) {
    intern(id: $id) {
      id
      firstName
      lastName
      email
      phoneNumber
      university
      major
      startDate
      endDate
      mentorId
      department
      stipend
      isActive
      createdAt
      updatedAt
      mentor {
        id
        firstName
        lastName
        position
      }
    }
  }
`;

export const GET_INTERNS_BY_DEPARTMENT = gql`
  query GetInternsByDepartment($department: String!) {
    internsByDepartment(department: $department) {
      id
      firstName
      lastName
      university
      major
      isActive
    }
  }
`;