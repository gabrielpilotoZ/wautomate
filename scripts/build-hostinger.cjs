process.env.NODE_ENV = 'production';
const { spawnSync } = require('node:child_process');
for (const [modulePath, args] of [
    ['prisma/build/index.js', ['generate']],
    ['next/dist/bin/next', ['build', '--webpack']],
]) {
    const result = spawnSync(process.execPath, [require.resolve(modulePath), ...args], { stdio: 'inherit', env: process.env });
    if (result.status !== 0) process.exit(result.status || 1);
}
