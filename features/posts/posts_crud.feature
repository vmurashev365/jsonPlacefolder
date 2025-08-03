@posts @crud @positive
Feature: Posts API - CRUD Operations
  As a developer using the JSONPlaceholder API
  I want to perform CRUD operations on posts
  So that I can manage post data effectively

  Background:
    Given the base URL is "https://jsonplaceholder.typicode.com"

  @posts @get @all
  Scenario: Get all posts
    When I get all posts
    Then the response should have status code 200
    And the response should be JSON
    And the response data should be an array
    And the response should contain 100 posts

  @posts @get @single
  Scenario Outline: Get posts by ID
    When I get post with id <postId>
    Then the response should have status code 200
    And the response should be JSON
    And the post should have a valid structure
    And the post should have userId <userId>

    Examples:
      | postId | userId |
      | 1      | 1      |
      | 2      | 1      |
      | 11     | 2      |
      | 21     | 3      |

  @posts @post @create
  Scenario: Create a new post
    When I create a new post with title "My New Post" and body "This is the content of my new post"
    Then the response should have status code 201
    And the response should be JSON
    And the post should have title "My New Post"
    And the post should have userId 1
    And the response data should contain property "id"

  @posts @put @update
  Scenario: Update a post completely
    When I send a PUT request to "/posts/1" with body:
      """
      {
        "id": 1,
        "title": "Updated Post Title",
        "body": "This is the updated content",
        "userId": 1
      }
      """
    Then the response should have status code 200
    And the response should be JSON
    And the post should have title "Updated Post Title"
    And the response data property "body" should equal "This is the updated content"

  @posts @patch @update
  Scenario: Update a post partially
    When I send a PATCH request to "/posts/1" with body:
      """
      {
        "title": "Partially Updated Title"
      }
      """
    Then the response should have status code 200
    And the response should be JSON
    And the post should have title "Partially Updated Title"

  @posts @delete
  Scenario: Delete a post
    When I send a DELETE request to "/posts/1"
    Then the response should have status code 200

  @posts @get @comments
  Scenario: Get comments for a post
    When I get comments for post 1
    Then the response should have status code 200
    And the response should be JSON
    And the response data should be an array
    And each comment should have a valid structure
