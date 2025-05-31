# NextPhoton Roles & Permissions System

## ABAC (Attribute-Based Access Control) Architecture

NextPhoton implements a sophisticated permission system that supports:
- **Multi-role users** (users can have multiple roles simultaneously)
- **Hierarchical permissions** (role defaults + individual overrides)
- **Organization-based multi-tenancy**
- **Inheritance + Delta permission model**

## Core Roles

### 1. **Learner**
**Primary Purpose**: Students seeking personalized education

**Types** (LearnerType Enum):
- `K12`: Kindergarten through 12th grade students
- `COLLEGE`: University and college students  
- `ADULT_LEARNER`: Adult education and skill development

**Core Responsibilities**:
- Complete assigned tasks and homework
- Attend scheduled sessions (online/offline)
- Participate in assessments and progress tracking
- Communicate learning challenges to ECMs
- Follow curriculum guidelines and study schedules

**Key Relationships**:
- Managed by EduCare Managers (ECMs)
- Connected to Guardians (parent, legal guardian, elder sibling, etc.)
- Assigned to Educators for sessions
- Associated with specific exam types and curriculum

---

### 2. **Guardian**
**Primary Purpose**: Family members who monitor learner progress and make platform decisions

**Core Responsibilities**:
- Book sessions for learners (hourly or course packages)
- Make payments for educational services
- Monitor learner progress through ECM reports
- Communicate with ECMs regarding learner needs
- Approve session schedules and educator assignments

**Key Capabilities**:
- Access to learner progress dashboards
- Financial transaction management
- Communication with educators and ECMs
- Session scheduling and rescheduling
- Performance report viewing

**Relationship Types** (to Learners):
- `parent`: Biological or adoptive parent
- `legal_guardian`: Court-appointed guardian
- `elder_brother/sister`: Sibling with guardianship responsibilities
- `grandparent`: Extended family guardian
- `other`: Other approved guardian relationships

---

### 3. **Educator**
**Primary Purpose**: Independent tutors who provide personalized education following platform curriculum

**Onboarding Process**:
1. Sign up and create profile
2. Upload demo video and qualifications
3. Enter waitlist status (`WAITLIST`)
4. Admin review and approval (`UNDER_REVIEW`)
5. Classification and rate approval (`APPROVED`)
6. Active teaching status

**Core Responsibilities**:
- Follow platform-provided curriculum strictly
- Conduct online and offline sessions
- Set availability schedules
- Provide progress feedback to ECMs
- Maintain session quality standards
- Upload qualifications and credentials

**Rate Management**:
- Set own hourly rates (subject to admin approval)
- Rates must be approved before going live
- Platform takes commission from educator payments
- Different rates possible for different subjects/levels

**Curriculum Adherence**:
- Must follow provided curriculum with strict time allocations
- Cannot deviate from platform curriculum
- Progress monitoring by ECMs
- Subject to performance evaluation

---

### 4. **EduCare Manager (ECM)**
**Primary Purpose**: Core operational role focused on student success through micromanagement and monitoring

**Employee Type**: Specialized employee category (short form: ECM)

**Core Responsibilities**:

#### Student Progress Monitoring
- Track daily study habits and homework completion
- Monitor session attendance and participation
- Analyze performance trends and learning outcomes
- Identify learning challenges and intervention needs
- Generate progress reports for guardians

#### Communication Hub
- Regular communication with guardians about student progress
- Coordinate between educators, students, and families
- Handle customer support inquiries and issues
- Facilitate problem resolution and conflict management

#### Task & Schedule Management
- Assign both pre-built and custom tasks to students
- Create personalized study schedules
- Track task completion and homework submission
- Manage session scheduling and rescheduling
- Coordinate educator-student matching

#### Quality Assurance
- Monitor educator performance and curriculum adherence
- Ensure session quality and educational standards
- Provide feedback to educators on student progress
- Escalate issues to management when necessary

**Compensation Model**:
- Hourly-based payment system
- Track working hours (typically 200-225 hours/month)
- Can be direct payroll or freelance basis
- Performance metrics tracked but not directly tied to compensation

---

### 5. **Employee**
**Primary Purpose**: Platform staff handling various operational functions

**Employee Types** (EmployeeType Enum):
- `EDUCARE_MANAGER`: Student progress specialists (detailed above)
- `HR_EXECUTIVE`: Human resource management
- `HR_MANAGER`: Senior HR operations and strategy  
- `HR_INTERN`: HR support and learning roles
- `CONTENT_CREATOR`: Educational content development
- `PLATFORM_ADMIN`: System administration and oversight

#### HR Department Roles
- **HR Executive**: Recruitment, employee relations, policy implementation
- **HR Manager**: Strategic HR planning, team management, performance oversight
- **HR Intern**: Support functions, learning HR processes

#### Content Team
- **Content Creator**: Develop curriculum, educational materials, assessments
- Create video content, animations, and learning resources
- Maintain content quality and educational standards

#### Platform Administration
- **Platform Admin**: System configuration, user management, technical oversight
- Handle escalated issues and system-level problems
- Manage integrations and platform optimization

---

### 6. **Intern**
**Primary Purpose**: Learning-focused roles across various departments

**Intern Types** (InternType Enum):
- `STUDENT_EDUCATOR_INTERN`: Aspiring educators learning teaching methods
- `VIDEO_EDITOR_INTERN`: Video production and editing support
- `CONTENT_CREATOR_INTERN`: Educational content development assistance  
- `HR_INTERN`: Human resources support and learning

**Common Characteristics**:
- Learning-focused with mentorship requirements
- Limited permissions compared to full employees
- Temporary or contract-based engagements
- Specific skill development goals

---

### 7. **Admin**
**Primary Purpose**: Platform owners and system administrators with highest-level access

**Core Responsibilities**:
- System-wide configuration and management
- Role and permission management
- Educator approval and classification
- Rate approval for educators
- Platform policy and rule setting
- Strategic decision making
- Financial oversight and business analytics
- Integration management and system scaling

**Key Capabilities**:
- Full access to all analytics and business intelligence
- User management and role assignment
- System configuration and feature toggles
- Financial data and business metrics
- Technical infrastructure management

## Permission Inheritance Model

### Role-Based Defaults
Each role has default permissions stored in `RolePermissions` model:
```json
// Example: Intern default permissions
{
  "viewReports": true,
  "editContent": false,
  "approveRates": false,
  "manageUsers": false,
  "accessAnalytics": false
}
```

### Individual Overrides
Each user profile can have `permissions` JSON that overrides specific role defaults:
```json
// Example: Individual intern with additional permissions
{
  "editContent": true,        // Override: now allowed
  "accessBasicAnalytics": true // Addition: new permission
}
```

### Permission Resolution
1. Load base permissions from `RolePermissions` for user's role(s)
2. Apply individual profile `permissions` as overrides
3. Final permissions = Base permissions + Profile overrides

### Multi-Role Permission Merging
When users have multiple roles:
1. Merge all role-based permissions (union of permissions)
2. Apply individual profile overrides
3. Most permissive approach (if any role allows, user can perform action)

## Organization-Based Multi-Tenancy

### Organization Model
- Each profile can belong to an organization
- Organization-specific permissions and configurations
- Data isolation between organizations
- Supports both multi-tenant and single-tenant deployments

### Tenant-Specific Permissions
- Organization-level permission templates
- Custom permission sets per organization
- Isolation of user data and analytics
- Organization-specific branding and configuration

## Guardian-Learner Relationships

### Relationship Management
```prisma
model GuardianLearnerRelation {
  relationship  String // "parent", "legal_guardian", "elder_brother", etc.
  permissions   Json?  // What can this guardian do for this learner
  isActive      Boolean
}
```

### Relationship-Specific Permissions
- Different guardians can have different access levels to same learner
- Granular control over what each guardian can do
- Track and audit guardian actions
- Support complex family structures

## Security Considerations

### Access Control
- All permissions checked at API level
- Frontend permissions for UI optimization only
- Audit logging for all permission-based actions
- Regular permission review and cleanup

### Data Privacy
- Learner data access restricted by relationship
- Guardian access limited to their associated learners
- Educator access limited to their assigned students
- ECM access based on assigned learner portfolio

### Permission Validation
- Runtime permission checking for all operations
- Cached permissions for performance optimization
- Automatic permission refresh on role changes
- Fail-safe defaults (deny access if uncertain)

This comprehensive role and permission system enables NextPhoton to maintain security, privacy, and appropriate access control while supporting the complex relationships and workflows required for personalized education management.