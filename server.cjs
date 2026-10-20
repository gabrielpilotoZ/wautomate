// Entry point for Hostinger Node.js Web Apps (custom server, not next start).
process.env.NODE_ENV = 'production';
require('@next/env').loadEnvConfig(process.cwd());
const { spawnSync } = require('node:child_process');

async function main() {
    for (const name of ['DATABASE_URL', 'AUTH_SECRET', 'BASE_URL']) {
        if (!process.env[name]) throw new Error(`Configure ${name} no painel da hospedagem.`);
    }
    if (process.env.AUTH_SECRET.length < 32) throw new Error('AUTH_SECRET deve ter pelo menos 32 caracteres.');
    const base = new URL(process.env.BASE_URL);
    if (!['http:', 'https:'].includes(base.protocol)) throw new Error('BASE_URL deve ser uma URL HTTP/HTTPS.');
    process.env.HOSTNAME = '0.0.0.0';
    process.env.PORT ||= '3000';
    process.env.AUTH_URL ||= base.origin;
    process.env.NEXTAUTH_URL ||= base.origin;
    process.env.AUTH_TRUST_HOST = 'true';

    // Opt-in first deployment setup. Never reset data or accept destructive changes.
    if (process.env.INIT_DATABASE === 'true') {
        const result = spawnSync(process.execPath, [require.resolve('prisma/build/index.js'), 'db', 'push', '--skip-generate'], { stdio: 'inherit', env: process.env });
        if (result.status !== 0) throw new Error('Falha ao preparar o banco. Consulte o log; nenhum reset foi solicitado.');
    }
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    try {
        const administrator = await prisma.user.findFirst({ where: { role: 'SUPERADMIN' }, select: { id: true } });
        if (!administrator) {
            const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
            const password = process.env.ADMIN_PASSWORD;
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !password || password.length < 12) {
                throw new Error('Primeiro acesso: configure ADMIN_EMAIL e ADMIN_PASSWORD (mínimo 12 caracteres).');
            }
            if (await prisma.user.findUnique({ where: { email } })) {
                throw new Error('O e-mail já pertence a uma conta. Não será promovido automaticamente.');
            }
            const bcrypt = require('bcryptjs');
            await prisma.user.create({ data: { email, name: 'Administrador', password: await bcrypt.hash(password, 12), role: 'SUPERADMIN' } });
        }
        await prisma.systemConfig.upsert({
            where: { id: 'default' }, update: {},
            create: { id: 'default', appName: process.env.APP_NAME || 'WA-AKG', timezone: process.env.TZ || 'America/Sao_Paulo', enableRegistration: false },
        });
    } finally { await prisma.$disconnect(); }
    // Register TypeScript support in the same process so the host manages the real server.
    require('tsx/cjs');
    require('./src/server/index.ts');
}

main().catch(error => {
    console.error('Não foi possível iniciar o aplicativo:', error.message);
    process.exit(1);
});
