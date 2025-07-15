import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Patch,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from 'src/guards/admin.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { OrdersService } from '../services/orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createOrder(@Body() body: any, @Session() session: any) {
    console.log(session.user);
    return this.ordersService.create(body, session.user._id, session.user.name);
  }

  // New route to create order from Stripe session ID
  @Post('create-from-stripe')
  async createFromStripe(@Body() body: { sessionId: string }) {
    const { sessionId } = body;
    return this.ordersService.createOrderFromStripeSession(sessionId);
  }

  @UseGuards(AdminGuard)
  @Get()
  async getOrders() {
    return this.ordersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('myorders')
  async getUserOrders(@Session() session: any) {
    return this.ordersService.findUserOrders(session.user._id);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getOrder(@Param('id') id: string) {
    return this.ordersService.findById(id);
  }

  @UseGuards(AuthGuard)
  @Put(':id/pay')
  async updateOrderPayment(
    @Param('id') id: string,
    @Body() { paymentResult }: any,
  ) {
    return this.ordersService.updatePaid(id, paymentResult);
  }

  @UseGuards(AdminGuard)
  @Put(':id/deliver')
  async updateOrderDelivery(@Param('id') id: string) {
    return this.ordersService.updateDelivered(id);
  }

  // @UseGuards(AdminGuard)
  @Patch(':id/status')
  async updateOrderStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.ordersService.updateStatus(id, status);
  }
}
