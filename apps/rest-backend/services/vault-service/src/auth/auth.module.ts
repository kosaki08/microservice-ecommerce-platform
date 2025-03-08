import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { JwtAuthGuard } from "@/src/auth/jwt-auth.guard";

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): JwtModuleOptions => ({
        secret: configService.get<string>("JWT_SECRET_KEY"),
        signOptions: {
          expiresIn: configService.get<string>("JWT_EXPIRES_IN", "3600s"),
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  providers: [JwtAuthGuard],
  exports: [JwtAuthGuard, JwtModule],
})
export class AuthModule {}
