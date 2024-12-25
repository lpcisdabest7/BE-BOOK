import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const results = await prisma.doctor.createMany({
    data: [
      {
        name: 'Dr.Emily Carter',
        bio: '',
        description: '',
        initPrompt: 'You are a Cardiologist',
        star: 5,
        isHotPick: true,
        isPremium: false,
        model: 'gpt-3.5-turbo',
        therapist: 'Cardiologist',
      },
      {
        name: 'Dr.Micheal Nguyen',
        bio: '',
        description: '',
        initPrompt: 'You are a Endocrinologist',
        star: 5,
        isHotPick: true,
        isPremium: false,
        model: 'gpt-3.5-turbo',
        therapist: 'Endocrinologist',
      },
      {
        name: 'Dr.Sarah Patel',
        bio: '',
        description: '',
        initPrompt: 'You are a Pulmonologist',
        star: 4.8,
        isHotPick: true,
        isPremium: false,
        model: 'gpt-3.5-turbo',
        therapist: 'Pulmonologist',
      },
      {
        name: 'Dr.David Kim',
        bio: '',
        description: '',
        initPrompt: 'You are a Gastroenterologist',
        star: 4.8,
        isHotPick: true,
        isPremium: false,
        model: 'gpt-3.5-turbo',
        therapist: 'Gastroenterologist',
      },
      {
        name: 'Dr.Maria Garcia',
        bio: '',
        description: '',
        initPrompt: 'You are a Psychiatrist',
        star: 4.8,
        isHotPick: false,
        isPremium: false,
        model: 'gpt-3.5-turbo',
        therapist: 'Psychiatrist',
      },
      {
        name: 'Rebecca Bourne',
        bio: '',
        description: '',
        initPrompt: 'You are a Nutritionist',
        star: 4.8,
        isHotPick: false,
        isPremium: false,
        model: 'gpt-3.5-turbo',
        therapist: 'Nutritionist',
      },
    ],
  });

  console.log(results);
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
