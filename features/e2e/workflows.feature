@e2e @workflow @positive
Feature: End-to-End User Workflows
  As a user of the JSONPlaceholder API
  I want to perform realistic workflows
  So that I can complete common tasks effectively

  Background:
    Given the base URL is "https://jsonplaceholder.typicode.com"

  @e2e @posts @users @workflow
  Scenario: Complete post management workflow
    # Get user information
    When I get user with id 1
    Then the response should have status code 200
    And the user should have a valid structure
    
    # Get user's posts
    When I send a GET request to "/users/1/posts"
    Then the response should have status code 200
    And the response data should be an array
    And the response data should not be empty
    
    # Create a new post for the user
    When I create a new post with title "My Workflow Post" and body "This post was created during an E2E test"
    Then the response should have status code 201
    And the post should have title "My Workflow Post"
    
    # Update the created post
    When I send a PATCH request to "/posts/101" with body:
      """
      {
        "title": "Updated Workflow Post"
      }
      """
    Then the response should have status code 200
    And the post should have title "Updated Workflow Post"

  @e2e @posts @comments @workflow
  Scenario: Post and comments interaction workflow
    # Get a specific post
    When I get post with id 1
    Then the response should have status code 200
    And the post should have a valid structure
    
    # Get comments for the post
    When I get comments for post 1
    Then the response should have status code 200
    And the response data should be an array
    And each comment should have a valid structure
    
    # Create a new comment for the post
    When I send a POST request to "/comments" with body:
      """
      {
        "name": "E2E Test Comment",
        "email": "e2e@test.com",
        "body": "This comment was created during E2E testing",
        "postId": 1
      }
      """
    Then the response should have status code 201
    And the response data property "name" should equal "E2E Test Comment"
    And the response data property "postId" should equal "1"

  @e2e @users @albums @photos @workflow
  Scenario: User content exploration workflow
    # Get user information
    When I get user with id 1
    Then the response should have status code 200
    And the user should have a valid structure
    
    # Get user's albums
    When I send a GET request to "/users/1/albums"
    Then the response should have status code 200
    And the response data should be an array
    And the response data should not be empty
    
    # Get photos from the first album
    When I send a GET request to "/albums/1/photos"
    Then the response should have status code 200
    And the response data should be an array
    And the response data should not be empty
    
    # Verify photo structure
    And the response data should contain property "0"
    And I set test data "firstPhoto" to the first item in the response
    And the test data "firstPhoto" should contain property "id"
    And the test data "firstPhoto" should contain property "title"
    And the test data "firstPhoto" should contain property "url"
    And the test data "firstPhoto" should contain property "thumbnailUrl"

  @e2e @users @todos @workflow
  Scenario: User productivity workflow
    # Get user information
    When I get user with id 1
    Then the response should have status code 200
    And the user should have a valid structure
    
    # Get user's todos
    When I send a GET request to "/users/1/todos"
    Then the response should have status code 200
    And the response data should be an array
    And the response data should not be empty
    
    # Create a new todo
    When I send a POST request to "/todos" with body:
      """
      {
        "title": "E2E Test Todo",
        "completed": false,
        "userId": 1
      }
      """
    Then the response should have status code 201
    And the response data property "title" should equal "E2E Test Todo"
    And the response data property "completed" should equal "false"
    And the response data property "userId" should equal "1"
    
    # Mark todo as completed
    When I send a PATCH request to "/todos/201" with body:
      """
      {
        "completed": true
      }
      """
    Then the response should have status code 200
    And the response data property "completed" should equal "true"

  @e2e @data @integrity @workflow
  Scenario: Data integrity verification workflow
    # Verify consistent user data across endpoints
    When I get user with id 2
    Then the response should have status code 200
    And the user should have a valid structure
    And I set test data "userId" to "2"
    
    # Verify user's posts reference correct userId
    When I send a GET request to "/users/2/posts"
    Then the response should have status code 200
    And the response data should be an array
    And each post should reference userId 2
    
    # Verify user's albums reference correct userId
    When I send a GET request to "/users/2/albums"
    Then the response should have status code 200
    And the response data should be an array
    And each album should reference userId 2
    
    # Verify user's todos reference correct userId
    When I send a GET request to "/users/2/todos"
    Then the response should have status code 200
    And the response data should be an array
    And each todo should reference userId 2
