import { NextRequest, NextResponse } from 'next/server';
import qs from 'qs';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { VNPAY_CONFIG } from '@/config/vnpay';

const sortObject = (obj: Record<string, string>): Record<string, string> => {
  return Object.keys(obj)
    .sort()
    .reduce((result: Record<string, string>, key: string) => {
      result[key] = encodeURIComponent(obj[key]).replace(/%20/g, '+');
      return result;
    }, {});
};

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const params = Object.fromEntries(url.searchParams.entries());

  const secureHash = params['vnp_SecureHash'];
  delete params['vnp_SecureHash'];
  delete params['vnp_SecureHashType'];

  const sortedParams = sortObject(params);
  const signData = qs.stringify(sortedParams, { encode: false });

  const hmac = crypto.createHmac('sha512', VNPAY_CONFIG.hashSecret);
  const signed = hmac.update(signData).digest('hex');

  if (secureHash !== signed) {
    return NextResponse.json({ message: 'Sai chữ ký', success: false }, { status: 400 });
  }

  const responseCode = params['vnp_ResponseCode'];
  const bookingId = params['vnp_OrderInfo'];
  console.log("bookingId", bookingId);

  if (responseCode === '00') {
    try {
      // Kiểm tra booking có tồn tại không trước khi update
      const existingBooking = await prisma.booking.findUnique({
        where: { id: bookingId },
      });

      if (!existingBooking) {
        return NextResponse.json({
          message: 'Không tìm thấy booking với ID đã cung cấp',
          success: false,
        }, { status: 404 });
      }

      const booking = await prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'confirmed' },
      });

      await prisma.tour.update({
        where: { id: booking.tourId },
        data: { bookedSlots: { increment: booking.quantity } },
      });


      await prisma.payment.create({
        data: {
          bookingId,
          amount: booking.price,
          method: 'vnpay',
          status: 'success',
        },
      });

      return NextResponse.redirect(`${VNPAY_CONFIG.returnUrl}?vnp_ResponseCode=${responseCode}&success=true&bookingId=${bookingId}`);
    } catch (error) {
      console.error('Lỗi cập nhật DB:', error);
      return NextResponse.json({ message: 'Lỗi cập nhật DB', success: false }, { status: 500 });
    }
  } else {
    return NextResponse.redirect(`${VNPAY_CONFIG.returnUrl}?success=false`);
  }
}
