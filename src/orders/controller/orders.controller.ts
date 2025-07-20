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
  // Change this method to send a success flag
@Post('create-from-stripe')
async createFromStripe(@Body() body: { sessionId: string; userId: string }) {
  try {
    const { sessionId, userId } = body;
    const order = await this.ordersService.createOrderFromStripeSession(sessionId, userId);
    
    return { success: true, order };  // <-- Add success true here
  } catch (error) {
    console.error('Create from Stripe error:', error);
    return { success: false, message: error.message || 'Failed to create order from Stripe session' };
  }
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
