import { EmailModule } from '@gedu/email';
import { PrismaModule } from '@gedu/prisma';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EduStaffService } from './edu-staffs.service';
import { EduStaffController } from './edu-staffs.controller'; 

/**  
 * EduStaffModule configures Prisma for education staff features.  
 * Email delivery and Kafka integration are handled by global modules (EmailModule, KafkaModule) registered in AppModule. 
 */  
@Module({
  imports: [
    PrismaModule,
  ],
  controllers: [EduStaffController],
  providers: [JwtService, EduStaffService],
  exports: [],
})
export class EduStaffModule { }
