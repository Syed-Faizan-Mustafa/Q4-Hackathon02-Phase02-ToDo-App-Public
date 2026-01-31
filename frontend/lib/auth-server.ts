import { betterAuth } from 'better-auth';
import { Pool } from 'pg';

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Better Auth server configuration with PostgreSQL persistence
export const auth = betterAuth({
  // Database - using direct PostgreSQL connection
  database: pool,

  // Secret for signing tokens
  secret: process.env.BETTER_AUTH_SECRET || 'development-secret-change-in-production',

  // Email & password authentication
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },

  // Trusted origins for CORS - include production URLs
  trustedOrigins: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    ...(process.env.NEXT_PUBLIC_AUTH_URL ? [process.env.NEXT_PUBLIC_AUTH_URL] : []),
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
  ],
});
