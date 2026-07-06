declare module "@prisma/client/default" {
  // Prisma v7 exports PrismaClient from the generated default entry.
  // Keep the type loose to avoid constructor/options shape mismatches.
  export class PrismaClient {
    constructor(...args: any[]);
  }
}
