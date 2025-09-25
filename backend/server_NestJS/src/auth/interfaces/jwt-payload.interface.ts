/**
 * JWT Payload Interface
 * 
 * Defines the structure of data stored in JWT tokens
 * Used for user identification and authorization
 */

export interface JwtPayload {
  /**
   * Subject - User's unique identifier
   */
  sub: string;

  /**
   * User's email address
   */
  email: string;

  /**
   * Array of role names assigned to the user
   * Used for role-based access control
   */
  roles: string[];

  /**
   * Optional: Token issued at timestamp
   * Automatically added by JWT library
   */
  iat?: number;

  /**
   * Optional: Token expiration timestamp
   * Automatically added by JWT library
   */
  exp?: number;
}