import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';


@Injectable() 
export class EmailService {

    private transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'sellaro364@gmail.com',      // replace with your Gmail
          pass: 'okpv rdew mtny jfdh',           // use App Password from Google
        },
      });
    
      async sendOtpEmail(to: string, otp: string): Promise<void> {
        const mailOptions = {
          from: 'sellaro364',
          to,
          subject: 'Your Sellaro OTP Code',
          html: `<p>Your OTP is <strong>${otp}</strong>. It expires in 10 minutes.</p>`,
        };
        
        try {
          const info = await this.transporter.sendMail(mailOptions);
          console.log('Email sent:', info.response);
        } catch (error) {
          console.error('Error sending email:', error);
          throw error;
        }
      }
    
    
  }