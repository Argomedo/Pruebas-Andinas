/**
 * Shared Logger Interface for the Application
 * All structured logging must pass through this module.
 */

export const logger = {
  info: (message: string, context?: Record<string, unknown>) => {
    // In production, this would go to CloudWatch, Datadog, etc.
    console.info(JSON.stringify({ level: "INFO", message, timestamp: new Date().toISOString(), ...context }));
  },
  warn: (message: string, context?: Record<string, unknown>) => {
    console.warn(JSON.stringify({ level: "WARN", message, timestamp: new Date().toISOString(), ...context }));
  },
  error: (message: string, error?: Error | unknown, context?: Record<string, unknown>) => {
    const errorDetails = error instanceof Error ? { errorName: error.name, errorMessage: error.message, stack: error.stack } : { error };
    console.error(JSON.stringify({ level: "ERROR", message, timestamp: new Date().toISOString(), ...errorDetails, ...context }));
  },
  debug: (message: string, context?: Record<string, unknown>) => {
    if (process.env.NODE_ENV !== "production") {
      console.debug(JSON.stringify({ level: "DEBUG", message, timestamp: new Date().toISOString(), ...context }));
    }
  }
};
