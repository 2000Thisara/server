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

@Controller('products') // Defines the route prefix for this controller
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  // GET /products?keyword=...&pageId=...
  // Retrieves a list of products, optionally filtered by keyword and paginated by pageId
  @Get()
  getProducts(
    @Query('keyword') keyword: string,
    @Query('pageId') pageId: string
  ) {
    return this.productsService.findMany(keyword, pageId);
  }

  // GET /products/topRated
  // Retrieves a list of top-rated products
  @Get('topRated')
  getTopRatedProducts() {
    return this.productsService.findTopRated();
  }

  // GET /products/:id
  // Retrieves details of a single product by its ID
  @Get(':id')
  getProduct(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  // DELETE /products/:id
  // Deletes a product by its ID; only accessible to admin users
  @UseGuards(AdminGuard)
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.productsService.deleteOne(id);
  }

  // POST /products
  // Creates a sample product; only accessible to admin users
  @UseGuards(AdminGuard)
  @Post()
  createProduct() {
    return this.productsService.createSample();
  }

  // PUT /products/:id
  // Updates a product by its ID with provided product data; only accessible to admin users
  @UseGuards(AdminGuard)
  @Put(':id')
  updateProduct(@Param('id') id: string, @Body() product: ProductDto) {
    console.log(product.image);
    return this.productsService.update(id, product);
  }

  // PUT /products/:id/review
  // Creates a review for a product by its ID; only accessible to authenticated users
  @UseGuards(AuthGuard)
  @Put(':id/review')
  createReview(
    @Param('id') id: string,
    @Body() { rating, comment }: ReviewDto,
    @Session() session: any
  ) {
    return this.productsService.createReview(id, session.user, rating, comment);
  }
}
