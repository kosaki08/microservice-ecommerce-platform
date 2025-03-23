import { type Account } from "@prisma/client";

export type User = Pick<Account, "id" | "email"> & {
  firstName: string;
  lastName: string;
};
