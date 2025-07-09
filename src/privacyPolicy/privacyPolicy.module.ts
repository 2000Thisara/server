import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { privacyPolicy, privacyPolicySchema } from './privacyPolicy.schema';
import { privacyPolicyService } from './privacyPolicy.service';
import { privacyPolicyController } from './privacyPolicy.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: privacyPolicy.name, schema: privacyPolicySchema }]),
  ],
  controllers: [privacyPolicyController],
  providers: [privacyPolicyService],
})
export class privacyPolicyModule {}