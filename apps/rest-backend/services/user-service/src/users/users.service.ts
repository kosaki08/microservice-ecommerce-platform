import { Injectable } from "@nestjs/common";
import { mapToUser } from "@portfolio-2025/shared/src/utils";
import type { Account, Profile } from "@prisma/client";
import type { User } from "@/src/auth/types/user";
import { PrismaService } from "@/src/prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const account = await this.prisma.account.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!account || !account.profile) {
      return null;
    }

    return mapToUser(account, account.profile);
  }

  async findAll(): Promise<User[]> {
    const accounts = await this.prisma.account.findMany({
      include: { profile: true },
      where: { deleted_at: null },
    });

    // 必要なフィールドがあるデータのみを選択
    return accounts
      .filter((account): account is Account & { profile: Profile } => account.profile !== null && account.profile !== undefined)
      .map((account) => mapToUser(account, account.profile));
  }
}
