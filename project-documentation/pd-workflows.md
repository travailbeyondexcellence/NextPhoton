# NextPhoton Core Workflows

## User Onboarding Workflows

### 1. Learner Onboarding Workflow

#### Step 1: Initial Registration
```
Learner Registration → Email Verification → Basic Profile Creation
```

#### Step 2: Profile Completion
- **Target Exam Selection**: Choose from available exam types (NEET, JEE, etc.)
- **Exam Year Input**: Target year for exam completion
- **Learner Type Classification**: K-12, College, or Adult Learner
- **Guardian Connection**: Link to guardian profiles (optional for adult learners)

#### Step 3: System Prompts & Profile Completion
- **Modal Prompts**: System guides learner through required fields
- **Toaster Notifications**: Reminders for incomplete profile sections
- **Progress Indicators**: Visual feedback on profile completion status

#### Step 4: ECM Assignment & Curriculum Selection
- **ECM Allocation**: System assigns dedicated EduCare Manager
- **Curriculum Assignment**: Auto-assigned based on exam type and current level
- **Difficulty Assessment**: Beginner/Intermediate/Advanced level determination
- **Study Plan Creation**: ECM creates initial personalized study schedule

#### Step 5: Educator Matching Process
- **Requirement Analysis**: ECM analyzes learner needs and budget
- **Educator Shortlisting**: Available educators filtered by subject, exam type, price range
- **Demo Session Scheduling**: Arrange trial sessions with potential educators
- **Final Selection**: Guardian approval and educator confirmation

---

### 2. Guardian Onboarding Workflow

#### Step 1: Registration & Verification
```
Guardian Signup → Email Verification → Identity Verification
```

#### Step 2: Learner Association
- **Learner Connection**: Link to existing learner or create new learner profile
- **Relationship Definition**: Specify relationship type (parent, legal guardian, etc.)
- **Permission Setting**: Define guardian access levels and capabilities
- **Guardian-Learner Relation Creation**: Establish formal relationship in system

#### Step 3: Payment Setup
- **Payment Method Addition**: UPI, cards, or international payment setup
- **Billing Preferences**: Hourly vs course package preferences
- **Budget Definition**: Set learning budget and spending limits
- **Payment History Access**: Historical transaction viewing setup

#### Step 4: Communication Preferences
- **ECM Assignment**: Connect with learner's assigned ECM
- **Notification Settings**: Configure progress updates, session reminders
- **Communication Channels**: Email, SMS, in-app notification preferences
- **Report Frequency**: Weekly/monthly progress report preferences

---

### 3. Educator Onboarding Workflow

#### Step 1: Registration & Initial Profile
```
Educator Signup → Basic Profile Creation → Qualification Upload
```

#### Step 2: Qualification & Verification
- **Document Upload**: Educational certificates, experience proof
- **Demo Video Creation**: Teaching demonstration video upload
- **Subject Expertise**: Select teachable subjects and exam types
- **Availability Setting**: Define teaching hours and schedule preferences

#### Step 3: Admin Review Process
- **Waitlist Status**: Educator enters pending approval queue
- **Admin Evaluation**: Platform admin reviews qualifications and demo
- **Classification Assignment**: Subject matter expertise and level classification
- **Background Verification**: Document authentication and reference checks

#### Step 4: Rate Setting & Approval
- **Rate Proposal**: Educator sets desired hourly rates
- **Admin Rate Review**: Platform admin evaluates and approves rates
- **Market Analysis**: Rate comparison with similar educators
- **Final Approval**: Rate and profile activation

#### Step 5: Platform Training
- **Curriculum Training**: Understanding platform curriculum requirements
- **Tool Training**: Platform features, session management, progress reporting
- **Quality Standards**: Teaching standards and performance expectations
- **Go-Live Process**: Official educator activation on platform

---

## Core Operational Workflows

### 1. Session Booking & Management Workflow

#### Step 1: Session Request Initiation
```
Guardian/Learner → Session Request → Educator Availability Check
```

#### Step 2: Dual Approval Process
- **Educator Availability Confirmation**: Educator confirms time slot availability
- **ECM Review & Approval**: ECM validates session appropriateness and scheduling
- **Conflict Resolution**: Handle scheduling conflicts and alternative suggestions
- **Final Confirmation**: All parties confirm session details

#### Step 3: Session Preparation
- **Study Material Preparation**: ECM ensures relevant materials are ready
- **Technical Setup**: Video link generation, platform access verification
- **Reminder Notifications**: Automated reminders to all participants
- **Backup Planning**: Contingency plans for technical issues

#### Step 4: Session Execution
- **Pre-session Check**: Technical verification and participant readiness
- **Live Session Management**: Real-time monitoring and support
- **Quality Assurance**: Session quality tracking and issue resolution
- **Session Recording**: Automatic recording for later review (if enabled)

#### Step 5: Post-session Activities
- **Attendance Confirmation**: Mark session completion and attendance
- **Progress Update**: Educator provides session feedback and progress notes
- **ECM Review**: ECM analyzes session outcomes and next steps
- **Guardian Notification**: Progress summary sent to guardian

---

### 2. Progress Tracking & Task Management Workflow

#### Step 1: Task Assignment Process
```
ECM Analysis → Task Selection/Creation → Assignment to Learner
```

#### Step 2: Task Types & Sources
- **Pre-built Tasks**: Select from platform task library
- **Custom Tasks**: ECM creates personalized tasks based on learner needs
- **Curriculum-linked Tasks**: Tasks tied to specific curriculum progression
- **Assessment Tasks**: Evaluation and testing assignments

#### Step 3: Task Execution & Monitoring
- **Task Notification**: Learner receives task assignment with deadlines
- **Progress Tracking**: Real-time monitoring of task completion status
- **Support Provision**: ECM available for guidance and clarification
- **Deadline Management**: Automated reminders and deadline tracking

#### Step 4: Completion & Review
- **Submission Process**: Learner submits completed tasks
- **Quality Review**: ECM evaluates task completion quality
- **Feedback Generation**: Detailed feedback and improvement suggestions
- **Progress Recording**: Update learner progress metrics and analytics

---

### 3. Payment Processing Workflow

#### Step 1: Payment Initiation
```
Guardian → Payment Request → System Calculation → Gateway Processing
```

#### Step 2: Payment Method Selection
- **Primary Gateway**: UPI payment attempt (India)
- **Fallback Process**: Razorpay → Paytm (domestic) or Stripe → PayPal (international)
- **Payment Verification**: Transaction authentication and security checks
- **Error Handling**: Failed payment retry mechanisms

#### Step 3: Commission Calculation & Distribution
- **Platform Commission**: Automatic calculation of platform share
- **Educator Allocation**: Educator fee calculation and scheduling
- **ECM Tracking**: Hours worked and compensation calculation
- **Financial Recording**: Transaction logging and financial analytics update

#### Step 4: Confirmation & Documentation
- **Payment Confirmation**: Success notification to all parties
- **Receipt Generation**: Detailed payment receipts and invoices
- **Financial Analytics**: Revenue tracking and business metrics update
- **Audit Trail**: Complete transaction history maintenance

---

## Communication Workflows

### 1. ECM-Guardian Communication Workflow

#### Regular Progress Updates
- **Weekly Progress Reports**: Automated generation of learner progress summaries
- **Real-time Alerts**: Immediate notifications for significant events or concerns
- **Performance Analytics**: Data-driven insights on learner improvement trends
- **Recommendation Provision**: ECM suggestions for optimization and improvement

#### Issue Resolution Process
- **Issue Identification**: ECM identifies learning challenges or concerns
- **Guardian Notification**: Immediate communication of issues and proposed solutions
- **Collaborative Planning**: Joint development of intervention strategies
- **Follow-up Tracking**: Monitor resolution effectiveness and ongoing improvement

---

### 2. Multi-stakeholder Communication Workflow

#### Session Coordination
```
ECM → Educator + Guardian + Learner → Consensus → Action
```

#### Information Flow Management
- **Centralized Communication**: ECM as primary communication hub
- **Role-based Information**: Tailored information sharing based on user roles
- **Privacy Protection**: Appropriate information filtering and access control
- **Documentation**: Complete communication history and decision tracking

---

## Quality Assurance Workflows

### 1. Educator Performance Monitoring

#### Continuous Assessment
- **Session Quality Tracking**: Real-time monitoring of teaching effectiveness
- **Student Progress Attribution**: Educator impact on learner improvement
- **Curriculum Adherence**: Compliance with platform teaching standards
- **Feedback Integration**: Student and guardian feedback incorporation

#### Performance Improvement
- **Issue Identification**: Performance gaps and improvement opportunities
- **Training Provision**: Additional training and skill development
- **Mentoring Support**: Senior educator guidance and support
- **Performance Review**: Regular evaluation and feedback sessions

---

### 2. Platform Quality Management

#### Service Quality Monitoring
- **Technical Performance**: Platform uptime, speed, and reliability tracking
- **User Experience**: Interface usability and satisfaction measurement
- **Content Quality**: Curriculum effectiveness and accuracy verification
- **Support Quality**: Customer service response time and resolution effectiveness

#### Continuous Improvement
- **Feedback Collection**: Systematic user feedback gathering and analysis
- **Issue Resolution**: Rapid response to platform issues and user concerns
- **Feature Enhancement**: Regular platform improvements based on user needs
- **Innovation Integration**: New feature development and testing

This comprehensive workflow documentation ensures all NextPhoton stakeholders understand their roles, responsibilities, and the processes that govern platform operations, enabling efficient and effective educational service delivery.