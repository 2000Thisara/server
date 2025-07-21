// import {
//   Body,
//   Controller,
//   Delete,
//   Get,
//   Param,
//   Post,
//   Put,
//   Query,
//   Session,
//   UseGuards,
// } from '@nestjs/common';
// import { AdminGuard } from 'src/guards/admin.guard'; // Guard to allow only admin users
// import { AuthGuard } from 'src/guards/auth.guard'; // Guard to allow authenticated users
// import { ProductDto } from '../dtos/product.dto'; // DTO for product data transfer
// import { ReviewDto } from '../dtos/review.dto'; // DTO for review data transfer
// import { ProductsService } from '../services/products.service'; // Service to handle product-related logic

// @Controller('products') // Defines the route prefix for this controller
// export class ProductsController {
//   constructor(private productsService: ProductsService) {}

//   // Retrieves a list of products, optionally filtered by keyword and paginated by pageId
//   @Get()
//   getProducts(
//     @Query('keyword') keyword: string,
//     @Query('pageId') pageId: string
//   ) {
//     return this.productsService.findMany(keyword, pageId);
//   }

//   // Retrieves a list of top-rated products
//   @Get('topRated')
//   getTopRatedProducts() {
//     return this.productsService.findTopRated();
//   }

//   // Retrieves details of a single product by its ID
//   @Get(':id')
//   getProduct(@Param('id') id: string) {
//     return this.productsService.findById(id);
//   }

//   // Deletes a product by its ID; only accessible to admin users
//   @UseGuards(AdminGuard)
//   @Delete(':id')
//   deleteUser(@Param('id') id: string) {
//     return this.productsService.deleteOne(id);
//   }

//   // Creates a sample product; only accessible to admin users
//   @UseGuards(AdminGuard)
//   @Post()
//   createProduct() {
//     return this.productsService.createSample();
//   }

//   // Updates a product by its ID with provided product data; only accessible to admin users
//   @UseGuards(AdminGuard)
//   @Put(':id')
//   updateProduct(@Param('id') id: string, @Body() product: ProductDto) {
//     console.log(product.image);
//     return this.productsService.update(id, product);
//   }

//   // Creates a review for a product by its ID; only accessible to authenticated users
//   @UseGuards(AuthGuard)
//   @Put(':id/review')
//   createReview(
//     @Param('id') id: string,
//     @Body() { rating, comment }: ReviewDto,
//     @Session() session: any
//   ) {
//     return this.productsService.createReview(id, session.user, rating, comment);
//   }
// }


import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from 'src/guards/admin.guard'; // Guard to allow only admin users
import { AuthGuard } from 'src/guards/auth.guard'; // Guard to allow authenticated users
import { ProductDto } from '../dtos/product.dto'; // DTO for product data transfer
import { ReviewDto } from '../dtos/review.dto'; // DTO for review data transfer
import { ProductsService } from '../services/products.service'; // Service to handle product-related logic
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose'; // Mongoose Types for ObjectId

@Controller('products') // Defines the route prefix for this controller
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  // Retrieves a list of products, optionally filtered by keyword and paginated by pageId
  @Get()
  getProducts(
    @Query('keyword') keyword: string,
    @Query('pageId') pageId: string
  ) {
    return this.productsService.findMany(keyword, pageId);
  }

  // Retrieves a list of top-rated products
  @Get('topRated')
  getTopRatedProducts() {
    return this.productsService.findTopRated();
  }

  // Retrieves all unique categories from products
  @Get('category/:category')
  getProductsByCategory(
    @Param('category') category: string,
    @Query('page') page?: string
  ) {
    return this.productsService.findByCategory(category, page);
  }


  // Retrieves details of a single product by its ID
  @Get(':id')
  getProduct(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  // Deletes a product by its ID; only accessible to admin users
  @UseGuards(AdminGuard)
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.productsService.deleteOne(id);
  }

  // Creates a sample product; only accessible to admin users
  @UseGuards(AdminGuard)
  @Post()
  createProduct() {
    return this.productsService.createSample();
  }

  // Updates a product by its ID with provided product data; only accessible to admin users
  @UseGuards(AdminGuard)
  @Put(':id')
  updateProduct(@Param('id') id: string, @Body() product: ProductDto) {
    console.log(product.image);
    return this.productsService.update(id, product);
  }

  // Creates a review for a product by its ID; only accessible to authenticated users
 @UseGuards(AuthGuard)
  @Put(':id/review')
  async createReview(
    @Param('id') id: string,
    @Body() reviewDto: ReviewDto,
    @Session() session: any
  ) {
    // Validate session.user
    if (!session.user || !session.user._id || !session.user.name) {
      console.log('Invalid session.user:', session.user);
      throw new BadRequestException('Invalid user session');
    }

    // Validate and convert user._id
    let userId: Types.ObjectId;
    if (typeof session.user._id === 'string') {
      if (!Types.ObjectId.isValid(session.user._id)) {
        console.log('Invalid user._id string:', session.user._id);
        throw new BadRequestException('Invalid user ID');
      }
      userId = new Types.ObjectId(session.user._id);
    } else if (session.user._id instanceof Types.ObjectId) {
      userId = session.user._id;
    } else {
      // Handle potential ObjectId from another bson version
      const idString = session.user._id.toString();
      if (Types.ObjectId.isValid(idString)) {
        userId = new Types.ObjectId(idString);
      } else {
        console.log('Unexpected user._id type:', typeof session.user._id, session.user._id);
        throw new BadRequestException('Invalid user ID type');
      }
    }

    // Validate product ID
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID');
    }

    // Create user object
    const user = { _id: userId, name: session.user.name };

    // Log input for debugging
    console.log('createReview input:', { id, rating: reviewDto.rating, comment: reviewDto.comment, user });

    // Call the service
    return this.productsService.createReview(id, user, reviewDto.rating, reviewDto.comment);
  }
}