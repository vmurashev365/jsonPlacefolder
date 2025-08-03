@smoke @posts @positive
Feature: Posts API - Smoke Tests
  As a user of the JSONPlaceholder API
  I want to verify core posts functionality works
  So that I can trust the API is operational

  Background:
    Given the base URL is "https://jsonplaceholder.typicode.com"

  @smoke @get @posts
  Scenario: Get all posts
    When I send a GET request to "/posts"
    Then the response should have status code 200
    And the response should be JSON
    And the response data should be an array
    And the response data should not be empty
    And the response data should have 100 items

  @smoke @get @posts @single
  Scenario: Get a single post
    When I send a GET request to "/posts/1"
    Then the response should have status code 200
    And the response should be JSON
    And the response data should not be null
    And the post should have a valid structure
    And the post should have userId 1

  @smoke @get @posts @performance
  Scenario: Posts API response time
    When I measure response time for GET "/posts"
    Then the response should have status code 200
    And the response time should be under 2000 milliseconds

  @smoke @post @posts @create
  Scenario: Create a new post
    When I send a POST request to "/posts" with body:
      """
      {
        "title": "Test Post",
        "body": "This is a test post body",
        "userId": 1
      }
      """
    Then the response should have status code 201
    And the response should be JSON
    And the response data should not be null
    And the response data should contain property "id"
    And the response data property "title" should equal "Test Post"
    And the response data property "userId" should equal "1"
