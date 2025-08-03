import { Before, After, BeforeAll, AfterAll, Status } from '@cucumber/cucumber';
import { CustomWorld } from './World';
import CONFIG, { validateConfig } from '../config/config';
Before({ tags: '@retry' }, async function(this: CustomWorld, scenario: any) {
  this.logger.info(`🔄 Retry test scenario`);
});;

// Global setup before all scenarios
BeforeAll(async function() {
  console.log('🚀 Starting JSONPlaceholder API Tests');
  console.log('📋 Configuration:', {
    baseUrl: CONFIG.baseUrl,
    timeout: CONFIG.timeout,
    logLevel: CONFIG.logLevel,
    parallel: CONFIG.parallel,
    retryCount: CONFIG.retryCount
  });

  // Validate configuration
  try {
    validateConfig();
    console.log('✅ Configuration validation passed');
  } catch (error) {
    console.error('❌ Configuration validation failed:', error);
    throw error;
  }

  // Perform health check
  console.log('🏥 Performing health check...');
  try {
    const client = require('../clients/JsonPlaceholderClient').JsonPlaceholderClient;
    const apiClient = new client(CONFIG.baseUrl, CONFIG.healthCheckTimeout);
    const healthResult = await apiClient.healthCheck();
    
    if (healthResult.status === 'healthy') {
      console.log('✅ Health check passed');
    } else {
      console.warn('⚠️ Health check failed, but continuing with tests');
      console.warn('Health check result:', healthResult);
    }
  } catch (error) {
    console.warn('⚠️ Health check failed, but continuing with tests');
    console.warn('Health check error:', error);
  }
});

// Setup before each scenario
Before(async function(this: CustomWorld, scenario) {
  this.logger.step(`Starting scenario: ${scenario.pickle.name}`, 'start');
  
  // Set scenario context
  this.setTestData('scenarioName', scenario.pickle.name);
  this.setTestData('scenarioTags', scenario.pickle.tags.map((tag: any) => tag.name));
  this.setTestData('scenarioStartTime', Date.now());

  // Log scenario info
  this.logger.info('📝 Scenario Info:', {
    name: scenario.pickle.name,
    tags: scenario.pickle.tags.map((tag: any) => tag.name),
    uri: scenario.pickle.uri
  });
});

// Setup before smoke test scenarios
Before({ tags: '@smoke' }, async function(this: CustomWorld) {
  this.logger.info('🔥 Smoke test scenario - setting shorter timeout');
  this.client.setTimeout(CONFIG.performanceTimeout);
});

// Setup before performance test scenarios
Before({ tags: '@performance' }, async function(this: CustomWorld) {
  this.logger.info('⚡ Performance test scenario - enabling timing');
  this.startTimer('scenario');
});

// Setup before validation test scenarios
Before({ tags: '@validation' }, async function(this: CustomWorld) {
  this.logger.info('🔒 Validation test scenario - enabling detailed logging');
  // Could set different log level or enable additional validation
});

// Cleanup after each scenario
After(async function(this: CustomWorld, scenario) {
  const scenarioStartTime = this.getTestData('scenarioStartTime');
  const duration = scenarioStartTime ? Date.now() - scenarioStartTime : 0;
  
  // Log scenario completion
  const status = scenario.result?.status || Status.UNKNOWN;
  const statusEmoji = {
    [Status.PASSED]: '✅',
    [Status.FAILED]: '❌',
    [Status.SKIPPED]: '⏭️',
    [Status.PENDING]: '⏳',
    [Status.UNDEFINED]: '❓',
    [Status.AMBIGUOUS]: '🤔',
    [Status.UNKNOWN]: '❓'
  };

  this.logger.step(
    `Completed scenario: ${scenario.pickle.name} (${duration}ms)`,
    status === Status.PASSED ? 'pass' : status === Status.FAILED ? 'fail' : 'skip'
  );

  // Log failure details
  if (status === Status.FAILED && scenario.result?.message) {
    this.logger.error('Scenario failed:', scenario.result.message);
    
    // Log last response if available
    if (this.context.lastResponse) {
      this.logger.error('Last response details:', {
        status: this.context.lastResponse.status,
        statusText: this.context.lastResponse.statusText,
        data: this.context.lastResponse.data
      });
    }

    // Log last error if available
    if (this.context.lastError) {
      this.logger.error('Last error details:', {
        message: this.context.lastError.message,
        status: this.context.lastError.status,
        data: this.context.lastError.data
      });
    }
  }

  // Performance test cleanup
  if (scenario.pickle.tags.some((tag: any) => tag.name === '@performance')) {
    const scenarioDuration = this.endTimer('scenario');
    this.logger.info(`⚡ Performance test completed in ${scenarioDuration}ms`);
  }

  // Reset client timeout
  this.client.setTimeout(CONFIG.timeout);
  
  // Cleanup world
  await this.cleanup();
});

// Cleanup after specific tag scenarios
After({ tags: '@cleanup' }, async function(this: CustomWorld) {
  this.logger.info('🧹 Running additional cleanup for @cleanup tagged scenario');
  // Additional cleanup logic for scenarios that need it
});

// Global cleanup after all scenarios
AfterAll(async function() {
  console.log('🎯 All scenarios completed');
  
  // Could add global cleanup here
  // - Close database connections
  // - Clean up test data
  // - Generate final reports
  
  console.log('✨ Test execution finished');
});

// Hook for skipped scenarios
Before({ tags: '@skip' }, function() {
  return 'skipped';
});

// Hook for manual scenarios (shouldn't run in CI)
Before({ tags: '@manual' }, function() {
  if (CONFIG.ci) {
    console.log('⏭️ Skipping manual test in CI environment');
    return 'skipped';
  }
  return undefined;
});

// Hook for slow scenarios (extended timeout)
Before({ tags: '@slow' }, async function(this: CustomWorld) {
  this.logger.info('🐌 Slow test scenario - extending timeout');
  this.client.setTimeout(CONFIG.timeout * 2);
});

// Hook for retry scenarios
Before({ tags: '@retry' }, async function(this: CustomWorld, scenario: any) {
  this.logger.info(`🔄 Retry test scenario`);
});

export {};
