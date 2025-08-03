import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../hooks/World';

// API request steps
When('I send a GET request to {string}', async function (this: CustomWorld, endpoint: string) {
  this.logger.step(`Sending GET request to ${endpoint}`);
  try {
    const response = await this.client.get(endpoint);
    this.setLastResponse(response);
    this.logger.step(`GET ${endpoint} completed`, 'pass');
  } catch (error) {
    this.setLastError(error as any);
    this.logger.step(`GET ${endpoint} failed`, 'fail');
    throw error;
  }
});

When('I send a POST request to {string}', async function (this: CustomWorld, endpoint: string) {
  this.logger.step(`Sending POST request to ${endpoint}`);
  try {
    const response = await this.client.post(endpoint);
    this.setLastResponse(response);
    this.logger.step(`POST ${endpoint} completed`, 'pass');
  } catch (error) {
    this.setLastError(error as any);
    this.logger.step(`POST ${endpoint} failed`, 'fail');
    throw error;
  }
});

When('I send a POST request to {string} with body:', async function (this: CustomWorld, endpoint: string, requestBody: string) {
  this.logger.step(`Sending POST request to ${endpoint} with body`);
  try {
    const bodyData = JSON.parse(requestBody);
    const response = await this.client.post(endpoint, bodyData);
    this.setLastResponse(response);
    this.logger.step(`POST ${endpoint} with body completed`, 'pass');
  } catch (error) {
    this.setLastError(error as any);
    this.logger.step(`POST ${endpoint} with body failed`, 'fail');
    throw error;
  }
});

When('I send a PUT request to {string}', async function (this: CustomWorld, endpoint: string) {
  this.logger.step(`Sending PUT request to ${endpoint}`);
  try {
    const response = await this.client.put(endpoint);
    this.setLastResponse(response);
    this.logger.step(`PUT ${endpoint} completed`, 'pass');
  } catch (error) {
    this.setLastError(error as any);
    this.logger.step(`PUT ${endpoint} failed`, 'fail');
    throw error;
  }
});

When('I send a PUT request to {string} with body:', async function (this: CustomWorld, endpoint: string, requestBody: string) {
  this.logger.step(`Sending PUT request to ${endpoint} with body`);
  try {
    const bodyData = JSON.parse(requestBody);
    const response = await this.client.put(endpoint, bodyData);
    this.setLastResponse(response);
    this.logger.step(`PUT ${endpoint} with body completed`, 'pass');
  } catch (error) {
    this.setLastError(error as any);
    this.logger.step(`PUT ${endpoint} with body failed`, 'fail');
    throw error;
  }
});

When('I send a PATCH request to {string}', async function (this: CustomWorld, endpoint: string) {
  this.logger.step(`Sending PATCH request to ${endpoint}`);
  try {
    const response = await this.client.patch(endpoint);
    this.setLastResponse(response);
    this.logger.step(`PATCH ${endpoint} completed`, 'pass');
  } catch (error) {
    this.setLastError(error as any);
    this.logger.step(`PATCH ${endpoint} failed`, 'fail');
    throw error;
  }
});

When('I send a PATCH request to {string} with body:', async function (this: CustomWorld, endpoint: string, requestBody: string) {
  this.logger.step(`Sending PATCH request to ${endpoint} with body`);
  try {
    const bodyData = JSON.parse(requestBody);
    const response = await this.client.patch(endpoint, bodyData);
    this.setLastResponse(response);
    this.logger.step(`PATCH ${endpoint} with body completed`, 'pass');
  } catch (error) {
    this.setLastError(error as any);
    this.logger.step(`PATCH ${endpoint} with body failed`, 'fail');
    throw error;
  }
});

When('I send a DELETE request to {string}', async function (this: CustomWorld, endpoint: string) {
  this.logger.step(`Sending DELETE request to ${endpoint}`);
  try {
    const response = await this.client.delete(endpoint);
    this.setLastResponse(response);
    this.logger.step(`DELETE ${endpoint} completed`, 'pass');
  } catch (error) {
    this.setLastError(error as any);
    this.logger.step(`DELETE ${endpoint} failed`, 'fail');
    throw error;
  }
});

// Specific JSONPlaceholder steps
When('I get all posts', async function (this: CustomWorld) {
  this.logger.step('Getting all posts');
  try {
    const response = await this.client.getAllPosts();
    this.setLastResponse(response);
    this.logger.step('Get all posts completed', 'pass');
  } catch (error) {
    this.setLastError(error as any);
    this.logger.step('Get all posts failed', 'fail');
    throw error;
  }
});

When('I get post with id {int}', async function (this: CustomWorld, postId: number) {
  this.logger.step(`Getting post with id ${postId}`);
  try {
    const response = await this.client.getPost(postId);
    this.setLastResponse(response);
    this.setTestData('postId', postId);
    this.logger.step(`Get post ${postId} completed`, 'pass');
  } catch (error) {
    this.setLastError(error as any);
    this.logger.step(`Get post ${postId} failed`, 'fail');
    throw error;
  }
});

When('I create a new post with title {string} and body {string}', async function (this: CustomWorld, title: string, body: string) {
  this.logger.step(`Creating new post: ${title}`);
  try {
    const postData = {
      title,
      body,
      userId: 1
    };
    const response = await this.client.createPost(postData);
    this.setLastResponse(response);
    this.setTestData('createdPost', response.data);
    this.logger.step('Create post completed', 'pass');
  } catch (error) {
    this.setLastError(error as any);
    this.logger.step('Create post failed', 'fail');
    throw error;
  }
});

When('I get all users', async function (this: CustomWorld) {
  this.logger.step('Getting all users');
  try {
    const response = await this.client.getAllUsers();
    this.setLastResponse(response);
    this.logger.step('Get all users completed', 'pass');
  } catch (error) {
    this.setLastError(error as any);
    this.logger.step('Get all users failed', 'fail');
    throw error;
  }
});

When('I get user with id {int}', async function (this: CustomWorld, userId: number) {
  this.logger.step(`Getting user with id ${userId}`);
  try {
    const response = await this.client.getUser(userId);
    this.setLastResponse(response);
    this.setTestData('userId', userId);
    this.logger.step(`Get user ${userId} completed`, 'pass');
  } catch (error) {
    this.setLastError(error as any);
    this.logger.step(`Get user ${userId} failed`, 'fail');
    throw error;
  }
});

When('I get comments for post {int}', async function (this: CustomWorld, postId: number) {
  this.logger.step(`Getting comments for post ${postId}`);
  try {
    const response = await this.client.getPostComments(postId);
    this.setLastResponse(response);
    this.setTestData('postId', postId);
    this.logger.step(`Get comments for post ${postId} completed`, 'pass');
  } catch (error) {
    this.setLastError(error as any);
    this.logger.step(`Get comments for post ${postId} failed`, 'fail');
    throw error;
  }
});

When('I get all comments', async function (this: CustomWorld) {
  this.logger.step('Getting all comments');
  try {
    const response = await this.client.getAllComments();
    this.setLastResponse(response);
    this.logger.step('Get all comments completed', 'pass');
  } catch (error) {
    this.setLastError(error as any);
    this.logger.step('Get all comments failed', 'fail');
    throw error;
  }
});

When('I get all albums', async function (this: CustomWorld) {
  this.logger.step('Getting all albums');
  try {
    const response = await this.client.getAllAlbums();
    this.setLastResponse(response);
    this.logger.step('Get all albums completed', 'pass');
  } catch (error) {
    this.setLastError(error as any);
    this.logger.step('Get all albums failed', 'fail');
    throw error;
  }
});

When('I get all photos', async function (this: CustomWorld) {
  this.logger.step('Getting all photos');
  try {
    const response = await this.client.getAllPhotos();
    this.setLastResponse(response);
    this.logger.step('Get all photos completed', 'pass');
  } catch (error) {
    this.setLastError(error as any);
    this.logger.step('Get all photos failed', 'fail');
    throw error;
  }
});

When('I get all todos', async function (this: CustomWorld) {
  this.logger.step('Getting all todos');
  try {
    const response = await this.client.getAllTodos();
    this.setLastResponse(response);
    this.logger.step('Get all todos completed', 'pass');
  } catch (error) {
    this.setLastError(error as any);
    this.logger.step('Get all todos failed', 'fail');
    throw error;
  }
});

// Performance steps
When('I measure response time for GET {string}', async function (this: CustomWorld, endpoint: string) {
  this.logger.step(`Measuring response time for GET ${endpoint}`);
  this.startTimer('api_request');
  
  try {
    const response = await this.client.get(endpoint);
    const duration = this.endTimer('api_request');
    this.setLastResponse(response);
    this.setTestData('responseTime', duration);
    this.logger.step(`GET ${endpoint} completed in ${duration}ms`, 'pass');
  } catch (error) {
    this.endTimer('api_request');
    this.setLastError(error as any);
    this.logger.step(`GET ${endpoint} failed`, 'fail');
    throw error;
  }
});

// Specific assertion steps
Then('the response should contain {int} posts', async function (this: CustomWorld, expectedCount: number) {
  const response = this.getTestData('lastResponse');
  this.assertArray(response.data, 'Response data should be an array of posts');
  this.assertArrayLength(response.data, expectedCount, `Should contain ${expectedCount} posts`);
});

Then('the post should have title {string}', async function (this: CustomWorld, expectedTitle: string) {
  const response = this.getTestData('lastResponse');
  this.assertEqual(response.data.title, expectedTitle, `Post title should be "${expectedTitle}"`);
});

Then('the post should have userId {int}', async function (this: CustomWorld, expectedUserId: number) {
  const response = this.getTestData('lastResponse');
  this.assertEqual(response.data.userId, expectedUserId, `Post userId should be ${expectedUserId}`);
});

Then('the post should have a valid structure', async function (this: CustomWorld) {
  const response = this.getTestData('lastResponse');
  const post = response.data;
  
  // Check required fields
  this.assertNotNull(post.id, 'Post should have an id');
  this.assertNotNull(post.title, 'Post should have a title');
  this.assertNotNull(post.body, 'Post should have a body');
  this.assertNotNull(post.userId, 'Post should have a userId');
  
  // Check field types
  if (typeof post.id !== 'number') {
    throw new Error('Post id should be a number');
  }
  if (typeof post.title !== 'string') {
    throw new Error('Post title should be a string');
  }
  if (typeof post.body !== 'string') {
    throw new Error('Post body should be a string');
  }
  if (typeof post.userId !== 'number') {
    throw new Error('Post userId should be a number');
  }
  
  this.logger.assertion('Post has valid structure', true, 'valid structure', 'valid structure');
});

Then('the user should have a valid structure', async function (this: CustomWorld) {
  const response = this.getTestData('lastResponse');
  const user = response.data;
  
  // Check required fields
  this.assertNotNull(user.id, 'User should have an id');
  this.assertNotNull(user.name, 'User should have a name');
  this.assertNotNull(user.username, 'User should have a username');
  this.assertNotNull(user.email, 'User should have an email');
  
  // Check email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(user.email)) {
    throw new Error(`Invalid email format: ${user.email}`);
  }
  
  this.logger.assertion('User has valid structure', true, 'valid structure', 'valid structure');
});

Then('each comment should have a valid structure', async function (this: CustomWorld) {
  const response = this.getTestData('lastResponse');
  const comments = response.data;
  
  this.assertArray(comments, 'Response should be an array of comments');
  
  for (const comment of comments) {
    this.assertNotNull(comment.id, 'Comment should have an id');
    this.assertNotNull(comment.name, 'Comment should have a name');
    this.assertNotNull(comment.email, 'Comment should have an email');
    this.assertNotNull(comment.body, 'Comment should have a body');
    this.assertNotNull(comment.postId, 'Comment should have a postId');
    
    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(comment.email)) {
      throw new Error(`Invalid email format in comment ${comment.id}: ${comment.email}`);
    }
  }
  
  this.logger.assertion('All comments have valid structure', true, 'valid structure', 'valid structure');
});

// Performance assertions
Then('the response time should be under {int} milliseconds', async function (this: CustomWorld, maxTime: number) {
  const responseTime = this.getTestData('responseTime');
  this.assertNotNull(responseTime, 'Response time should be measured');
  
  const passed = responseTime < maxTime;
  this.logger.assertion(`Response time should be under ${maxTime}ms`, passed, `< ${maxTime}ms`, `${responseTime}ms`);
  
  if (!passed) {
    throw new Error(`Response time ${responseTime}ms exceeds maximum of ${maxTime}ms`);
  }
});
