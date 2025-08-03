#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Comprehensive cleanup script for test artifacts and temporary data
 */

// Configuration
const CONFIG = {
  directories: [
    'reports',
    'logs', 
    'screenshots',
    'videos',
    'dist',
    'node_modules/.cache',
    '.nyc_output',
    'coverage'
  ],
  files: [
    'cucumber-report.json',
    'cucumber-report.html',
    'health-check.json',
    'health-status.txt',
    '*.log',
    '*.tmp',
    '.DS_Store',
    'Thumbs.db'
  ],
  keepStructure: true, // Keep directory structure but remove contents
  dryRun: false
};

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

/**
 * Main cleanup function
 */
function runCleanup(options = {}) {
  const config = { ...CONFIG, ...options };
  
  console.log(`${colors.blue}${colors.bold}🧹 Starting Cleanup Process${colors.reset}`);
  console.log(`${colors.blue}Mode: ${config.dryRun ? 'DRY RUN' : 'EXECUTE'}${colors.reset}\n`);

  const stats = {
    directoriesProcessed: 0,
    filesDeleted: 0,
    spaceFreed: 0,
    errors: []
  };

  // Clean directories
  config.directories.forEach(dir => {
    cleanDirectory(dir, config, stats);
  });

  // Clean individual files
  config.files.forEach(pattern => {
    cleanFilePattern(pattern, config, stats);
  });

  // Display summary
  displaySummary(stats, config);

  return stats;
}

/**
 * Clean a directory
 */
function cleanDirectory(dirPath, config, stats) {
  const fullPath = path.resolve(dirPath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`${colors.yellow}⏭️ Directory doesn't exist: ${dirPath}${colors.reset}`);
    return;
  }

  console.log(`${colors.blue}📁 Processing directory: ${dirPath}${colors.reset}`);
  
  try {
    const dirStats = fs.statSync(fullPath);
    if (!dirStats.isDirectory()) {
      console.log(`${colors.yellow}⚠️ Not a directory: ${dirPath}${colors.reset}`);
      return;
    }

    stats.directoriesProcessed++;

    if (config.keepStructure) {
      // Remove contents but keep directory
      const items = fs.readdirSync(fullPath);
      
      items.forEach(item => {
        const itemPath = path.join(fullPath, item);
        const itemStats = fs.statSync(itemPath);
        
        if (itemStats.isDirectory()) {
          deleteDirectoryRecursive(itemPath, config, stats);
        } else {
          deleteFile(itemPath, config, stats);
        }
      });
      
      // Create .gitkeep file to maintain directory structure
      const gitkeepPath = path.join(fullPath, '.gitkeep');
      if (!fs.existsSync(gitkeepPath)) {
        if (!config.dryRun) {
          fs.writeFileSync(gitkeepPath, '');
        }
        console.log(`  ${colors.green}✅ Created .gitkeep${colors.reset}`);
      }
      
    } else {
      // Remove entire directory
      deleteDirectoryRecursive(fullPath, config, stats);
    }

  } catch (error) {
    const errorMsg = `Failed to process directory ${dirPath}: ${error.message}`;
    stats.errors.push(errorMsg);
    console.log(`  ${colors.red}❌ ${errorMsg}${colors.reset}`);
  }
}

/**
 * Clean files matching a pattern
 */
function cleanFilePattern(pattern, config, stats) {
  console.log(`${colors.blue}🔍 Looking for files matching: ${pattern}${colors.reset}`);
  
  // Simple glob implementation
  if (pattern.includes('*')) {
    const baseDir = process.cwd();
    findAndDeleteFiles(baseDir, pattern, config, stats);
  } else {
    // Direct file path
    const fullPath = path.resolve(pattern);
    if (fs.existsSync(fullPath)) {
      deleteFile(fullPath, config, stats);
    }
  }
}

/**
 * Find and delete files matching pattern
 */
function findAndDeleteFiles(dir, pattern, config, stats) {
  try {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const itemStats = fs.statSync(itemPath);
      
      if (itemStats.isDirectory() && !config.directories.includes(item)) {
        // Recursively search subdirectories (but not the ones we're cleaning)
        findAndDeleteFiles(itemPath, pattern, config, stats);
      } else if (itemStats.isFile()) {
        // Check if file matches pattern
        if (matchesPattern(item, pattern)) {
          deleteFile(itemPath, config, stats);
        }
      }
    });
  } catch (error) {
    const errorMsg = `Failed to search directory ${dir}: ${error.message}`;
    stats.errors.push(errorMsg);
  }
}

/**
 * Simple pattern matching
 */
function matchesPattern(filename, pattern) {
  // Convert glob pattern to regex
  const regexPattern = pattern
    .replace(/\./g, '\\.')
    .replace(/\*/g, '.*')
    .replace(/\?/g, '.');
  
  const regex = new RegExp(`^${regexPattern}$`, 'i');
  return regex.test(filename);
}

/**
 * Delete a file
 */
function deleteFile(filePath, config, stats) {
  try {
    const fileStats = fs.statSync(filePath);
    const sizeInBytes = fileStats.size;
    
    if (!config.dryRun) {
      fs.unlinkSync(filePath);
    }
    
    stats.filesDeleted++;
    stats.spaceFreed += sizeInBytes;
    
    const sizeStr = formatBytes(sizeInBytes);
    console.log(`  ${colors.green}🗑️ Deleted file: ${path.relative(process.cwd(), filePath)} (${sizeStr})${colors.reset}`);
    
  } catch (error) {
    const errorMsg = `Failed to delete file ${filePath}: ${error.message}`;
    stats.errors.push(errorMsg);
    console.log(`  ${colors.red}❌ ${errorMsg}${colors.reset}`);
  }
}

/**
 * Delete directory recursively
 */
function deleteDirectoryRecursive(dirPath, config, stats) {
  try {
    if (fs.existsSync(dirPath)) {
      const items = fs.readdirSync(dirPath);
      
      items.forEach(item => {
        const itemPath = path.join(dirPath, item);
        const itemStats = fs.statSync(itemPath);
        
        if (itemStats.isDirectory()) {
          deleteDirectoryRecursive(itemPath, config, stats);
        } else {
          deleteFile(itemPath, config, stats);
        }
      });
      
      if (!config.dryRun) {
        fs.rmdirSync(dirPath);
      }
      
      console.log(`  ${colors.green}📂 Deleted directory: ${path.relative(process.cwd(), dirPath)}${colors.reset}`);
    }
  } catch (error) {
    const errorMsg = `Failed to delete directory ${dirPath}: ${error.message}`;
    stats.errors.push(errorMsg);
    console.log(`  ${colors.red}❌ ${errorMsg}${colors.reset}`);
  }
}

/**
 * Format bytes to human readable string
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Display cleanup summary
 */
function displaySummary(stats, config) {
  console.log('\n' + '='.repeat(50));
  console.log(`${colors.bold}🧹 CLEANUP SUMMARY${colors.reset}`);
  console.log('='.repeat(50));
  
  if (config.dryRun) {
    console.log(`${colors.yellow}ℹ️ DRY RUN MODE - No files were actually deleted${colors.reset}`);
  }
  
  console.log(`📁 Directories processed: ${stats.directoriesProcessed}`);
  console.log(`🗑️ Files deleted: ${stats.filesDeleted}`);
  console.log(`💾 Space freed: ${formatBytes(stats.spaceFreed)}`);
  
  if (stats.errors.length > 0) {
    console.log(`\n${colors.red}❌ ERRORS (${stats.errors.length}):${colors.reset}`);
    stats.errors.forEach(error => {
      console.log(`  ${colors.red}• ${error}${colors.reset}`);
    });
  } else {
    console.log(`\n${colors.green}✅ Cleanup completed successfully!${colors.reset}`);
  }
  
  console.log('='.repeat(50) + '\n');
}

/**
 * Specific cleanup functions
 */
function cleanReports() {
  console.log(`${colors.blue}📊 Cleaning test reports...${colors.reset}`);
  return runCleanup({
    directories: ['reports'],
    files: ['cucumber-report.*', 'health-check.json'],
    keepStructure: true
  });
}

function cleanLogs() {
  console.log(`${colors.blue}📋 Cleaning log files...${colors.reset}`);
  return runCleanup({
    directories: ['logs'],
    files: ['*.log'],
    keepStructure: true
  });
}

function cleanBuild() {
  console.log(`${colors.blue}🔨 Cleaning build artifacts...${colors.reset}`);
  return runCleanup({
    directories: ['dist', 'build', '.tsbuildinfo'],
    files: [],
    keepStructure: false
  });
}

function cleanNodeModules() {
  console.log(`${colors.blue}📦 Cleaning node_modules cache...${colors.reset}`);
  return runCleanup({
    directories: ['node_modules/.cache'],
    files: [],
    keepStructure: false
  });
}

function cleanAll() {
  console.log(`${colors.blue}🧹 Full cleanup - removing all generated files...${colors.reset}`);
  return runCleanup();
}

/**
 * Interactive cleanup menu
 */
function interactiveCleanup() {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log(`${colors.blue}${colors.bold}🧹 Interactive Cleanup${colors.reset}`);
  console.log('What would you like to clean?\n');
  console.log('1. Reports only');
  console.log('2. Logs only'); 
  console.log('3. Build artifacts');
  console.log('4. Node modules cache');
  console.log('5. Everything');
  console.log('6. Custom cleanup');
  console.log('7. Dry run (preview only)');
  console.log('8. Exit\n');

  rl.question('Enter your choice (1-8): ', (answer) => {
    switch (answer.trim()) {
      case '1':
        cleanReports();
        break;
      case '2':
        cleanLogs();
        break;
      case '3':
        cleanBuild();
        break;
      case '4':
        cleanNodeModules();
        break;
      case '5':
        cleanAll();
        break;
      case '6':
        customCleanup(rl);
        return; // Don't close readline yet
      case '7':
        runCleanup({ dryRun: true });
        break;
      case '8':
        console.log('👋 Goodbye!');
        break;
      default:
        console.log(`${colors.red}❌ Invalid choice${colors.reset}`);
    }
    
    rl.close();
  });
}

/**
 * Custom cleanup configuration
 */
function customCleanup(rl) {
  rl.question('Enter directories to clean (comma-separated): ', (dirs) => {
    rl.question('Enter file patterns to clean (comma-separated): ', (files) => {
      rl.question('Keep directory structure? (y/n): ', (keep) => {
        rl.question('Dry run? (y/n): ', (dry) => {
          
          const config = {
            directories: dirs.split(',').map(d => d.trim()).filter(d => d),
            files: files.split(',').map(f => f.trim()).filter(f => f),
            keepStructure: keep.toLowerCase().startsWith('y'),
            dryRun: dry.toLowerCase().startsWith('y')
          };
          
          runCleanup(config);
          rl.close();
        });
      });
    });
  });
}

// Handle command line arguments
const args = process.argv.slice(2);

if (require.main === module) {
  if (args.length === 0) {
    interactiveCleanup();
  } else {
    const command = args[0];
    const isDryRun = args.includes('--dry-run') || args.includes('-d');
    
    switch (command) {
      case 'reports':
        cleanReports();
        break;
      case 'logs':
        cleanLogs();
        break;
      case 'build':
        cleanBuild();
        break;
      case 'node_modules':
        cleanNodeModules();
        break;
      case 'all':
        runCleanup({ dryRun: isDryRun });
        break;
      case 'help':
      case '--help':
      case '-h':
        console.log(`
${colors.blue}${colors.bold}🧹 Cleanup Script Usage${colors.reset}

Commands:
  node cleanup.js                 - Interactive mode
  node cleanup.js reports         - Clean reports only
  node cleanup.js logs           - Clean logs only
  node cleanup.js build          - Clean build artifacts
  node cleanup.js node_modules   - Clean node_modules cache
  node cleanup.js all            - Clean everything
  node cleanup.js all --dry-run  - Preview what would be cleaned

Options:
  --dry-run, -d    Preview mode (don't actually delete files)
  --help, -h       Show this help message

Examples:
  node cleanup.js all --dry-run
  node cleanup.js reports
  npm run clean
        `);
        break;
      default:
        console.log(`${colors.red}❌ Unknown command: ${command}${colors.reset}`);
        console.log(`Use '${colors.blue}node cleanup.js --help${colors.reset}' for usage information`);
        process.exit(1);
    }
  }
}

module.exports = {
  runCleanup,
  cleanReports,
  cleanLogs,
  cleanBuild,
  cleanNodeModules,
  cleanAll
};
