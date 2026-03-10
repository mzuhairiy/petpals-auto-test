import path from 'path';
import fs from 'fs';

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
} as const;

type LogLevel = keyof typeof levels;

const colors: Record<LogLevel, string> = {
    error: '\x1b[31m',
    warn: '\x1b[33m',
    info: '\x1b[32m',
    debug: '\x1b[34m',
};

const RESET = '\x1b[0m';

class Logger {
    private logDir: string;
    private currentLevel: number;

    constructor() {
        this.logDir = path.join(__dirname, '../../logs');
        this.currentLevel = levels.debug;

        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }

    private formatMessage(level: LogLevel, message: string): string {
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
        return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    }

    private writeToFile(filename: string, message: string): void {
        const filePath = path.join(this.logDir, filename);
        fs.appendFileSync(filePath, message + '\n');
    }

    private log(level: LogLevel, message: string): void {
        if (levels[level] > this.currentLevel) return;

        const formatted = this.formatMessage(level, message);

        // Console output with color
        console.log(`${colors[level]}${formatted}${RESET}`);

        // Write to combined log
        this.writeToFile('combined.log', formatted);

        // Write errors to separate file
        if (level === 'error') {
            this.writeToFile('error.log', formatted);
        }
    }

    error(message: string): void {
        this.log('error', message);
    }

    warn(message: string): void {
        this.log('warn', message);
    }

    info(message: string): void {
        this.log('info', message);
    }

    debug(message: string): void {
        this.log('debug', message);
    }
}

const logger = new Logger();

const addTestInfo = (testInfo: { title: string }) => {
    return (message: string): string => {
        return `[${testInfo.title}] ${message}`;
    };
};

export { logger, addTestInfo };
