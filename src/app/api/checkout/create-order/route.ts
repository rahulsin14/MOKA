import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRazorpay } from "@/lib/razorpay";

type CartLine = { productId: string; quantity: number };

function isPlaceholderKey(key?: string) {
  return !key || key.includes("xxxxxxxx");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingPincode,
      items,
    } = body as {
      customerName: string;
      customerEmail: string;
      customerPhone: string;
      shippingAddress: string;
      shippingCity: string;
      shippingState: string;
      shippingPincode: string;
      items: CartLine[];
    };

    if (
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !shippingAddress ||
      !shippingCity ||
      !shippingState ||
      !shippingPincode ||
      !items?.length
    ) {
      return NextResponse.json({ error: "Missing checkout fields" }, { status: 400 });
    }

    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, inStock: true },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: "One or more products are unavailable" },
        { status: 400 }
      );
    }

    const productMap = new Map(products.map((p) => [p.id, p]));
    let amount = 0;
    const orderItems = items.map((item) => {
      const product = productMap.get(item.productId)!;
      const qty = Math.max(1, Number(item.quantity) || 1);
      amount += product.price * qty;
      return {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: qty,
      };
    });

    const orderNumber = `MOKA-${Date.now().toString(36).toUpperCase()}`;
    const allowDemo =
      process.env.ALLOW_DEMO_PAYMENTS === "true" ||
      process.env.NODE_ENV !== "production";
    const demoMode = isPlaceholderKey(process.env.RAZORPAY_KEY_ID) && allowDemo;

    if (isPlaceholderKey(process.env.RAZORPAY_KEY_ID) && !allowDemo) {
      return NextResponse.json(
        {
          error:
            "Payments are not configured. Set Razorpay keys in environment variables.",
        },
        { status: 503 }
      );
    }

    let razorpayOrderId: string | null = null;

    if (!demoMode) {
      const razorpay = getRazorpay();
      const rzOrder = await razorpay.orders.create({
        amount,
        currency: "INR",
        receipt: orderNumber,
        notes: { customerEmail, orderNumber },
      });
      razorpayOrderId = rzOrder.id;
    }

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        shippingCity,
        shippingState,
        shippingPincode,
        amount,
        status: demoMode ? "PAID" : "PENDING",
        razorpayOrderId,
        razorpayPaymentId: demoMode ? "demo_payment" : null,
        items: { create: orderItems },
      },
    });

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: order.amount,
      razorpayOrderId,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      demoMode,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not create order" }, { status: 500 });
  }
}
