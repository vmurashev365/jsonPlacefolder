@posts @validation @negative
Feature: Posts API - Validation Tests
  As a developer using the JSONPlaceholder API
  I want to test edge cases and validation
  So that I can handle errors properly

  Background:
    Given the base URL is "https://jsonplaceholder.typicode.com"

  @posts @get @notfound @negative
  Scenario: Get non-existent post
    When I send a GET request to "/posts/999999"
    Then the response should have status code 404

  @posts @get @invalid @negative
  Scenario Outline: Get post with invalid ID
    When I send a GET request to "/posts/<invalidId>"
    Then the response should have status code 404

    Examples:
      | invalidId |
      | 0         |
      | -1        |
      | abc       |
      | null      |

  @posts @post @validation @negative
  Scenario: Create post with empty data
    When I send a POST request to "/posts" with body:
      """
      {}
      """
    Then the response should have status code 201
    And the response should be JSON
    And the response data should contain property "id"

  @posts @post @validation @negative
  Scenario: Create post with invalid userId
    When I send a POST request to "/posts" with body:
      """
      {
        "title": "Test Post",
        "body": "Test Body",
        "userId": "invalid"
      }
      """
    Then the response should have status code 201
    And the response should be JSON

  @posts @post @validation @negative
  Scenario: Create post with missing required fields
    When I send a POST request to "/posts" with body:
      """
      {
        "title": "Test Post"
      }
      """
    Then the response should have status code 201
    And the response should be JSON

  @posts @put @validation @negative
  Scenario: Update non-existent post
    When I send a PUT request to "/posts/999999" with body:
      """
      {
        "id": 999999,
        "title": "Non-existent Post",
        "body": "This post doesn't exist",
        "userId": 1
      }
      """
    Then the response should have status code 500

  @posts @delete @validation @negative
  Scenario: Delete non-existent post
    When I send a DELETE request to "/posts/999999"
    Then the response should have status code 200

  @posts @get @malformed @negative
  Scenario: Request with malformed endpoint
    When I send a GET request to "/posts/"
    Then the response should have status code 200
    And the response data should be an array
