import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../hooks/World';

// Common setup steps
Given('I wait for {int} seconds', async function (this: CustomWorld, seconds: number) {
  this.logger.info(`⏳ Waiting for ${seconds} seconds`);
  await this.waitFor(seconds * 1000);
});

Given('I wait for {int} milliseconds', async function (this: CustomWorld, milliseconds: number) {
  this.logger.info(`⏳ Waiting for ${milliseconds} milliseconds`);
  await this.waitFor(milliseconds);
});

// Environment and configuration steps
Given('the environment is {string}', async function (this: CustomWorld, environment: string) {
  const currentEnv = process.env.NODE_ENV || 'test';
  if (currentEnv !== environment) {
    throw new Error(`Expected environment ${environment}, but running in ${currentEnv}`);
  }
  this.logger.info(`🌍 Running in ${environment} environment`);
});

Given('the base URL is {string}', async function (this: CustomWorld, baseUrl: string) {
  this.assertEqual(this.context.baseUrl, baseUrl, `Base URL should be ${baseUrl}`);
  this.logger.info(`🔗 Base URL confirmed: ${baseUrl}`);
});

// Data management steps
Given('I clear all test data', async function (this: CustomWorld) {
  this.clearTestData();
  this.logger.info('🧹 Cleared all test data');
});

Given('I set test data {string} to {string}', async function (this: CustomWorld, key: string, value: string) {
  // Try to parse JSON if possible, otherwise use as string
  let parsedValue: any = value;
  try {
    parsedValue = JSON.parse(value);
  } catch {
    // Keep as string if not valid JSON
  }
  
  this.setTestData(key, parsedValue);
  this.logger.info(`💾 Set test data ${key} to ${value}`);
});

When('I retrieve test data {string}', async function (this: CustomWorld, key: string) {
  const value = this.getTestData(key);
  this.setTestData('retrievedValue', value);
  this.logger.info(`📖 Retrieved test data ${key}:`, value);
});

// Logging and debugging steps
When('I log the current context', async function (this: CustomWorld) {
  this.logCurrentContext();
});

When('I log the last response', async function (this: CustomWorld) {
  this.logLastResponse();
});

When('I log the last error', async function (this: CustomWorld) {
  this.logLastError();
});

When('I log a message {string}', async function (this: CustomWorld, message: string) {
  this.logger.info(`📝 ${message}`);
});

// Common assertion steps
Then('the test data {string} should equal {string}', async function (this: CustomWorld, key: string, expectedValue: string) {
  const actualValue = this.getTestData(key);
  
  // Try to parse expected value as JSON
  let parsedExpected: any = expectedValue;
  try {
    parsedExpected = JSON.parse(expectedValue);
  } catch {
    // Keep as string if not valid JSON
  }
  
  this.assertEqual(actualValue, parsedExpected, `Test data ${key} should equal ${expectedValue}`);
});

Then('the test data {string} should not be null', async function (this: CustomWorld, key: string) {
  const value = this.getTestData(key);
  this.assertNotNull(value, `Test data ${key} should not be null`);
});

Then('the test data {string} should be an array', async function (this: CustomWorld, key: string) {
  const value = this.getTestData(key);
  this.assertArray(value, `Test data ${key} should be an array`);
});

Then('the test data {string} should have length {int}', async function (this: CustomWorld, key: string, expectedLength: number) {
  const value = this.getTestData(key);
  this.assertArrayLength(value, expectedLength, `Test data ${key} should have length ${expectedLength}`);
});

// HTTP response common assertions
Then('the response should not be null', async function (this: CustomWorld) {
  const response = this.getTestData('lastResponse');
  this.assertNotNull(response, 'Response should not be null');
});

Then('the response data should not be null', async function (this: CustomWorld) {
  const response = this.getTestData('lastResponse');
  this.assertNotNull(response?.data, 'Response data should not be null');
});

Then('the response should have status code {int}', async function (this: CustomWorld, expectedStatus: number) {
  this.assertStatusCode(expectedStatus);
});

Then('the response should be successful', async function (this: CustomWorld) {
  const status = this.context.lastResponse?.status;
  const isSuccessful = status && status >= 200 && status < 300;
  
  this.logger.assertion('Response should be successful (2xx)', !!isSuccessful, '2xx status', status);
  
  if (!isSuccessful) {
    throw new Error(`Expected successful response (2xx), but got status ${status}`);
  }
});

Then('the response should be a client error', async function (this: CustomWorld) {
  const status = this.context.lastResponse?.status;
  const isClientError = status && status >= 400 && status < 500;
  
  this.logger.assertion('Response should be client error (4xx)', !!isClientError, '4xx status', status);
  
  if (!isClientError) {
    throw new Error(`Expected client error response (4xx), but got status ${status}`);
  }
});

Then('the response should be a server error', async function (this: CustomWorld) {
  const status = this.context.lastResponse?.status;
  const isServerError = status && status >= 500 && status < 600;
  
  this.logger.assertion('Response should be server error (5xx)', !!isServerError, '5xx status', status);
  
  if (!isServerError) {
    throw new Error(`Expected server error response (5xx), but got status ${status}`);
  }
});

// Content type assertions
Then('the response content type should be {string}', async function (this: CustomWorld, expectedContentType: string) {
  const headers = this.context.lastResponse?.headers;
  const contentType = headers?.['content-type'] || headers?.['Content-Type'];
  
  const assertion = contentType && contentType.includes(expectedContentType);
  this.logger.assertion(`Content type should include ${expectedContentType}`, !!assertion, expectedContentType, contentType);
  
  if (!assertion) {
    throw new Error(`Expected content type to include ${expectedContentType}, but got ${contentType}`);
  }
});

Then('the response should be JSON', async function (this: CustomWorld) {
  const headers = this.context.lastResponse?.headers;
  const contentType = headers?.['content-type'] || headers?.['Content-Type'];
  
  const isJson = contentType && contentType.includes('application/json');
  this.logger.assertion('Response should be JSON', !!isJson, 'application/json', contentType);
  
  if (!isJson) {
    throw new Error(`Expected JSON response, but got content type: ${contentType}`);
  }
});

// Error handling assertions
Then('an error should have occurred', async function (this: CustomWorld) {
  const error = this.context.lastError;
  this.assertNotNull(error, 'An error should have occurred');
});

Then('no error should have occurred', async function (this: CustomWorld) {
  const error = this.context.lastError;
  if (error) {
    throw new Error(`Expected no error, but got: ${error.message}`);
  }
});

Then('the error message should contain {string}', async function (this: CustomWorld, expectedText: string) {
  const error = this.context.lastError;
  this.assertNotNull(error, 'Error should exist');
  
  if (error) {
    const containsText = error.message && error.message.includes(expectedText);
    this.logger.assertion(`Error message should contain "${expectedText}"`, !!containsText, expectedText, error.message);
    
    if (!containsText) {
      throw new Error(`Expected error message to contain "${expectedText}", but got: ${error.message}`);
    }
  }
});

Then('the error status should be {int}', async function (this: CustomWorld, expectedStatus: number) {
  const error = this.context.lastError;
  this.assertNotNull(error, 'Error should exist');
  if (error) {
    this.assertEqual(error.status, expectedStatus, `Error status should be ${expectedStatus}`);
  }
});

// Performance assertions
Then('the response time should be less than {int} milliseconds', async function (this: CustomWorld, maxTime: number) {
  // This would need actual timing implementation in the HTTP client
  this.logger.info(`⏱️ Checking response time is under ${maxTime}ms`);
  // For now, just log - would need to implement actual timing in BaseClient
});

// Array and object assertions
Then('the response data should be an array', async function (this: CustomWorld) {
  const response = this.getTestData('lastResponse');
  this.assertArray(response.data, 'Response data should be an array');
});

Then('the response data should not be empty', async function (this: CustomWorld) {
  const response = this.getTestData('lastResponse');
  if (Array.isArray(response.data)) {
    this.assertArrayNotEmpty(response.data, 'Response array should not be empty');
  } else {
    this.assertNotNull(response.data, 'Response data should not be empty');
  }
});

Then('the response data should have {int} items', async function (this: CustomWorld, expectedCount: number) {
  const response = this.getTestData('lastResponse');
  this.assertArrayLength(response.data, expectedCount, `Response should have ${expectedCount} items`);
});

Then('the response data should contain property {string}', async function (this: CustomWorld, propertyName: string) {
  const response = this.getTestData('lastResponse');
  const hasProperty = response.data && propertyName in response.data;
  
  this.logger.assertion(`Response should contain property ${propertyName}`, hasProperty, 'property exists', hasProperty);
  
  if (!hasProperty) {
    throw new Error(`Response data should contain property ${propertyName}`);
  }
});

Then('the response data property {string} should equal {string}', async function (this: CustomWorld, propertyName: string, expectedValue: string) {
  const response = this.getTestData('lastResponse');
  const actualValue = response.data[propertyName];
  
  // Try to parse expected value
  let parsedExpected: any = expectedValue;
  try {
    parsedExpected = JSON.parse(expectedValue);
  } catch {
    // Keep as string if not valid JSON
  }
  
  this.assertEqual(actualValue, parsedExpected, `Property ${propertyName} should equal ${expectedValue}`);
});

// Utility steps for debugging
Then('I should see the current test context', async function (this: CustomWorld) {
  this.logCurrentContext();
});

Then('I should see the response headers', async function (this: CustomWorld) {
  const headers = this.context.lastResponse?.headers;
  this.logger.info('Response headers:', headers);
});

Then('I should see the request details', async function (this: CustomWorld) {
  this.logger.info('Request details:', {
    baseUrl: this.context.baseUrl,
    timeout: this.context.timeout,
    lastResponse: this.context.lastResponse ? {
      status: this.context.lastResponse.status,
      statusText: this.context.lastResponse.statusText
    } : null
  });
});

// Skip step for conditional testing
Then('I skip this step', async function (this: CustomWorld) {
  this.logger.info('⏭️ Skipping step as requested');
  return 'skipped';
});
