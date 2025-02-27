import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HeaderController } from './controllers/header.controller';
import { HeaderService } from './services/header.service';
import { Header, HeaderSchema } from './schemas/header.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Header.name, schema: HeaderSchema }])],
  controllers: [HeaderController],
  providers: [HeaderService],
})
export class HeaderModule {}
