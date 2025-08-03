#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const reporter = require('cucumber-html-reporter');

// Configuration
const CONFIG = {
  jsonFile: 'reports/cucumber-report.json',
  output: 'reports/cucumber-report.html',
  theme: process.env.REPORT_THEME || 'bootstrap',
  title: process.env.REPORT_TITLE || 'JSONPlaceholder API Tests',
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: false,
  metadata: {
    'Test Environment': process.env.NODE_ENV || 'test',
    'Base URL': process.env.BASE_URL || 'https://jsonplaceholder.typicode.com',
    'Platform': process.platform,
    'Node Version': process.version,
    'Executed': new Date().toLocaleString()
  }
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
 * Generate HTML report from JSON
 */
function generateHtmlReport() {
  console.log(`${colors.blue}${colors.bold}📊 Generating Test Report${colors.reset}`);
  
  // Check if JSON report exists
  if (!fs.existsSync(CONFIG.jsonFile)) {
    console.log(`${colors.red}❌ JSON report not found: ${CONFIG.jsonFile}${colors.reset}`);
    console.log(`${colors.yellow}💡 Run tests first to generate the JSON report${colors.reset}`);
    process.exit(1);
  }
  
  // Ensure reports directory exists
  const reportsDir = path.dirname(CONFIG.output);
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
    console.log(`${colors.blue}📁 Created reports directory: ${reportsDir}${colors.reset}`);
  }
  
  console.log(`${colors.blue}📄 Input: ${CONFIG.jsonFile}${colors.reset}`);
  console.log(`${colors.blue}📋 Output: ${CONFIG.output}${colors.reset}`);
  console.log(`${colors.blue}🎨 Theme: ${CONFIG.theme}${colors.reset}`);
  
  try {
    // Read and parse JSON report to add metadata
    const jsonData = JSON.parse(fs.readFileSync(CONFIG.jsonFile, 'utf8'));
    
    // Calculate statistics
    const stats = calculateStats(jsonData);
    console.log(`${colors.blue}📈 Statistics:${colors.reset}`);
    console.log(`  Features: ${stats.features}`);
    console.log(`  Scenarios: ${stats.scenarios.total}`);
    console.log(`  Passed: ${colors.green}${stats.scenarios.passed}${colors.reset}`);
    console.log(`  Failed: ${colors.red}${stats.scenarios.failed}${colors.reset}`);
    console.log(`  Skipped: ${colors.yellow}${stats.scenarios.skipped}${colors.reset}`);
    console.log(`  Success Rate: ${stats.successRate}%`);
    
    // Add calculated stats to metadata
    CONFIG.metadata['Features'] = stats.features;
    CONFIG.metadata['Scenarios'] = `${stats.scenarios.total} (${stats.scenarios.passed} passed, ${stats.scenarios.failed} failed)`;
    CONFIG.metadata['Success Rate'] = `${stats.successRate}%`;
    CONFIG.metadata['Duration'] = formatDuration(stats.duration);
    
    // Generate HTML report
    const options = {
      ...CONFIG,
      jsonFile: CONFIG.jsonFile,
      output: CONFIG.output
    };
    
    reporter.generate(options);
    
    console.log(`${colors.green}✅ HTML report generated successfully!${colors.reset}`);
    console.log(`${colors.blue}🌐 Report location: ${path.resolve(CONFIG.output)}${colors.reset}`);
    
    // Generate additional reports if requested
    if (process.env.GENERATE_MULTIPLE_REPORTS === 'true') {
      generateMultipleReports(jsonData, stats);
    }
    
    return {
      success: true,
      outputFile: CONFIG.output,
      stats
    };
    
  } catch (error) {
    console.log(`${colors.red}❌ Failed to generate report: ${error.message}${colors.reset}`);
    console.log(`${colors.red}${error.stack}${colors.reset}`);
    process.exit(1);
  }
}

/**
 * Calculate test statistics from JSON data
 */
function calculateStats(jsonData) {
  let totalFeatures = 0;
  let totalScenarios = 0;
  let passedScenarios = 0;
  let failedScenarios = 0;
  let skippedScenarios = 0;
  let totalDuration = 0;
  
  jsonData.forEach(feature => {
    totalFeatures++;
    
    feature.elements.forEach(scenario => {
      totalScenarios++;
      
      let scenarioPassed = true;
      let scenarioSkipped = false;
      let scenarioDuration = 0;
      
      scenario.steps.forEach(step => {
        if (step.result) {
          scenarioDuration += step.result.duration || 0;
          
          if (step.result.status === 'failed') {
            scenarioPassed = false;
          } else if (step.result.status === 'skipped') {
            scenarioSkipped = true;
          }
        }
      });
      
      totalDuration += scenarioDuration;
      
      if (scenarioSkipped) {
        skippedScenarios++;
      } else if (scenarioPassed) {
        passedScenarios++;
      } else {
        failedScenarios++;
      }
    });
  });
  
  const successRate = totalScenarios > 0 ? Math.round((passedScenarios / totalScenarios) * 100) : 0;
  
  return {
    features: totalFeatures,
    scenarios: {
      total: totalScenarios,
      passed: passedScenarios,
      failed: failedScenarios,
      skipped: skippedScenarios
    },
    successRate,
    duration: totalDuration
  };
}

/**
 * Format duration in nanoseconds to human readable string
 */
function formatDuration(nanoseconds) {
  const milliseconds = nanoseconds / 1000000;
  
  if (milliseconds < 1000) {
    return `${Math.round(milliseconds)}ms`;
  }
  
  const seconds = milliseconds / 1000;
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  }
  
  const minutes = seconds / 60;
  return `${minutes.toFixed(1)}m`;
}

/**
 * Generate multiple report formats
 */
function generateMultipleReports(jsonData, stats) {
  console.log(`${colors.blue}📊 Generating additional report formats...${colors.reset}`);
  
  try {
    // Generate JUnit XML report
    generateJUnitReport(jsonData, stats);
    
    // Generate summary JSON report
    generateSummaryReport(stats);
    
    // Generate CSV report
    generateCsvReport(jsonData);
    
  } catch (error) {
    console.log(`${colors.yellow}⚠️ Failed to generate additional reports: ${error.message}${colors.reset}`);
  }
}

/**
 * Generate JUnit XML report
 */
function generateJUnitReport(jsonData, stats) {
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<testsuites name="JSONPlaceholder API Tests" tests="${stats.scenarios.total}" failures="${stats.scenarios.failed}" time="${stats.duration / 1000000000}">
${jsonData.map(feature => 
  `  <testsuite name="${feature.name}" tests="${feature.elements.length}">
${feature.elements.map(scenario => {
  const failed = scenario.steps.some(step => step.result?.status === 'failed');
  const duration = scenario.steps.reduce((sum, step) => sum + (step.result?.duration || 0), 0) / 1000000000;
  
  return `    <testcase name="${scenario.name}" time="${duration}"${failed ? '>\n      <failure message="Scenario failed"/>\n    </testcase>' : '/>'}`;
}).join('\n')}
  </testsuite>`
).join('\n')}
</testsuites>`;

  fs.writeFileSync('reports/junit-report.xml', xmlContent);
  console.log(`${colors.green}✅ JUnit XML report generated: reports/junit-report.xml${colors.reset}`);
}

/**
 * Generate summary JSON report
 */
function generateSummaryReport(stats) {
  const summary = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'test',
    baseUrl: process.env.BASE_URL || 'https://jsonplaceholder.typicode.com',
    ...stats,
    generatedAt: new Date().toISOString()
  };
  
  fs.writeFileSync('reports/summary.json', JSON.stringify(summary, null, 2));
  console.log(`${colors.green}✅ Summary JSON report generated: reports/summary.json${colors.reset}`);
}

/**
 * Generate CSV report
 */
function generateCsvReport(jsonData) {
  let csvContent = 'Feature,Scenario,Status,Duration,Error\n';
  
  jsonData.forEach(feature => {
    feature.elements.forEach(scenario => {
      const failed = scenario.steps.some(step => step.result?.status === 'failed');
      const skipped = scenario.steps.some(step => step.result?.status === 'skipped');
      const status = failed ? 'FAILED' : skipped ? 'SKIPPED' : 'PASSED';
      const duration = scenario.steps.reduce((sum, step) => sum + (step.result?.duration || 0), 0) / 1000000;
      const error = scenario.steps.find(step => step.result?.error_message)?.result?.error_message || '';
      
      csvContent += `"${feature.name}","${scenario.name}","${status}",${duration},"${error.replace(/"/g, '""')}"\n`;
    });
  });
  
  fs.writeFileSync('reports/results.csv', csvContent);
  console.log(`${colors.green}✅ CSV report generated: reports/results.csv${colors.reset}`);
}

/**
 * Open report in browser
 */
function openReport() {
  const open = require('child_process').exec;
  const reportPath = path.resolve(CONFIG.output);
  
  console.log(`${colors.blue}🌐 Opening report in browser...${colors.reset}`);
  
  // Platform-specific open command
  const command = process.platform === 'win32' ? 'start' : 
                 process.platform === 'darwin' ? 'open' : 'xdg-open';
  
  open(`${command} "${reportPath}"`, (error) => {
    if (error) {
      console.log(`${colors.yellow}⚠️ Could not open browser automatically: ${error.message}${colors.reset}`);
      console.log(`${colors.blue}📂 Please open manually: ${reportPath}${colors.reset}`);
    } else {
      console.log(`${colors.green}✅ Report opened in browser${colors.reset}`);
    }
  });
}

/**
 * Handle command line arguments
 */
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
${colors.blue}${colors.bold}📊 Report Generator Usage${colors.reset}

Usage: node generate-report.js [options]

Options:
  --help, -h       Show this help message
  --open, -o       Open report in browser after generation
  --theme <theme>  Report theme (bootstrap, hierarchy, foundation, simple)
  --title <title>  Report title
  --multiple       Generate multiple report formats (HTML, XML, JSON, CSV)

Environment Variables:
  REPORT_THEME     Report theme (default: bootstrap)
  REPORT_TITLE     Report title (default: JSONPlaceholder API Tests)
  GENERATE_MULTIPLE_REPORTS  Generate additional formats (default: false)

Examples:
  node generate-report.js
  node generate-report.js --open
  node generate-report.js --theme hierarchy --title "My API Tests"
  REPORT_THEME=foundation node generate-report.js --multiple
  `);
  process.exit(0);
}

// Parse command line options
if (args.includes('--theme')) {
  const themeIndex = args.indexOf('--theme');
  if (args[themeIndex + 1]) {
    CONFIG.theme = args[themeIndex + 1];
  }
}

if (args.includes('--title')) {
  const titleIndex = args.indexOf('--title');
  if (args[titleIndex + 1]) {
    CONFIG.title = args[titleIndex + 1];
  }
}

if (args.includes('--multiple')) {
  process.env.GENERATE_MULTIPLE_REPORTS = 'true';
}

// Generate report
if (require.main === module) {
  const result = generateHtmlReport();
  
  if (result.success && (args.includes('--open') || args.includes('-o'))) {
    openReport();
  }
}

module.exports = {
  generateHtmlReport,
  calculateStats,
  formatDuration
};
