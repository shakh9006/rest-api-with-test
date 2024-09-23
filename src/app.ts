import "dotenv/config";
import { prisma } from "./database/prisma.client";
import generateServer from "./server";

async function main() {
  const app = generateServer();
  const PORT = process.env.PORT || 8001;
  app.listen(PORT, () => {
    return console.log(
      `Express server is listening at http://localhost:${PORT} 🚀`,
    );
  });
}

main()
  .then(async () => {
    await prisma.$connect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
