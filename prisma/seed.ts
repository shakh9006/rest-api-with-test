import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const todos = await prisma.todo.findMany();

  // Seed only if the table is empty
  if (todos.length === 0) {
    await prisma.todo.createMany({
      data: [
        { title: "Buy groceries", checked: false },
        { title: "Walk the dog", checked: true },
        { title: "Finish project", checked: false },
      ],
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
