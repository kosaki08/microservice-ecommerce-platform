import type { Account, Profile } from "@portfolio-2025/prisma-schemas/user-service";
import type { User } from "@/types";

export const mapToUser = (account: Account, profile: Profile): User => {
  return {
    id: account.id,
    email: account.email,
    firstName: profile.first_name,
    lastName: profile.last_name,
    status: account.status,
    isVerified: account.is_verified,
    createdAt: account.created_at,
    updatedAt: account.updated_at,
  };
};
