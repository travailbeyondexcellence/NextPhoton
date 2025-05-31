import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

/**
 * Custom GraphQL Date Scalar
 * 
 * This scalar type handles the serialization and parsing of Date objects
 * between GraphQL and TypeScript. It ensures consistent date handling
 * across the API and provides proper validation.
 * 
 * Features:
 * - ISO 8601 string format for transport
 * - Automatic Date object conversion
 * - Input validation for date strings
 * - Error handling for invalid dates
 */
@Scalar('Date', () => Date)
export class DateScalar implements CustomScalar<string, Date> {
  description = 'Date custom scalar type (ISO 8601 format)';

  /**
   * Serialize Date object to string for GraphQL response
   * 
   * @param value - Date object to serialize
   * @returns ISO 8601 date string
   */
  serialize(value: unknown): string {
    if (value instanceof Date) {
      return value.toISOString();
    }
    
    // Handle string dates
    if (typeof value === 'string') {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error(`Invalid date string: ${value}`);
      }
      return date.toISOString();
    }
    
    throw new Error(`Value must be a Date object or valid date string: ${value}`);
  }

  /**
   * Parse date string from GraphQL input to Date object
   * 
   * @param value - ISO 8601 date string from client
   * @returns Date object
   */
  parseValue(value: unknown): Date {
    if (typeof value !== 'string') {
      throw new Error(`Date value must be a string, received: ${typeof value}`);
    }
    
    const date = new Date(value);
    
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date string: ${value}`);
    }
    
    return date;
  }

  /**
   * Parse date literal from GraphQL query AST
   * 
   * @param ast - GraphQL AST node containing the date value
   * @returns Date object
   */
  parseLiteral(ast: ValueNode): Date {
    if (ast.kind !== Kind.STRING) {
      throw new Error(`Date literal must be a string, received: ${ast.kind}`);
    }
    
    const date = new Date(ast.value);
    
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date string in literal: ${ast.value}`);
    }
    
    return date;
  }
}