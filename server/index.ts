import { spawn } from 'child_process';
import { platform } from 'os';

// Determine platform for correct Next.js binary
const isWin = platform() === 'win32';
const nextCommand = isWin ? '.\\node_modules\\.bin\\next.cmd' : './node_modules/.bin/next';

// Start Next.js dev server on port 5000
const nextDev = spawn(
  nextCommand,
  ['dev', '--port', '5000', '--hostname', '0.0.0.0'],
  {
    stdio: 'inherit',
    shell: isWin
  }
);

nextDev.on('close', (code) => {
  process.exit(code || 0);
});

nextDev.on('error', (error) => {
  process.exit(1);
});

process.on('SIGINT', () => {
  nextDev.kill('SIGINT');
});

process.on('SIGTERM', () => {
  nextDev.kill('SIGTERM');
});