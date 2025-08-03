@performance @load @stress
Feature: Performance and Load Testing
  As a developer using the JSONPlaceholder API
  I want to verify the API performs well under load
  So that I can ensure good user experience

  Background:
    Given the base URL is "https://jsonplaceholder.typicode.com"

  @performance @response-time @posts
  Scenario: Posts endpoint response time
    When I measure response time for GET "/posts"
    Then the response should have status code 200
    And the response time should be under 3000 milliseconds

  @performance @response-time @users
  Scenario: Users endpoint response time
    When I measure response time for GET "/users"
    Then the response should have status code 200
    And the response time should be under 2000 milliseconds

  @performance @response-time @comments
  Scenario: Comments endpoint response time
    When I measure response time for GET "/comments"
    Then the response should have status code 200
    And the response time should be under 5000 milliseconds

  @performance @response-time @single-resource
  Scenario Outline: Single resource response time
    When I measure response time for GET "<endpoint>"
    Then the response should have status code 200
    And the response time should be under <maxTime> milliseconds

    Examples:
      | endpoint    | maxTime |
      | /posts/1    | 1000    |
      | /users/1    | 1000    |
      | /comments/1 | 1000    |
      | /albums/1   | 1000    |
      | /photos/1   | 1000    |
      | /todos/1    | 1000    |

  @performance @concurrent @posts
  Scenario: Concurrent requests to posts endpoint
    # This would need special step definitions for concurrent testing
    When I send 5 concurrent GET requests to "/posts"
    Then all responses should have status code 200
    And the average response time should be under 3000 milliseconds

  @performance @large-dataset @comments
  Scenario: Large dataset handling
    When I measure response time for GET "/comments"
    Then the response should have status code 200
    And the response data should have 500 items
    And the response time should be under 5000 milliseconds
    And the response size should be reasonable

  @performance @pagination @simulation
  Scenario: Pagination performance simulation
    # Simulate pagination by getting posts in chunks
    When I measure response time for GET "/posts?_start=0&_limit=10"
    Then the response should have status code 200
    And the response time should be under 1000 milliseconds
    
    When I measure response time for GET "/posts?_start=10&_limit=10"
    Then the response should have status code 200
    And the response time should be under 1000 milliseconds

  @performance @stress @posts @create
  Scenario: Stress testing post creation
    # Create multiple posts rapidly
    When I send a POST request to "/posts" with body:
      """
      {
        "title": "Stress Test Post 1",
        "body": "Testing API under stress",
        "userId": 1
      }
      """
    Then the response should have status code 201
    And the response time should be under 2000 milliseconds
    
    When I send a POST request to "/posts" with body:
      """
      {
        "title": "Stress Test Post 2",
        "body": "Testing API under stress",
        "userId": 1
      }
      """
    Then the response should have status code 201
    And the response time should be under 2000 milliseconds

  @performance @memory @large-response
  Scenario: Memory handling with large responses
    When I get all comments
    Then the response should have status code 200
    And the response data should be an array
    And the response data should have 500 items
    And no memory leaks should occur

  @performance @timeout @resilience
  Scenario: API resilience under timeout conditions
    # This would test how the API behaves under slow network conditions
    Given I set the request timeout to 1000 milliseconds
    When I send a GET request to "/posts"
    Then the response should complete within the timeout or a timeout error should be handled gracefully
