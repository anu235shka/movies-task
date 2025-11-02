import { defineConfig } from "prisma/config";
import dotenv from 'dotenv';
import path from 'path';

// Load .env file explicitly
dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
};
