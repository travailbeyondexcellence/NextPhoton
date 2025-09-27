# Architectural Decision Reasoning

## Overview
This document explains the reasoning behind the architectural decisions made in the proposed Prisma schema design for the NextPhoton EduCare Management System.

## 1. JWT Authentication Model

### Decision
Implement JWT (JSON Web Token) based authentication using NestJS backend with Passport JWT strategy.

### Reasoning
- **Stateless Authentication**: JWTs are self-contained, reducing database lookups for session validation
- **Microservice Ready**: Tokens can be validated independently by any service with the secret key
- **Mobile/Desktop Support**: Better support for native applications compared to session cookies
- **Industry Standard**: JWT is widely adopted and well-supported across frameworks

### Implementation
- User model contains authentication fields (email, password hash)
- JWT tokens issued on successful authentication containing user ID and roles
- Token validation through NestJS guards and Passport JWT strategy
- Refresh token mechanism for enhanced security

## 2. Multi-Role Support Architecture

### Decision
Users can have multiple roles simultaneously through a `UserRoles` junction model with a `Role` enum.

### Reasoning
- **Real-world Flexibility**: A person can be both a guardian and an educator, or an employee and an admin
- **Business Requirements**: Educational institutions often have staff who wear multiple hats
- **Performance**: Single query to UserRoles table shows all user's roles, then query specific profile tables
- **Enum Benefits**: Type safety, database constraints, easy to extend

### Implementation
```prisma
model UserRoles {
  userId String
  role   Role
  @@unique([userId, role]) // Prevents duplicate role assignments
}
```

## 3. Hierarchical Permissions System

### Decision
Implement inheritance-based permissions with role defaults and profile-specific overrides.

### Reasoning
- **Efficiency**: Profile permissions only store deltas/changes, not full permission sets
- **Maintainability**: Role permission updates automatically apply to all users of that role
- **Granular Control**: Can both grant additional permissions and revoke specific ones per user
- **Performance**: Smaller JSON objects in database, faster queries
- **ABAC Compliance**: Supports fine-grained attribute-based access control

### Permission Resolution Logic
1. Load base permissions from `RolePermissions` for user's role(s)
2. Apply individual profile `permissions` JSON as overrides
3. Merge: Profile permissions override specific keys in role permissions

### Example
- **Role Default (Intern)**: `{"viewReports": true, "editReports": false, "deleteReports": false}`
- **Profile Override**: `{"editReports": true, "viewFinancials": true}`
- **Final Result**: `{"viewReports": true, "editReports": true, "deleteReports": false, "viewFinancials": true}`

## 4. Multi-Tenant Organization Model

### Decision
Add `Organization` model with optional relationships to all profile types.

### Reasoning
- **Scalability**: Supports multiple educational institutions on single platform
- **Data Isolation**: Tenant-specific data separation for security and compliance
- **Business Model**: Enables SaaS pricing per organization
- **Future Growth**: Can add organization-specific features, branding, settings

### Implementation
- Optional `organizationId` in all profiles (allows users without org assignment)
- Organization-level settings and configurations
- Supports both multi-tenant and single-tenant deployments

## 5. Profile Model Design

### Decision
Separate profile model for each role with common fields and role-specific extensions.

### Reasoning
- **Type Safety**: Each role has its own TypeScript types
- **Performance**: Query only relevant profile data
- **Extensibility**: Easy to add role-specific fields without affecting others
- **Database Optimization**: Indexes and constraints specific to each role

### Common Fields Rationale
- `createdAt/updatedAt`: Audit trail for all profiles
- `isActive`: Soft delete/deactivation without losing data
- `onboardingCompleted`: Track user journey completion
- `permissions`: Role-specific permission overrides
- `organizationId`: Multi-tenant support

## 6. Guardian-Learner Relationship Model

### Decision
Create explicit relationship model with permissions and relationship context.

### Reasoning
- **Complex Relationships**: Guardians can have different types of relationships (parent, legal guardian, elder sibling)
- **Granular Permissions**: Different guardians may have different access levels to same learner
- **Audit Trail**: Track who has access and when relationships were established
- **Flexibility**: Supports multiple guardians per learner and multiple learners per guardian

### Relationship Features
- `relationship` field: Human-readable relationship type
- `permissions` JSON: What specific actions this guardian can perform
- `isActive`: Enable/disable relationships without deletion
- Unique constraint prevents duplicate relationships

## 7. Database Design Principles Applied

### SOLID Principles
- **Single Responsibility**: Each model has one clear purpose
- **Open/Closed**: Easy to extend with new roles/fields without modifying existing code
- **Interface Segregation**: Separate interfaces for each role type
- **Dependency Inversion**: Depend on abstractions (Role enum) not concretions

### Database Best Practices
- **Normalization**: No data duplication, proper foreign keys
- **Constraints**: Unique constraints prevent data inconsistencies
- **Cascading Deletes**: Maintain referential integrity
- **Indexing Ready**: Foreign keys and unique constraints create natural indexes

## 8. Future Extensibility

### New Roles
Adding a new role requires:
1. Add to `Role` enum
2. Create new profile model following the pattern
3. Add relationship to User model
4. Create default permissions in `RolePermissions`

### New Permissions
- Add to role defaults in `RolePermissions`
- Override in individual profiles as needed
- No schema changes required

### New Features
- Organization-specific features: Add to Organization model
- Role-specific features: Add to respective profile model
- Cross-cutting features: Add to common profile fields

## 9. Performance Considerations

### Query Efficiency
- Role checking: Single query to `UserRoles`
- Permission resolution: Two queries max (role defaults + profile overrides)
- Profile data: Query only needed profile types

### Storage Efficiency
- Profile permissions store only deltas, not full permission sets
- Optional organization relationships save space for single-tenant deployments
- JSON fields provide flexibility without schema changes

### Scalability
- Horizontal partitioning possible by organizationId
- Indexes on foreign keys for fast joins
- Enum constraints ensure data quality

This architecture provides a robust, scalable, and maintainable foundation for the NextPhoton EduCare Management System while adhering to SOLID principles and database best practices.