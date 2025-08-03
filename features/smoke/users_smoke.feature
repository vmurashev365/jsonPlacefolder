@smoke @users @positive
Feature: Users API - Smoke Tests
  As a user of the JSONPlaceholder API
  I want to verify core users functionality works
  So that I can trust the API is operational

  Background:
    Given the base URL is "https://jsonplaceholder.typicode.com"

  @smoke @get @users
  Scenario: Get all users
    When I send a GET request to "/users"
    Then the response should have status code 200
    And the response should be JSON
    And the response data should be an array
    And the response data should not be empty
    And the response data should have 10 items

  @smoke @get @users @single
  Scenario: Get a single user
    When I send a GET request to "/users/1"
    Then the response should have status code 200
    And the response should be JSON
    And the response data should not be null
    And the user should have a valid structure

  @smoke @get @users @performance
  Scenario: Users API response time
    When I measure response time for GET "/users"
    Then the response should have status code 200
    And the response time should be under 2000 milliseconds
