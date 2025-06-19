#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Start Next.js development server
const nextDev = spawn('npx', ['next', 'dev', '--port', '3000', '--hostname', '0.0.0.0'], {
  cwd: process.cwd(),
  stdio: 'inherit'
});

nextDev.on('close', (code) => {
  console.log(`Next.js dev server exited with code ${code}`);
});

process.on('SIGINT', () => {
  nextDev.kill('SIGINT');
});

process.on('SIGTERM', () => {
  nextDev.kill('SIGTERM');
});