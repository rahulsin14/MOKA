import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const products = [
  {
    name: "ZAREEN",
    slug: "zareen",
    description:
      "Handcrafted gold-tone earrings with soft pink stones. Lightweight, elegant, made for every day and every celebration.",
    price: 189900,
    compareAt: null,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
    ]),
    category: "Earrings",
    collection: "KAHAANI",
    featured: true,
  },
  {
    name: "LUNA - Shine Anywhere, Anytime",
    slug: "luna",
    description:
      "Delicate everyday earrings that catch the light. Minimal silhouette, maximum presence.",
    price: 89900,
    compareAt: null,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
    ]),
    category: "Earrings",
    collection: "ERA",
    featured: true,
  },
  {
    name: "Maharani",
    slug: "maharani",
    description:
      "Regal statement jewellery inspired by royal Indian craftsmanship. Bold, timeless, unforgettable.",
    price: 169900,
    compareAt: null,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80",
    ]),
    category: "Sets",
    collection: "KAHAANI",
    featured: true,
  },
  {
    name: "MAYUR",
    slug: "mayur",
    description:
      "Peacock-inspired motifs in polished gold tone. A playful nod to heritage, designed for modern wear.",
    price: 89900,
    compareAt: null,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
    ]),
    category: "Earrings",
    collection: "9 to Shine",
    featured: false,
  },
  {
    name: "Pushp",
    slug: "pushp",
    description:
      "Floral forms rendered in refined metalwork. Soft, romantic, and endlessly wearable.",
    price: 98900,
    compareAt: null,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80",
    ]),
    category: "Earrings",
    collection: "ERA",
    featured: false,
  },
];

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@mokaindia.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: {
      email,
      name: "MOKA Admin",
      passwordHash,
      role: "ADMIN",
    },
  });

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }

  console.log("Seeded admin and products.");
  console.log(`Admin login: ${email} / ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
