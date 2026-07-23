import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.log("Skipping admin ensure: ADMIN_EMAIL or ADMIN_PASSWORD not set.");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: "ADMIN" },
    create: {
      email,
      name: "MOKA Admin",
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log(`Admin ready: ${email}`);
}

main()
  .catch((e) => {
    console.error("Failed to ensure admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
