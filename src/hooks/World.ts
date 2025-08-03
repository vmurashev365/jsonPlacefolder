import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { JsonPlaceholderClient } from '../clients/JsonPlaceholderClient';
import { Logger } from '../clients/Logger';
import { TestContext, ApiResponse, ApiError } from '../types/api';
import CONFIG from '../config/config';

export interface CustomWorldOptions extends IWorldOptions {
  parameters: Record<string, any>;
}

export class CustomWorld extends World {
  public client: JsonPlaceholderClient;
  public logger: Logger;
  public context: TestContext;

  constructor(options: CustomWorldOptions) {
    super(options);
    
    this.logger = new Logger('CustomWorld');
    this.client = new JsonPlaceholderClient(CONFIG.baseUrl, CONFIG.timeout);
    
    this.context = {
      baseUrl: CONFIG.baseUrl,
      timeout: CONFIG.timeout,
      testData: {}
    };

    this.logger.info('🌍 World initialized', {
      baseUrl: this.context.baseUrl,
      timeout: this.context.timeout
    });
  }

  // Test data management
  setTestData(key: string, value: any): void {
    this.context.testData[key] = value;
    this.logger.debug(`💾 Set test data: ${key}`, { value });
  }

  getTestData(key: string): any {
    const value = this.context.testData[key];
    this.logger.debug(`📖 Get test data: ${key}`, { value });
    return value;
  }

  clearTestData(): void {
    this.context.testData = {};
    this.logger.info('🧹 Cleared all test data');
  }

  // Response management
  setLastResponse(response: ApiResponse): void {
    this.context.lastResponse = response;
    this.setTestData('lastResponse', response);
    this.logger.debug('📥 Set last response', {
      status: response.status,
      statusText: response.statusText
    });
  }

  setLastError(error: ApiError): void {
    this.context.lastError = error;
    this.setTestData('lastError', error);
    this.logger.debug('❌ Set last error', {
      message: error.message,
      status: error.status
    });
  }

  // Utility methods
  async waitFor(milliseconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  // Assertion helpers
  assertEqual(actual: any, expected: any, message?: string): void {
    const passed = actual === expected;
    const assertionMessage = message || `Expected ${expected}, but got ${actual}`;
    
    this.logger.assertion(assertionMessage, passed, expected, actual);
    
    if (!passed) {
      throw new Error(assertionMessage);
    }
  }

  assertNotNull(value: any, message?: string): void {
    const passed = value !== null && value !== undefined;
    const assertionMessage = message || 'Value should not be null or undefined';
    
    this.logger.assertion(assertionMessage, passed, 'not null', value);
    
    if (!passed) {
      throw new Error(assertionMessage);
    }
  }

  assertArray(value: any, message?: string): void {
    const passed = Array.isArray(value);
    const assertionMessage = message || 'Value should be an array';
    
    this.logger.assertion(assertionMessage, passed, 'array', typeof value);
    
    if (!passed) {
      throw new Error(assertionMessage);
    }
  }

  assertArrayLength(array: any[], expectedLength: number, message?: string): void {
    this.assertArray(array, 'Value should be an array');
    
    const passed = array.length === expectedLength;
    const assertionMessage = message || `Array should have length ${expectedLength}, but has ${array.length}`;
    
    this.logger.assertion(assertionMessage, passed, expectedLength, array.length);
    
    if (!passed) {
      throw new Error(assertionMessage);
    }
  }

  assertArrayNotEmpty(array: any[], message?: string): void {
    this.assertArray(array, 'Value should be an array');
    
    const passed = array.length > 0;
    const assertionMessage = message || 'Array should not be empty';
    
    this.logger.assertion(assertionMessage, passed, '> 0', array.length);
    
    if (!passed) {
      throw new Error(assertionMessage);
    }
  }

  assertStatusCode(expectedStatus: number): void {
    const actualStatus = this.context.lastResponse?.status;
    const passed = actualStatus === expectedStatus;
    
    this.logger.assertion(
      `Status code should be ${expectedStatus}`,
      passed,
      expectedStatus,
      actualStatus
    );
    
    if (!passed) {
      throw new Error(`Expected status ${expectedStatus}, but got ${actualStatus}`);
    }
  }

  // Logging helpers
  logCurrentContext(): void {
    this.logger.info('📋 Current test context:', {
      baseUrl: this.context.baseUrl,
      timeout: this.context.timeout,
      lastResponseStatus: this.context.lastResponse?.status,
      lastErrorMessage: this.context.lastError?.message,
      testDataKeys: Object.keys(this.context.testData)
    });
  }

  logLastResponse(): void {
    if (this.context.lastResponse) {
      this.logger.info('📥 Last response:', {
        status: this.context.lastResponse.status,
        statusText: this.context.lastResponse.statusText,
        headers: this.context.lastResponse.headers,
        dataType: typeof this.context.lastResponse.data,
        dataKeys: this.context.lastResponse.data && typeof this.context.lastResponse.data === 'object' 
          ? Object.keys(this.context.lastResponse.data) 
          : null
      });
    } else {
      this.logger.warn('📥 No response available');
    }
  }

  logLastError(): void {
    if (this.context.lastError) {
      this.logger.error('❌ Last error:', {
        message: this.context.lastError.message,
        status: this.context.lastError.status,
        statusText: this.context.lastError.statusText,
        data: this.context.lastError.data
      });
    } else {
      this.logger.info('✅ No error available');
    }
  }

  // Performance helpers
  startTimer(label: string): void {
    this.setTestData(`timer_${label}`, Date.now());
  }

  endTimer(label: string): number {
    const startTime = this.getTestData(`timer_${label}`);
    if (!startTime) {
      throw new Error(`Timer ${label} was not started`);
    }
    
    const duration = Date.now() - startTime;
    this.setTestData(`duration_${label}`, duration);
    this.logger.info(`⏱️ ${label} took ${duration}ms`);
    
    return duration;
  }

  // Clean up after scenario
  async cleanup(): Promise<void> {
    this.logger.info('🧹 Cleaning up scenario data');
    
    // Clear context but keep configuration
    this.context.lastResponse = undefined;
    this.context.lastError = undefined;
    this.clearTestData();
  }
}

// Set the world constructor
setWorldConstructor(CustomWorld);
