const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

async function main() {
    try {
        await db.category.createMany({
            data: [
                { name: 'Computer Science' },
                { name: 'Mathematics' },
                { name: 'Accounting' },
                { name: 'History' },
                { name: 'Art' },
                { name: 'Engineering' },
                { name: 'Business' },
                { name: 'Health & Fitness' },
                { name: 'Personal Development' },
                { name: 'Language Learning' },
            ]
        });

        console.log('Categories seeded successfully');
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await db.$disconnect();
    }
}

main();