# JSON Data Schemas for Mock Database

## Base Schema Structure
All JSON files follow this consistent structure:

```json
{
  "metadata": {
    "lastUpdated": "ISO-8601-timestamp",
    "version": "1.0",
    "count": 0,
    "description": "Brief description of this data collection"
  },
  "data": [
    // Array of entity objects
  ]
}
```

## Entity Schemas

### Users (users.json)
Base user information shared across all roles:
```json
{
  "id": "string (uuid)",
  "email": "string",
  "firstName": "string",
  "lastName": "string", 
  "role": "learner | educator | guardian | educare_manager | employee | intern | admin",
  "isActive": "boolean",
  "profileImage": "string (url)",
  "phoneNumber": "string",
  "dateOfBirth": "ISO-8601-date",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string",
    "country": "string"
  },
  "emergencyContact": {
    "name": "string",
    "relationship": "string",
    "phoneNumber": "string"
  },
  "preferences": {
    "language": "string",
    "timezone": "string",
    "notifications": {
      "email": "boolean",
      "sms": "boolean",
      "push": "boolean"
    }
  },
  "createdAt": "ISO-8601-timestamp",
  "updatedAt": "ISO-8601-timestamp"
}
```

### Educators (educators.json)
```json
{
  "id": "string (uuid)",
  "userId": "string (reference to users.json)",
  "specializations": ["string"],
  "qualifications": [
    {
      "degree": "string",
      "institution": "string",
      "year": "number",
      "verified": "boolean"
    }
  ],
  "experience": {
    "totalYears": "number",
    "previousRoles": [
      {
        "title": "string",
        "organization": "string",
        "duration": "string",
        "description": "string"
      }
    ]
  },
  "certifications": [
    {
      "name": "string",
      "issuedBy": "string",
      "issueDate": "ISO-8601-date",
      "expiryDate": "ISO-8601-date",
      "verified": "boolean"
    }
  ],
  "availability": {
    "timeSlots": [
      {
        "dayOfWeek": "monday | tuesday | ... | sunday",
        "startTime": "HH:MM",
        "endTime": "HH:MM"
      }
    ],
    "maxStudentsPerSession": "number",
    "preferredSessionDuration": "number (minutes)"
  },
  "ratings": {
    "average": "number (1-5)",
    "totalReviews": "number"
  },
  "hourlyRate": "number",
  "isVerified": "boolean",
  "status": "active | inactive | pending_verification",
  "createdAt": "ISO-8601-timestamp",
  "updatedAt": "ISO-8601-timestamp"
}
```

### Learners (learners.json)
```json
{
  "id": "string (uuid)",
  "userId": "string (reference to users.json)",
  "guardianIds": ["string (references to guardians.json)"],
  "grade": "string",
  "school": "string",
  "academicYear": "string",
  "learningGoals": ["string"],
  "specialNeeds": ["string"],
  "learningStyle": "visual | auditory | kinesthetic | reading_writing",
  "subjects": [
    {
      "name": "string",
      "level": "beginner | intermediate | advanced",
      "priority": "high | medium | low"
    }
  ],
  "schedule": {
    "preferredDays": ["monday | tuesday | ... | sunday"],
    "preferredTimes": [
      {
        "startTime": "HH:MM",
        "endTime": "HH:MM"
      }
    ]
  },
  "progress": {
    "overallGrade": "string",
    "subjectGrades": [
      {
        "subject": "string",
        "currentGrade": "string",
        "targetGrade": "string"
      }
    ]
  },
  "createdAt": "ISO-8601-timestamp",
  "updatedAt": "ISO-8601-timestamp"
}
```

### Guardians (guardians.json)
```json
{
  "id": "string (uuid)",
  "userId": "string (reference to users.json)",
  "learnerIds": ["string (references to learners.json)"],
  "relationship": "parent | legal_guardian | relative | other",
  "isPrimary": "boolean",
  "hasPickupPermission": "boolean",
  "hasAcademicPermission": "boolean",
  "hasEmergencyPermission": "boolean",
  "occupation": "string",
  "workSchedule": {
    "flexibility": "flexible | fixed | shift_work",
    "availableForMeetings": [
      {
        "dayOfWeek": "monday | tuesday | ... | sunday",
        "startTime": "HH:MM",
        "endTime": "HH:MM"
      }
    ]
  },
  "communicationPreferences": {
    "primaryMethod": "email | phone | app_notification",
    "frequency": "daily | weekly | as_needed | emergency_only"
  },
  "createdAt": "ISO-8601-timestamp",
  "updatedAt": "ISO-8601-timestamp"
}
```

### Courses (courses.json)
```json
{
  "id": "string (uuid)",
  "title": "string",
  "description": "string",
  "subject": "string",
  "level": "beginner | intermediate | advanced",
  "duration": "number (hours)",
  "maxStudents": "number",
  "educatorId": "string (reference to educators.json)",
  "curriculum": [
    {
      "moduleNumber": "number",
      "title": "string",
      "description": "string",
      "estimatedHours": "number",
      "learningObjectives": ["string"]
    }
  ],
  "schedule": {
    "startDate": "ISO-8601-date",
    "endDate": "ISO-8601-date",
    "sessions": [
      {
        "dayOfWeek": "monday | tuesday | ... | sunday",
        "startTime": "HH:MM",
        "endTime": "HH:MM"
      }
    ]
  },
  "pricing": {
    "totalFee": "number",
    "currency": "string",
    "paymentStructure": "upfront | installments | hourly"
  },
  "requirements": ["string"],
  "materials": ["string"],
  "isActive": "boolean",
  "createdAt": "ISO-8601-timestamp",
  "updatedAt": "ISO-8601-timestamp"
}
```

### Enrollments (enrollments.json)
```json
{
  "id": "string (uuid)",
  "learnerId": "string (reference to learners.json)",
  "courseId": "string (reference to courses.json)",
  "enrollmentDate": "ISO-8601-timestamp",
  "status": "enrolled | completed | dropped | on_hold",
  "paymentStatus": "pending | paid | partial | refunded",
  "progress": {
    "completedModules": ["string (module IDs)"],
    "currentModule": "string",
    "overallProgressPercentage": "number (0-100)"
  },
  "attendance": {
    "totalSessions": "number",
    "attendedSessions": "number",
    "attendancePercentage": "number (0-100)"
  },
  "grades": [
    {
      "moduleId": "string",
      "grade": "string",
      "feedback": "string",
      "gradedDate": "ISO-8601-timestamp"
    }
  ],
  "notes": "string",
  "createdAt": "ISO-8601-timestamp",
  "updatedAt": "ISO-8601-timestamp"
}
```

### Sessions (sessions.json)
```json
{
  "id": "string (uuid)",
  "courseId": "string (reference to courses.json)",
  "educatorId": "string (reference to educators.json)",
  "enrollmentIds": ["string (references to enrollments.json)"],
  "title": "string",
  "description": "string",
  "scheduledDate": "ISO-8601-timestamp",
  "scheduledStartTime": "HH:MM",
  "scheduledEndTime": "HH:MM",
  "actualStartTime": "HH:MM",
  "actualEndTime": "HH:MM",
  "status": "scheduled | in_progress | completed | cancelled",
  "location": {
    "type": "online | in_person | hybrid",
    "address": "string",
    "meetingLink": "string",
    "meetingId": "string"
  },
  "attendance": [
    {
      "learnerId": "string",
      "status": "present | absent | late | left_early",
      "checkInTime": "HH:MM",
      "checkOutTime": "HH:MM",
      "notes": "string"
    }
  ],
  "materials": [
    {
      "name": "string",
      "type": "document | video | link | image",
      "url": "string"
    }
  ],
  "summary": "string",
  "educatorNotes": "string",
  "createdAt": "ISO-8601-timestamp",
  "updatedAt": "ISO-8601-timestamp"
}
```

### Assessments (assessments.json)
```json
{
  "id": "string (uuid)",
  "courseId": "string (reference to courses.json)",
  "educatorId": "string (reference to educators.json)",
  "title": "string",
  "description": "string",
  "type": "quiz | test | assignment | project",
  "totalMarks": "number",
  "passingMarks": "number",
  "dueDate": "ISO-8601-timestamp",
  "duration": "number (minutes)",
  "instructions": "string",
  "questions": [
    {
      "id": "string",
      "type": "multiple_choice | true_false | short_answer | essay",
      "question": "string",
      "options": ["string"], // for multiple choice
      "correctAnswer": "string",
      "marks": "number"
    }
  ],
  "submissions": [
    {
      "learnerId": "string",
      "submittedAt": "ISO-8601-timestamp",
      "answers": [
        {
          "questionId": "string",
          "answer": "string"
        }
      ],
      "marksObtained": "number",
      "feedback": "string",
      "gradedAt": "ISO-8601-timestamp"
    }
  ],
  "isActive": "boolean",
  "createdAt": "ISO-8601-timestamp",
  "updatedAt": "ISO-8601-timestamp"
}
```

### Analytics (analytics.json)
```json
{
  "id": "string (uuid)",
  "entityType": "learner | educator | course | session",
  "entityId": "string",
  "metricType": "engagement | performance | attendance | satisfaction",
  "timestamp": "ISO-8601-timestamp",
  "data": {
    "value": "number",
    "unit": "string",
    "context": "object (flexible structure based on metric type)"
  },
  "aggregationPeriod": "daily | weekly | monthly | quarterly",
  "tags": ["string"],
  "createdAt": "ISO-8601-timestamp"
}
```

## Relationship Patterns

### Foreign Keys
- Use `userId` to reference the base user record
- Use `Id` suffix for single references (e.g., `educatorId`)
- Use `Ids` suffix for array references (e.g., `learnerIds`)

### Data Integrity Rules
1. Always validate referenced IDs exist in their respective collections
2. Maintain referential integrity when deleting records
3. Update related records when parent records change
4. Use cascade rules for dependent data