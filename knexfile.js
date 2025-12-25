import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const migrations = {
  directory: path.join(__dirname, 'server', 'migrations'),
};

const productionMigrations = {
  directory: path.join(__dirname, 'database', 'migrations'),
};

export const development = {
  client: 'sqlite3',
  connection: {
    filename: path.resolve(__dirname, 'database.sqlite'),
  },
  pool: {
    afterCreate: (conn, cb) => conn.run('PRAGMA foreign_keys = ON', cb),
  },
  useNullAsDefault: true,
  migrations,
};

export const test = {
  client: 'sqlite3',
  connection: ':memory:',
  useNullAsDefault: true,
  // debug: true,
  migrations,
};

export const production = {
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // только для тестирования на Render
    },
  },
  useNullAsDefault: true,
  // debug: true,
  migrations: productionMigrations,
};
