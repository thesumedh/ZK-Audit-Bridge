#!/usr/bin/env node
/**
 * ZK-Audit Bridge — Compact Compiler Setup
 * 
 * Downloads and configures the Midnight Compact compiler for your OS.
 * Required to compile audit_bridge.compact → ZK circuits
 * 
 * Run: node scripts/setup-compiler.mjs
 */

import { execSync, exec } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { platform } from 'os';
import { promisify } from 'util';

const execAsync = promisify(exec);

const OS = platform(); // 'win32', 'darwin', 'linux'

const COMPACT_RELEASES = 'https://github.com/midnightntwrk/compact/releases/latest';

async function checkCompact() {
  try {
    const { stdout } = await execAsync('compact --version');
    return stdout.trim();
  } catch {
    return null;
  }
}

async function compileContract() {
  const outputDir = 'contracts/compiled';
  if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

  console.log('⚙️  Compiling audit_bridge.compact...');
  try {
    execSync(`compact compile contracts/audit_bridge.compact ${outputDir}`, { stdio: 'inherit' });
    console.log(`✅ Compiled! Artifacts in ./${outputDir}`);
    return true;
  } catch {
    console.error('❌ Compilation failed. Check the contract syntax.');
    return false;
  }
}

async function main() {
  console.log('\n🛡️  ZK-Audit Bridge — Compact Compiler Setup');
  console.log('=============================================\n');

  // 1. Check if compact is already installed
  const version = await checkCompact();
  if (version) {
    console.log(`✅ Compact compiler found: ${version}`);
    await compileContract();
    return;
  }

  // 2. Provide installation instructions per OS
  console.log('📦 Compact compiler not found. Install it:\n');

  if (OS === 'linux' || OS === 'darwin') {
    console.log('  Option A — Installer script (recommended):');
    console.log('  curl --proto \'=https\' --tlsv1.2 -LsSf \\');
    console.log(`    ${COMPACT_RELEASES}/download/compact-installer.sh | sh\n`);
    console.log('  Option B — Homebrew (macOS):');
    console.log('  brew install midnightntwrk/tap/compact\n');
  } else if (OS === 'win32') {
    console.log('  Option A — PowerShell installer:');
    console.log('  irm https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.ps1 | iex\n');
    console.log('  Option B — Download binary directly:');
    console.log(`  ${COMPACT_RELEASES}\n`);
  }

  console.log('  After installation, run this script again:');
  console.log('  node scripts/setup-compiler.mjs\n');

  console.log('📄 Then deploy your contract:');
  console.log('  node scripts/deploy.mjs\n');
}

main().catch(console.error);
