#!/usr/bin/env node

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  baseUrl: process.env.BASE_URL || 'https://jsonplaceholder.typicode.com',
  timeout: parseInt(process.env.HEALTH_CHECK_TIMEOUT || '10000'),
  retries: parseInt(process.env.HEALTH_CHECK_RETRIES || '3'),
  outputFile: 'health-check.json',
  statusFile: 'health-status.txt'
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
 * Health check endpoints to test
 */
const ENDPOINTS = [
  { path: '/posts', expected: { status: 200, isArray: true, minLength: 100 } },
  { path: '/posts/1', expected: { status: 200, isObject: true, hasId: true } },
  { path: '/users', expected: { status: 200, isArray: true, minLength: 10 } },
  { path: '/users/1', expected: { status: 200, isObject: true, hasId: true } },
  { path: '/comments', expected: { status: 200, isArray: true, minLength: 500 } },
  { path: '/albums', expected: { status: 200, isArray: true, minLength: 100 } },
  { path: '/photos', expected: { status: 200, isArray: true, minLength: 5000 } },
  { path: '/todos', expected: { status: 200, isArray: true, minLength: 200 } }
];

/**
 * Create axios instance with timeout
 */
const client = axios.create({
  baseURL: CONFIG.baseUrl,
  timeout: CONFIG.timeout,
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'JSONPlaceholder-Health-Check/1.0'
  }
});

/**
 * Perform health check for a single endpoint
 */
async function checkEndpoint(endpoint) {
  const startTime = Date.now();
  
  try {
    const response = await client.get(endpoint.path);
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    const result = {
      endpoint: endpoint.path,
      status: 'healthy',
      httpStatus: response.status,
      responseTime,
      checks: []
    };
    
    // Validate status code
    if (response.status === endpoint.expected.status) {
      result.checks.push({ name: 'status_code', passed: true, expected: endpoint.expected.status, actual: response.status });
    } else {
      result.checks.push({ name: 'status_code', passed: false, expected: endpoint.expected.status, actual: response.status });
      result.status = 'unhealthy';
    }
    
    // Validate content type
    const contentType = response.headers['content-type'];
    if (contentType && contentType.includes('application/json')) {
      result.checks.push({ name: 'content_type', passed: true, expected: 'application/json', actual: contentType });
    } else {
      result.checks.push({ name: 'content_type', passed: false, expected: 'application/json', actual: contentType });
      result.status = 'unhealthy';
    }
    
    // Validate response structure
    const data = response.data;
    
    if (endpoint.expected.isArray) {
      if (Array.isArray(data)) {
        result.checks.push({ name: 'is_array', passed: true, expected: 'array', actual: 'array' });
        
        if (endpoint.expected.minLength && data.length >= endpoint.expected.minLength) {
          result.checks.push({ name: 'min_length', passed: true, expected: `>= ${endpoint.expected.minLength}`, actual: data.length });
        } else if (endpoint.expected.minLength) {
          result.checks.push({ name: 'min_length', passed: false, expected: `>= ${endpoint.expected.minLength}`, actual: data.length });
          result.status = 'unhealthy';
        }
      } else {
        result.checks.push({ name: 'is_array', passed: false, expected: 'array', actual: typeof data });
        result.status = 'unhealthy';
      }
    }
    
    if (endpoint.expected.isObject) {
      if (typeof data === 'object' && !Array.isArray(data)) {
        result.checks.push({ name: 'is_object', passed: true, expected: 'object', actual: 'object' });
        
        if (endpoint.expected.hasId && data.id) {
          result.checks.push({ name: 'has_id', passed: true, expected: 'id field present', actual: 'id field present' });
        } else if (endpoint.expected.hasId) {
          result.checks.push({ name: 'has_id', passed: false, expected: 'id field present', actual: 'id field missing' });
          result.status = 'unhealthy';
        }
      } else {
        result.checks.push({ name: 'is_object', passed: false, expected: 'object', actual: typeof data });
        result.status = 'unhealthy';
      }
    }
    
    return result;
    
  } catch (error) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    return {
      endpoint: endpoint.path,
      status: 'unhealthy',
      error: error.message,
      responseTime,
      httpStatus: error.response ? error.response.status : null,
      checks: [
        { name: 'connectivity', passed: false, expected: 'successful request', actual: error.message }
      ]
    };
  }
}

/**
 * Perform health check with retries
 */
async function checkEndpointWithRetries(endpoint) {
  let lastError;
  
  for (let attempt = 1; attempt <= CONFIG.retries; attempt++) {
    console.log(`${colors.blue}🔍 Checking ${endpoint.path} (attempt ${attempt}/${CONFIG.retries})${colors.reset}`);
    
    try {
      const result = await checkEndpoint(endpoint);
      
      if (result.status === 'healthy') {
        console.log(`  ${colors.green}✅ Healthy (${result.responseTime}ms)${colors.reset}`);
        return result;
      } else {
        console.log(`  ${colors.yellow}⚠️ Unhealthy (${result.responseTime}ms)${colors.reset}`);
        lastError = result;
        
        if (attempt < CONFIG.retries) {
          console.log(`  ${colors.yellow}🔄 Retrying in 1 second...${colors.reset}`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    } catch (error) {
      console.log(`  ${colors.red}❌ Error: ${error.message}${colors.reset}`);
      lastError = { 
        endpoint: endpoint.path, 
        status: 'unhealthy', 
        error: error.message,
        checks: []
      };
      
      if (attempt < CONFIG.retries) {
        console.log(`  ${colors.yellow}🔄 Retrying in 1 second...${colors.reset}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
  
  return lastError;
}

/**
 * Run complete health check
 */
async function runHealthCheck() {
  console.log(`${colors.blue}${colors.bold}🏥 JSONPlaceholder API Health Check${colors.reset}`);
  console.log(`${colors.blue}Base URL: ${CONFIG.baseUrl}${colors.reset}`);
  console.log(`${colors.blue}Timeout: ${CONFIG.timeout}ms${colors.reset}`);
  console.log(`${colors.blue}Retries: ${CONFIG.retries}${colors.reset}\n`);
  
  const startTime = Date.now();
  const results = [];
  
  // Test basic connectivity first
  console.log(`${colors.blue}🌐 Testing basic connectivity...${colors.reset}`);
  try {
    await client.get('/posts/1');
    console.log(`${colors.green}✅ Basic connectivity OK${colors.reset}\n`);
  } catch (error) {
    console.log(`${colors.red}❌ Basic connectivity failed: ${error.message}${colors.reset}`);
    console.log(`${colors.red}❌ Aborting health check${colors.reset}\n`);
    
    const report = {
      timestamp: new Date().toISOString(),
      baseUrl: CONFIG.baseUrl,
      status: 'unhealthy',
      duration: Date.now() - startTime,
      error: 'Basic connectivity failed',
      results: []
    };
    
    saveResults(report);
    process.exit(1);
  }
  
  // Test all endpoints
  for (const endpoint of ENDPOINTS) {
    const result = await checkEndpointWithRetries(endpoint);
    results.push(result);
  }
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  // Calculate overall status
  const healthyCount = results.filter(r => r.status === 'healthy').length;
  const unhealthyCount = results.filter(r => r.status === 'unhealthy').length;
  const overallStatus = unhealthyCount === 0 ? 'healthy' : 'degraded';
  
  // Create report
  const report = {
    timestamp: new Date().toISOString(),
    baseUrl: CONFIG.baseUrl,
    status: overallStatus,
    duration,
    summary: {
      total: results.length,
      healthy: healthyCount,
      unhealthy: unhealthyCount,
      healthPercentage: Math.round((healthyCount / results.length) * 100)
    },
    results
  };
  
  // Display summary
  displaySummary(report);
  
  // Save results
  saveResults(report);
  
  // Exit with appropriate code
  process.exit(overallStatus === 'healthy' ? 0 : 1);
}

/**
 * Display health check summary
 */
function displaySummary(report) {
  console.log('\n' + '='.repeat(60));
  console.log(`${colors.bold}🏥 HEALTH CHECK SUMMARY${colors.reset}`);
  console.log('='.repeat(60));
  
  const statusColor = report.status === 'healthy' ? colors.green : 
                     report.status === 'degraded' ? colors.yellow : colors.red;
  
  console.log(`Status: ${statusColor}${report.status.toUpperCase()}${colors.reset}`);
  console.log(`Duration: ${report.duration}ms`);
  console.log(`Health: ${report.summary.healthPercentage}% (${report.summary.healthy}/${report.summary.total})`);
  
  if (report.summary.unhealthy > 0) {
    console.log(`\n${colors.red}❌ UNHEALTHY ENDPOINTS:${colors.reset}`);
    report.results
      .filter(r => r.status === 'unhealthy')
      .forEach(result => {
        console.log(`  ${colors.red}• ${result.endpoint}${colors.reset}`);
        if (result.error) {
          console.log(`    Error: ${result.error}`);
        }
        result.checks
          .filter(c => !c.passed)
          .forEach(check => {
            console.log(`    ${check.name}: expected ${check.expected}, got ${check.actual}`);
          });
      });
  }
  
  console.log('\n' + '='.repeat(60));
}

/**
 * Save results to files
 */
function saveResults(report) {
  try {
    // Save detailed JSON report
    fs.writeFileSync(CONFIG.outputFile, JSON.stringify(report, null, 2));
    console.log(`\n${colors.blue}📊 Detailed report saved to ${CONFIG.outputFile}${colors.reset}`);
    
    // Save simple status file
    const statusText = `${report.status}\n${report.timestamp}\n${report.summary.healthPercentage}%`;
    fs.writeFileSync(CONFIG.statusFile, statusText);
    console.log(`${colors.blue}📋 Status saved to ${CONFIG.statusFile}${colors.reset}`);
    
  } catch (error) {
    console.log(`${colors.red}❌ Failed to save results: ${error.message}${colors.reset}`);
  }
}

/**
 * Handle command line arguments
 */
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
${colors.blue}${colors.bold}🏥 Health Check Usage${colors.reset}

Usage: node health-check.js [options]

Options:
  --help, -h       Show this help message
  --verbose, -v    Verbose output
  --json           Output JSON only
  --url <url>      Override base URL

Environment Variables:
  BASE_URL                 API base URL (default: https://jsonplaceholder.typicode.com)
  HEALTH_CHECK_TIMEOUT     Request timeout in ms (default: 10000)
  HEALTH_CHECK_RETRIES     Number of retries (default: 3)

Examples:
  node health-check.js
  node health-check.js --url https://my-api.com
  BASE_URL=https://staging-api.com node health-check.js
  `);
  process.exit(0);
}

// Override base URL if provided
const urlIndex = args.indexOf('--url');
if (urlIndex !== -1 && args[urlIndex + 1]) {
  CONFIG.baseUrl = args[urlIndex + 1];
}

// Run health check
if (require.main === module) {
  runHealthCheck().catch(error => {
    console.error(`${colors.red}❌ Health check failed: ${error.message}${colors.reset}`);
    process.exit(1);
  });
}

module.exports = {
  runHealthCheck,
  checkEndpoint,
  ENDPOINTS
};
