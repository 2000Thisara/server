import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FooterController } from './controllers/footer.controller';
import { FooterService } from './services/footer.service';
import { Footer, FooterSchema } from './schemas/footer.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Footer.name, schema: FooterSchema }])],
  controllers: [FooterController],
  providers: [FooterService],
})
export class FooterModule {}
