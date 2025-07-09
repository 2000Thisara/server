import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { connectDB } from '../utils/config';
import { ProductsModule } from '../products/products.module';
import { SliderModule } from '../slider/slider.module';
import { HeaderModule } from '../header/header.module';
import { FooterModule } from '../footer/footer.module';
import { UsersModule } from 'src/users/users.module';
import { CommandModule } from 'nestjs-command';
import { CartModule } from 'src/cart/cart.module';
import { OrderModule } from '../orders/order.module';
import { CategoryModule } from 'src/category/category.module';
// import { SeedsModule } from '../seeds/seeds.module';
import { AppController } from './controllers/app.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { AppService } from './services/app.service';
import { ServicesModule } from 'src/services/services.module';
import { privacyPolicyModule } from 'src/privacyPolicy/privacyPolicy.module';
import { BranchesModule } from 'src/branches/branches.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: connectDB,
    }),
    CommandModule,
    ProductsModule,
    UsersModule,
    SliderModule,
    HeaderModule,
    FooterModule,
    CartModule,
    OrderModule,
    CloudinaryModule,
    CategoryModule,
    ServicesModule,
    privacyPolicyModule,
    BranchesModule
    // SeedsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
