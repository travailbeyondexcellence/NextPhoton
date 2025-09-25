/**
 * Roles Decorator
 * 
 * Custom decorator to specify which roles can access a route
 * Used in conjunction with RolesGuard for role-based access control
 * 
 * Usage:
 * @Roles('admin', 'educator')
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * someMethod() { ... }
 */

import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Decorator to set required roles for a route
 * 
 * @param roles - Array of role names that are allowed to access the route
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);