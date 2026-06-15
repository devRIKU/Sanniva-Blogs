import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

console.log('🔄 [Updater] Checking workspace status for safe non-destructive update...');

const gitDir = join(process.cwd(), '.git');

if (existsSync(gitDir)) {
  console.log('📌 [Updater] Git repository detected.');
  try {
    console.log('⌛ [Updater] Running "git pull" to fetch latest Obsidian commits and code updates...');
    
    // We run git pull. This is non-destructive and merges remote changes 
    // with local workspace cleanly, ensuring new obsidian .md files are fetched.
    execSync('git pull --rebase=false', { stdio: 'inherit' });
    console.log('✅ [Updater] Successfully pulled and updated repository changes.');
  } catch (err) {
    if (err instanceof Error) {
      console.warn('⚠️ [Updater] Warning during git pull:', err.message);
      console.warn('💡 [Updater] Keeping existing workspace files as-is to prevent any data loss.');
    } else {
      console.warn('⚠️ [Updater] Warning: Git pull failed. Continuing build using local files.');
    }
  }
} else {
  console.log('ℹ️ [Updater] Git folder (.git) not detected in this environment. Skipping git pull.');
  console.log('💡 [Updater] All existing markdown and component files have been fully preserved.');
}

console.log('🚀 [Updater] Workspace safe. Starting build process...');
