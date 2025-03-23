export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: UserStatus;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type UserStatus = "ACTIVE" | "SUSPENDED" | "LOCKED" | "INACTIVE";
