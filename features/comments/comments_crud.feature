@comments @crud @positive
Feature: Comments API - CRUD Operations
  As a developer using the JSONPlaceholder API
  I want to perform CRUD operations on comments
  So that I can manage comment data effectively

  Background:
    Given the base URL is "https://jsonplaceholder.typicode.com"

  @comments @get @all
  Scenario: Get all comments
    When I get all comments
    Then the response should have status code 200
    And the response should be JSON
    And the response data should be an array
    And the response data should have 500 items

  @comments @get @single
  Scenario: Get a single comment
    When I send a GET request to "/comments/1"
    Then the response should have status code 200
    And the response should be JSON
    And the response data should not be null
    And the response data should contain property "id"
    And the response data should contain property "name"
    And the response data should contain property "email"
    And the response data should contain property "body"
    And the response data should contain property "postId"

  @comments @post @create
  Scenario: Create a new comment
    When I send a POST request to "/comments" with body:
      """
      {
        "name": "Test Comment",
        "email": "test@example.com",
        "body": "This is a test comment",
        "postId": 1
      }
      """
    Then the response should have status code 201
    And the response should be JSON
    And the response data should contain property "id"
    And the response data property "name" should equal "Test Comment"
    And the response data property "email" should equal "test@example.com"

  @comments @put @update
  Scenario: Update a comment completely
    When I send a PUT request to "/comments/1" with body:
      """
      {
        "id": 1,
        "name": "Updated Comment",
        "email": "updated@example.com",
        "body": "This is an updated comment",
        "postId": 1
      }
      """
    Then the response should have status code 200
    And the response should be JSON
    And the response data property "name" should equal "Updated Comment"
    And the response data property "email" should equal "updated@example.com"

  @comments @patch @update
  Scenario: Update a comment partially
    When I send a PATCH request to "/comments/1" with body:
      """
      {
        "body": "This comment has been updated"
      }
      """
    Then the response should have status code 200
    And the response should be JSON
    And the response data property "body" should equal "This comment has been updated"

  @comments @delete
  Scenario: Delete a comment
    When I send a DELETE request to "/comments/1"
    Then the response should have status code 200

  @comments @get @filter
  Scenario: Get comments by post ID
    When I send a GET request to "/posts/1/comments"
    Then the response should have status code 200
    And the response should be JSON
    And the response data should be an array
    And each comment should have a valid structure

  @comments @get @query
  Scenario: Get comments with query parameters
    When I send a GET request to "/comments?postId=1"
    Then the response should have status code 200
    And the response should be JSON
    And the response data should be an array
    And the response data should not be empty
