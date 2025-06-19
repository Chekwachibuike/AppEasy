import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('Starting Next.js development server...');

// Start Next.js development server on port 5000 as expected by workflow
const nextDev = spawn('npx', ['next', 'dev', '--port', '5000', '--hostname', '0.0.0.0'], {
  cwd: projectRoot,
  stdio: 'inherit'
});

nextDev.on('close', (code) => {
  console.log(`Next.js dev server exited with code ${code}`);
  process.exit(code || 0);
});

nextDev.on('error', (error) => {
  console.error('Failed to start Next.js dev server:', error);
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  nextDev.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  nextDev.kill('SIGTERM');
});