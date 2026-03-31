/**
 * Typed Error Classes
 * Extends standard Error to provide context without leaking unhandled exceptions.
 */

export class DomainError extends Error {
  constructor(message: string, public readonly code: string = 'DOMAIN_ERROR') {
    super(message);
    this.name = 'DomainError';
  }
}

export class ValidationError extends Error {
  constructor(message: string, public readonly issues?: ReadonlyArray<unknown>) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthError extends Error {
  constructor(message: string = 'Unauthorized') {
    super(message);
    this.name = 'AuthError';
  }
}

export class InfraError extends Error {
  constructor(message: string, public readonly originalError?: unknown) {
    super(message);
    this.name = 'InfraError';
  }
}
