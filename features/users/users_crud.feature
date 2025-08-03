@users @crud @positive
Feature: Users API - CRUD Operations
  As a developer using the JSONPlaceholder API
  I want to perform CRUD operations on users
  So that I can manage user data effectively

  Background:
    Given the base URL is "https://jsonplaceholder.typicode.com"

  @users @get @all
  Scenario: Get all users
    When I get all users
    Then the response should have status code 200
    And the response should be JSON
    And the response data should be an array
    And the response data should have 10 items

  @users @get @single
  Scenario Outline: Get users by ID
    When I get user with id <userId>
    Then the response should have status code 200
    And the response should be JSON
    And the user should have a valid structure

    Examples:
      | userId |
      | 1      |
      | 5      |
      | 10     |

  @users @post @create
  Scenario: Create a new user
    When I send a POST request to "/users" with body:
      """
      {
        "name": "John Doe",
        "username": "johndoe",
        "email": "john.doe@example.com",
        "phone": "123-456-7890",
        "website": "johndoe.com"
      }
      """
    Then the response should have status code 201
    And the response should be JSON
    And the response data should contain property "id"
    And the response data property "name" should equal "John Doe"
    And the response data property "email" should equal "john.doe@example.com"

  @users @put @update
  Scenario: Update a user completely
    When I send a PUT request to "/users/1" with body:
      """
      {
        "id": 1,
        "name": "Updated User",
        "username": "updateduser",
        "email": "updated@example.com",
        "phone": "987-654-3210",
        "website": "updated.com"
      }
      """
    Then the response should have status code 200
    And the response should be JSON
    And the response data property "name" should equal "Updated User"
    And the response data property "email" should equal "updated@example.com"

  @users @patch @update
  Scenario: Update a user partially
    When I send a PATCH request to "/users/1" with body:
      """
      {
        "name": "Partially Updated User"
      }
      """
    Then the response should have status code 200
    And the response should be JSON
    And the response data property "name" should equal "Partially Updated User"

  @users @delete
  Scenario: Delete a user
    When I send a DELETE request to "/users/1"
    Then the response should have status code 200

  @users @get @posts
  Scenario: Get posts for a user
    When I send a GET request to "/users/1/posts"
    Then the response should have status code 200
    And the response should be JSON
    And the response data should be an array
    And the response data should not be empty

  @users @get @albums
  Scenario: Get albums for a user
    When I send a GET request to "/users/1/albums"
    Then the response should have status code 200
    And the response should be JSON
    And the response data should be an array
    And the response data should not be empty

  @users @get @todos
  Scenario: Get todos for a user
    When I send a GET request to "/users/1/todos"
    Then the response should have status code 200
    And the response should be JSON
    And the response data should be an array
    And the response data should not be empty
