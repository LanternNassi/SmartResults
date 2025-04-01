// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create O-Level grade system
  const oLevel = await prisma.gradeSystem.create({
    data: {
      name: "O-Level",
      gradeRanges: {
        create: [
          { grade: "A", min: 80, max: 100 },
          { grade: "B", min: 70, max: 79 },
          { grade: "C", min: 60, max: 69 },
          { grade: "D", min: 50, max: 59 },
          { grade: "E", min: 0, max: 49 }
        ]
      }
    }
  });

  // Create A-Level grade system
  const aLevel = await prisma.gradeSystem.create({
    data: {
      name: "A-Level",
      gradeRanges: {
        create: [
          { grade: "A", min: 80, max: 100 },
          { grade: "B", min: 70, max: 79 },
          { grade: "C", min: 60, max: 69 },
          { grade: "D", min: 50, max: 59 },
          { grade: "E", min: 40, max: 49 },
          { grade: "O", min: 35, max: 39 },
          { grade: "F", min: 0, max: 34 }
        ]
      }
    }
  });

  const user = await prisma.user.create({
    data : {
      username : "Nassim",
      email : "ntambinassim@gmail.com",
      telephone : "0758989094",
      password: "0000",
      gender: "Male",
      role: "admin",
    }
  })

  console.log({ oLevel, aLevel , user });
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })