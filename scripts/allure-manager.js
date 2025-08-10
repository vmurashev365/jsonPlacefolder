#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const ALLURE_RESULTS_DIR = 'allure-results';
const ALLURE_REPORT_DIR = 'allure-report';

console.log('🔬 Allure Report Manager');
console.log('========================');

// Ensure directories exist
function ensureDirectoriesExist() {
  const dirs = [ALLURE_RESULTS_DIR, ALLURE_REPORT_DIR];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  });
}

// Clean Allure directories
function cleanAllure() {
  console.log('🧹 Cleaning Allure directories...');
  try {
    if (fs.existsSync(ALLURE_RESULTS_DIR)) {
      fs.rmSync(ALLURE_RESULTS_DIR, { recursive: true, force: true });
      console.log(`✅ Cleaned ${ALLURE_RESULTS_DIR}`);
    }
    if (fs.existsSync(ALLURE_REPORT_DIR)) {
      fs.rmSync(ALLURE_REPORT_DIR, { recursive: true, force: true });
      console.log(`✅ Cleaned ${ALLURE_REPORT_DIR}`);
    }
  } catch (error) {
    console.error(`❌ Error cleaning directories: ${error.message}`);
  }
}

// Generate Allure report
function generateReport() {
  console.log('📊 Generating Allure report...');
  try {
    execSync(`npx allure generate ${ALLURE_RESULTS_DIR} -o ${ALLURE_REPORT_DIR} --clean`, {
      stdio: 'inherit'
    });
    console.log('✅ Allure report generated successfully!');
  } catch (error) {
    console.error(`❌ Error generating report: ${error.message}`);
    process.exit(1);
  }
}

// Open Allure report
function openReport() {
  console.log('🌐 Opening Allure report...');
  try {
    execSync(`npx allure open ${ALLURE_REPORT_DIR}`, {
      stdio: 'inherit'
    });
  } catch (error) {
    console.error(`❌ Error opening report: ${error.message}`);
  }
}

// Serve Allure report (alternative to open)
function serveReport() {
  console.log('🚀 Serving Allure report...');
  try {
    execSync(`npx allure serve ${ALLURE_RESULTS_DIR}`, {
      stdio: 'inherit'
    });
  } catch (error) {
    console.error(`❌ Error serving report: ${error.message}`);
  }
}

// Run tests with Allure and generate report
function runTestsAndGenerate(testType = 'smoke') {
  console.log(`🧪 Running ${testType} tests with Allure...`);
  
  ensureDirectoriesExist();
  cleanAllure();
  ensureDirectoriesExist();
  
  try {
    // Run tests
    const testCommand = testType === 'all' 
      ? 'npm run test:allure'
      : `npm run test:${testType}:allure`;
      
    console.log(`Running command: ${testCommand}`);
    execSync(testCommand, { stdio: 'inherit' });
    
    // Generate report
    generateReport();
    
    // Open report
    openReport();
    
  } catch (error) {
    console.error(`❌ Error in test execution: ${error.message}`);
    
    // Still try to generate report if results exist
    if (fs.existsSync(ALLURE_RESULTS_DIR) && fs.readdirSync(ALLURE_RESULTS_DIR).length > 0) {
      console.log('🔄 Attempting to generate report from existing results...');
      generateReport();
      openReport();
    }
  }
}

// Main execution
const command = process.argv[2];
const testType = process.argv[3] || 'smoke';

switch (command) {
  case 'clean':
    cleanAllure();
    break;
  case 'generate':
    generateReport();
    break;
  case 'open':
    openReport();
    break;
  case 'serve':
    serveReport();
    break;
  case 'run':
    runTestsAndGenerate(testType);
    break;
  default:
    console.log(`
📖 Usage: node scripts/allure-manager.js <command> [testType]

Commands:
  clean     - Clean Allure directories
  generate  - Generate Allure report from results
  open      - Open existing Allure report
  serve     - Serve Allure report (alternative to open)
  run       - Run tests and generate report

Test Types (for 'run' command):
  smoke     - Run smoke tests (default)
  comments  - Run comments tests
  posts     - Run posts tests
  users     - Run users tests
  all       - Run all tests

Examples:
  node scripts/allure-manager.js run smoke
  node scripts/allure-manager.js run comments
  node scripts/allure-manager.js generate
  node scripts/allure-manager.js open
    `);
}
