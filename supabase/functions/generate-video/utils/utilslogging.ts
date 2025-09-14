// supabase/functions/generate-video/utils/logging.ts

/**
 * Log levels
 */
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

/**
 * Environment-specific log level
 * In production, set this to INFO or higher
 */
const currentLogLevel =
  process.env.NODE_ENV === "production" ? LogLevel.INFO : LogLevel.DEBUG;

/**
 * Interface for a log entry
 */
interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: any;
}

/**
 * Simple logger for video generation service
 */
class Logger {
  /**
   * Log a message at the DEBUG level
   * @param message Message to log
   * @param context Additional context (optional)
   */
  debug(message: string, context?: any): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Log a message at the INFO level
   * @param message Message to log
   * @param context Additional context (optional)
   */
  info(message: string, context?: any): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Log a message at the WARN level
   * @param message Message to log
   * @param context Additional context (optional)
   */
  warn(message: string, context?: any): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Log a message at the ERROR level
   * @param message Message to log
   * @param context Additional context (optional)
   */
  error(message: string, context?: any): void {
    this.log(LogLevel.ERROR, message, context);
  }

  /**
   * Internal method to log a message at the specified level
   * @param level Log level
   * @param message Message to log
   * @param context Additional context (optional)
   * @private
   */
  private log(level: LogLevel, message: string, context?: any): void {
    // Only log if the level is at or above the current log level
    if (level < currentLogLevel) {
      return;
    }

    // Create log entry
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
    };

    // Format log entry
    const formattedEntry = this.formatLogEntry(entry);

    // Output log entry to appropriate destination
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedEntry);
        break;
      case LogLevel.INFO:
        console.info(formattedEntry);
        break;
      case LogLevel.WARN:
        console.warn(formattedEntry);
        break;
      case LogLevel.ERROR:
        console.error(formattedEntry);
        break;
    }

    // In a production environment, you might want to:
    // - Send logs to an external logging service
    // - Store logs in a database table
    // - Forward important logs to a monitoring system
  }

  /**
   * Format a log entry for output
   * @param entry Log entry to format
   * @returns Formatted log entry
   * @private
   */
  private formatLogEntry(entry: LogEntry): string {
    // Get log level name
    const levelName = LogLevel[entry.level];

    // Format log entry
    let formatted = `[${entry.timestamp}] [${levelName}] ${entry.message}`;

    // Add context if available
    if (entry.context) {
      try {
        // For simple context (strings, numbers), append directly
        if (
          typeof entry.context === "string" ||
          typeof entry.context === "number"
        ) {
          formatted += ` - ${entry.context}`;
        }
        // For errors, append name and message
        else if (entry.context instanceof Error) {
          formatted += ` - ${entry.context.name}: ${entry.context.message}`;
          if (entry.context.stack) {
            formatted += `\n${entry.context.stack}`;
          }
        }
        // For objects, format as JSON
        else {
          const contextStr = JSON.stringify(
            entry.context,
            (key, value) => {
              // Handle circular references
              if (typeof value === "object" && value !== null) {
                if (value instanceof Error) {
                  return {
                    name: value.name,
                    message: value.message,
                    stack: value.stack,
                  };
                }
              }
              return value;
            },
            2,
          );

          formatted += `\n${contextStr}`;
        }
      } catch (error) {
        formatted += ` - [Context serialization error: ${error instanceof Error ? error.message : String(error)}]`;
      }
    }

    return formatted;
  }
}

// Export a singleton logger instance
export const logger = new Logger();
