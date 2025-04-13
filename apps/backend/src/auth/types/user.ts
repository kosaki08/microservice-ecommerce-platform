import type { Account } from "@portfolio-2025/prisma-schemas/user-service";

export type User = Pick<Account, "id" | "email"> & {
  firstName: string;
  lastName: string;
};
