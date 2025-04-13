import { Controller, Get } from "@nestjs/common";
import { AppService } from "@/src/app.service";

@Controller()
export class AppController {
  public constructor(private readonly appService: AppService) {}

  @Get()
  public getHello(): string {
    return this.appService.getHello();
  }
}
