import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting database seed...');

    // Create Departments
    const technicalDept = await prisma.department.upsert({
        where: { name: 'Technical' },
        update: {},
        create: {
            name: 'Technical',
        },
    });

    const logisticsDept = await prisma.department.upsert({
        where: { name: 'Logistics' },
        update: {},
        create: {
            name: 'Logistics',
        },
    });

    const operationsDept = await prisma.department.upsert({
        where: { name: 'Operations' },
        update: {},
        create: {
            name: 'Operations',
        },
    });
    const HRDept = await prisma.department.upsert({
        where: { name: 'HR' },
        update: {},
        create: {
            name: 'HR',
        },
    });

    console.log('✓ Departments created');

    // Credentials MUST be provided in environment variables
    const adminEmail = process.env.SEED_ADMIN_EMAIL;
    const adminPassword = process.env.SEED_ADMIN_PASSWORD;
    const techPassword = process.env.SEED_TECH_PASSWORD;
    const logisticsPassword = process.env.SEED_LOGISTICS_PASSWORD;
    const operationsPassword = process.env.SEED_OPERATIONS_PASSWORD;
    const HRPassword = process.env.SEED_HR_PASSWORD;

    if (!adminEmail || !adminPassword || !techPassword || !logisticsPassword || !operationsPassword || !HRPassword) {
        console.error('❌ Error: Missing required seed credentials in environment variables.');
        console.info('Please check SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD, etc. in your .env file.');
        process.exit(1);
    }

    // Create Admin User
    const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            passwordHash: hashedAdminPassword,
            name: 'Admin User',
            role: 'ADMIN',
        },
    });

    console.log('✓ Admin user created');

    // Create Department Users
    const hashedTechPassword = await bcrypt.hash(techPassword, 10);
    const techUser = await prisma.user.upsert({
        where: { email: 'tech@badarexpo.com' },
        update: {},
        create: {
            email: 'tech@badarexpo.com',
            passwordHash: hashedTechPassword,
            name: 'Technical Department User',
            role: 'DEPARTMENT_USER',
            departmentId: technicalDept.id,
        },
    });

    const hashedLogisticsPassword = await bcrypt.hash(logisticsPassword, 10);
    const logisticsUser = await prisma.user.upsert({
        where: { email: 'logistics@badarexpo.com' },
        update: {},
        create: {
            email: 'logistics@badarexpo.com',
            passwordHash: hashedLogisticsPassword,
            name: 'Logistics Department User',
            role: 'DEPARTMENT_USER',
            departmentId: logisticsDept.id,
        },
    });

    const hashedOperationsPassword = await bcrypt.hash(operationsPassword, 10);
    const operationsUser = await prisma.user.upsert({
        where: { email: 'operations@badarexpo.com' },
        update: {},
        create: {
            email: 'operations@badarexpo.com',
            passwordHash: hashedOperationsPassword,
            name: 'Operations Department User',
            role: 'DEPARTMENT_USER',
            departmentId: operationsDept.id,
        },
    });

    const hashedHRPassword = await bcrypt.hash(HRPassword, 10);
    const HRUser = await prisma.user.upsert({
        where: { email: 'HR@badarexpo.com' },
        update: {},
        create: {
            email: 'HR@badarexpo.com',
            passwordHash: hashedHRPassword,
            name: 'HR Department User',
            role: 'DEPARTMENT_USER',
            departmentId: HRDept.id,
        },
    });

    console.log('✓ Department users created');

    console.log('\n=== Seed Summary ===');
    console.log('Departments:', 3);
    console.log('Users:', 4);
    console.log('\nSeed process complete.');
    console.log('Credentials have been set from your .env file.');
    console.log('\nDatabase seeded successfully!');
}

main()
    .catch((e) => {
        console.error('Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
