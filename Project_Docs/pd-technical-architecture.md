# NextPhoton Technical Architecture

## Architecture Overview

NextPhoton follows a **microservices-oriented monorepo architecture** designed for scalability, maintainability, and multi-platform support.

## Repository Structure

```
/root/ZenTech/NextPhoton/
├── client/                 # Next.js 15 Web Application
├── server/                 # NestJS Backend API
├── mobile/                 # Flutter Mobile Application (planned)
├── video-client/           # Separate Video Session Client (planned)
├── shared/                 # Shared utilities, types, database
├── project-documentation/  # Comprehensive project docs
└── brainstorming/         # Schema and architecture planning
```

## Technology Stack

### Frontend Technologies
- **Web Client**: Next.js 15 with App Router
- **Mobile Client**: Flutter (planned)
- **Video Client**: Separate Next.js app for live sessions (planned)
- **UI Framework**: Radix UI + ShadCN components
- **Styling**: Tailwind CSS v4 with dark mode support
- **State Management**: Zustand for global state
- **Form Handling**: React Hook Form with Zod validation

### Backend Technologies
- **API Framework**: NestJS with Express
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better-auth with session management
- **Real-time**: WebSocket support for live features
- **File Storage**: Google Drive API integration
- **Caching**: Redis for session and data caching

### Infrastructure & DevOps
- **Containerization**: Docker for all services
- **Orchestration**: Docker Compose for local development
- **Cloud Provider**: Multi-cloud strategy (primary + fallback)
- **CI/CD**: GitHub Actions for automated deployments
- **Monitoring**: Application and infrastructure monitoring
- **Analytics**: Custom analytics service + third-party integrations

## Database Architecture

### Prisma Schema Design
Located at: `shared/prisma/schema.prisma`

#### Core Design Principles
1. **Separation of Concerns**: Better-auth models isolated from business logic
2. **Multi-tenancy**: Organization-based data isolation
3. **ABAC Support**: Role-based permissions with individual overrides
4. **Audit Trail**: Created/updated timestamps on all models
5. **Soft Deletes**: `isActive` flags for data preservation

#### Key Model Categories
```prisma
// Authentication (Better-auth)
User, Session, Account, Verification

// Role Management
enum Role { LEARNER, GUARDIAN, EDUCATOR, EMPLOYEE, INTERN, ADMIN }
UserRoles, RolePermissions

// User Profiles (one per role type)
LearnerProfile, GuardianProfile, EducatorProfile
EmployeeProfile, InternProfile, AdminProfile

// Relationships
GuardianLearnerRelation

// Multi-tenancy
Organization

// Curriculum & Learning (future)
Exam, Curriculum, Subject, Topic
Session, Task, Assignment, Assessment
```

#### Permission System Architecture
- **Hierarchical Permissions**: Role defaults + individual overrides
- **Inheritance Model**: Profile permissions override role permissions
- **JSON Storage**: Flexible permission structures
- **Multi-role Support**: Users can have multiple simultaneous roles

## API Architecture

### NestJS Backend Structure
```
server/src/
├── auth/           # Authentication & authorization
├── users/          # User management across all roles
├── learners/       # Learner-specific operations
├── educators/      # Educator management & onboarding
├── sessions/       # Session booking & management  
├── progress/       # Learning progress tracking
├── tasks/          # Task assignment & completion
├── curriculum/     # Curriculum & exam management
├── payments/       # Payment processing
├── analytics/      # Data analytics & reporting
├── notifications/  # Real-time notifications
├── files/          # File upload & Google Drive integration
└── common/         # Shared services, guards, interceptors
```

### API Design Principles
1. **RESTful Design**: Standard HTTP methods and status codes
2. **Role-based Endpoints**: Different endpoints for different user types
3. **Permission Guards**: Every endpoint protected by role/permission checks
4. **Data Validation**: Zod schemas for request/response validation
5. **Error Handling**: Consistent error response format
6. **Rate Limiting**: API abuse prevention
7. **Audit Logging**: All actions logged for security and analytics

## Authentication & Security

### Better-auth Integration
- **Session-based Authentication**: Secure session management
- **Database Sessions**: Sessions stored in PostgreSQL
- **Multi-factor Authentication**: Email verification + optional 2FA
- **Password Security**: Bcrypt hashing with salt
- **Session Security**: Secure cookies, CSRF protection

### Authorization Architecture
```typescript
// Permission checking flow
1. Extract user session from request
2. Load user roles from UserRoles table
3. Load role-based permissions from RolePermissions
4. Apply individual permission overrides from user profile
5. Check if required permission exists in final permission set
6. Allow/deny access based on permission check
```

### Security Features
- **ABAC Implementation**: Fine-grained access control
- **Organization Isolation**: Multi-tenant data security
- **Input Validation**: All inputs validated and sanitized
- **SQL Injection Prevention**: Prisma ORM parameterized queries
- **XSS Protection**: Content Security Policy headers
- **Rate Limiting**: API endpoint protection
- **Audit Logging**: Security event tracking

## Real-time Features

### WebSocket Architecture
- **Socket.io Integration**: Real-time bidirectional communication
- **Room-based Organization**: Users join rooms based on roles/relationships
- **Authentication**: Socket connections authenticated via session
- **Event Types**: Notifications, progress updates, chat messages, session alerts

### Real-time Use Cases
1. **Instant Notifications**: Task assignments, session reminders, announcements
2. **Live Progress Updates**: Real-time homework completion, session attendance
3. **Chat System**: ECM-Guardian-Learner communication
4. **Session Alerts**: Live session notifications, technical issues
5. **Dashboard Updates**: Real-time analytics and metrics

## Video Integration Architecture

### Video Platform Hierarchy
1. **Primary**: Custom WebRTC solution
2. **Fallback 1**: Google Meet API integration
3. **Fallback 2**: Zoom API integration

### Video Client Separation
- **Separate Repository**: `video-client/` for live session management
- **Independent Scaling**: Video services can scale separately
- **Specialized Features**: Screen sharing, recording, whiteboard
- **Integration Points**: Session booking triggers video room creation

### Video Features
- **One-on-One Sessions**: Educator-Learner private sessions
- **Small Batch Sessions**: Multiple learners with one educator
- **Recording Capability**: Session recording for later review
- **Screen Sharing**: Educator screen sharing for demonstrations
- **Interactive Whiteboard**: Collaborative learning tools

## Payment Integration

### Payment Gateway Hierarchy

#### Domestic (India)
1. **Primary**: UPI integration (direct bank transfers)
2. **Fallback 1**: Razorpay (cards, wallets, UPI)
3. **Fallback 2**: Paytm (mobile payments, wallets)

#### International
1. **Primary**: Stripe (global card processing)
2. **Fallback**: PayPal (alternative international payment)

### Payment Architecture
```typescript
// Payment processing flow
1. Guardian initiates payment (session/course)
2. System calculates total cost and educator allocation
3. Primary payment gateway attempted
4. Fallback to secondary gateway if primary fails
5. Success: Educator fee allocated, platform commission calculated
6. Failure: User notified, transaction logged for retry
```

### Financial Features
- **Automated Commission Calculation**: Platform profit margin automatic
- **Educator Payment Processing**: Automated educator compensation
- **ECM Hour Tracking**: Time-based compensation calculation
- **Refund Management**: Automated refund processing
- **Financial Analytics**: Real-time revenue and cost tracking

## File Storage & Management

### Google Drive Integration
- **Primary Storage**: Google Drive API for all file uploads
- **Organized Structure**: Folder hierarchy by user type and organization
- **Access Control**: Drive permissions sync with platform permissions
- **File Types**: Qualifications, assignments, resources, recordings

### File Categories
```
Google Drive Structure:
├── Organizations/
│   ├── {org-id}/
│   │   ├── Educators/
│   │   │   ├── Qualifications/
│   │   │   └── Demo-Videos/
│   │   ├── Learners/
│   │   │   ├── Assignments/
│   │   │   └── Progress-Reports/
│   │   └── Content/
│   │       ├── Curriculum/
│   │       └── Resources/
```

## Mobile Architecture (Flutter)

### Flutter App Structure
```
mobile/
├── lib/
│   ├── core/           # Core utilities, constants
│   ├── data/           # Data layer, API clients
│   ├── domain/         # Business logic, entities
│   ├── presentation/   # UI layer, screens, widgets
│   ├── shared/         # Shared widgets, utilities
│   └── main.dart
```

### Mobile-Specific Features
- **Offline Capability**: Local data caching for limited connectivity
- **Push Notifications**: Firebase integration for real-time alerts
- **Biometric Authentication**: Fingerprint/face recognition
- **Deep Linking**: Direct navigation to specific content
- **Performance Optimization**: Efficient list rendering, image caching

## Analytics Architecture

### Data Collection Strategy
- **Event Tracking**: User interactions, session data, performance metrics
- **Real-time Analytics**: Live dashboard updates, instant insights
- **Batch Processing**: Daily/weekly/monthly aggregate calculations
- **Multi-dimensional Analysis**: User, organization, time-based analytics

### Analytics Data Flow
```
1. Frontend Events → Analytics API
2. Database Operations → Audit Logs
3. Real-time Processing → Live Dashboards  
4. Batch Processing → Historical Reports
5. Machine Learning → Predictive Insights
```

## Scalability Considerations

### Horizontal Scaling
- **Database Partitioning**: Organization-based data partitioning
- **Service Separation**: Independent scaling of video, analytics, core API
- **CDN Integration**: Global content delivery for static assets
- **Load Balancing**: Multi-instance API deployment

### Performance Optimization
- **Database Indexing**: Optimized queries for common operations
- **Caching Strategy**: Redis for session, API response caching
- **API Optimization**: Efficient data fetching, pagination
- **Frontend Performance**: Code splitting, lazy loading, image optimization

### Monitoring & Observability
- **Application Monitoring**: Performance metrics, error tracking
- **Infrastructure Monitoring**: Server health, resource utilization
- **User Experience Monitoring**: Page load times, user interaction tracking
- **Security Monitoring**: Authentication attempts, permission violations

## Development Workflow

### Local Development
```bash
# Start all services
npm run start:all

# Database operations
npm run prisma:push
npm run prisma:studio

# Individual service development
cd client && npm run dev
cd server && npm run dev
```

### Testing Strategy
- **Unit Tests**: Individual component/service testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: User workflow testing
- **Performance Tests**: Load testing for scalability validation

### Deployment Pipeline
1. **Development**: Local development and testing
2. **Staging**: Production-like environment testing
3. **Production**: Blue-green deployment strategy
4. **Monitoring**: Post-deployment health checks

This architecture provides a robust, scalable foundation for NextPhoton's comprehensive educational platform while maintaining flexibility for future enhancements and integrations.