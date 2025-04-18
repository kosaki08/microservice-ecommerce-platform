import { Injectable, Logger } from "@nestjs/common";
import type { Account, Profile } from "@portfolio-2025/prisma-schemas";
import { mapToUser, type User } from "@portfolio-2025/shared";
import { PrismaService } from "@/src/prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: Logger = new Logger(UsersService.name),
  ) {}

  async findById(id: string): Promise<User | null> {
    this.logger.log(`findById: ${id}`);
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
    this.logger.log(`findAll`);

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
