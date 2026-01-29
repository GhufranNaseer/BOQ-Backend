import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUser() {
    const user = await prisma.user.findUnique({
        where: { email: 'admin@badarexpo.com' },
    });

    if (user) {
        console.log('Admin user found:', user.email);
        console.log('Role:', user.role);
        console.log('Password hash exists:', !!user.passwordHash);
    } else {
        console.log('Admin user NOT found!');
    }
}

checkUser()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
