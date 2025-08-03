import { BaseClient } from './BaseClient';
import { Post, User, Comment, Album, Photo, Todo } from '../types/api';

export class JsonPlaceholderClient extends BaseClient {
  constructor(baseURL: string = 'https://jsonplaceholder.typicode.com', timeout: number = 30000) {
    super(baseURL, timeout);
  }

  // Posts endpoints
  async getAllPosts() {
    return this.get<Post[]>('/posts');
  }

  async getPost(id: number) {
    return this.get<Post>(`/posts/${id}`);
  }

  async createPost(post: Partial<Post>) {
    return this.post<Post>('/posts', post);
  }

  async updatePost(id: number, post: Partial<Post>) {
    return this.put<Post>(`/posts/${id}`, post);
  }

  async patchPost(id: number, post: Partial<Post>) {
    return this.patch<Post>(`/posts/${id}`, post);
  }

  async deletePost(id: number) {
    return this.delete(`/posts/${id}`);
  }

  async getPostComments(postId: number) {
    return this.get<Comment[]>(`/posts/${postId}/comments`);
  }

  // Users endpoints
  async getAllUsers() {
    return this.get<User[]>('/users');
  }

  async getUser(id: number) {
    return this.get<User>(`/users/${id}`);
  }

  async createUser(user: Partial<User>) {
    return this.post<User>('/users', user);
  }

  async updateUser(id: number, user: Partial<User>) {
    return this.put<User>(`/users/${id}`, user);
  }

  async patchUser(id: number, user: Partial<User>) {
    return this.patch<User>(`/users/${id}`, user);
  }

  async deleteUser(id: number) {
    return this.delete(`/users/${id}`);
  }

  async getUserPosts(userId: number) {
    return this.get<Post[]>(`/users/${userId}/posts`);
  }

  async getUserAlbums(userId: number) {
    return this.get<Album[]>(`/users/${userId}/albums`);
  }

  async getUserTodos(userId: number) {
    return this.get<Todo[]>(`/users/${userId}/todos`);
  }

  // Comments endpoints
  async getAllComments() {
    return this.get<Comment[]>('/comments');
  }

  async getComment(id: number) {
    return this.get<Comment>(`/comments/${id}`);
  }

  async createComment(comment: Partial<Comment>) {
    return this.post<Comment>('/comments', comment);
  }

  async updateComment(id: number, comment: Partial<Comment>) {
    return this.put<Comment>(`/comments/${id}`, comment);
  }

  async patchComment(id: number, comment: Partial<Comment>) {
    return this.patch<Comment>(`/comments/${id}`, comment);
  }

  async deleteComment(id: number) {
    return this.delete(`/comments/${id}`);
  }

  // Albums endpoints
  async getAllAlbums() {
    return this.get<Album[]>('/albums');
  }

  async getAlbum(id: number) {
    return this.get<Album>(`/albums/${id}`);
  }

  async createAlbum(album: Partial<Album>) {
    return this.post<Album>('/albums', album);
  }

  async updateAlbum(id: number, album: Partial<Album>) {
    return this.put<Album>(`/albums/${id}`, album);
  }

  async patchAlbum(id: number, album: Partial<Album>) {
    return this.patch<Album>(`/albums/${id}`, album);
  }

  async deleteAlbum(id: number) {
    return this.delete(`/albums/${id}`);
  }

  async getAlbumPhotos(albumId: number) {
    return this.get<Photo[]>(`/albums/${albumId}/photos`);
  }

  // Photos endpoints
  async getAllPhotos() {
    return this.get<Photo[]>('/photos');
  }

  async getPhoto(id: number) {
    return this.get<Photo>(`/photos/${id}`);
  }

  async createPhoto(photo: Partial<Photo>) {
    return this.post<Photo>('/photos', photo);
  }

  async updatePhoto(id: number, photo: Partial<Photo>) {
    return this.put<Photo>(`/photos/${id}`, photo);
  }

  async patchPhoto(id: number, photo: Partial<Photo>) {
    return this.patch<Photo>(`/photos/${id}`, photo);
  }

  async deletePhoto(id: number) {
    return this.delete(`/photos/${id}`);
  }

  // Todos endpoints
  async getAllTodos() {
    return this.get<Todo[]>('/todos');
  }

  async getTodo(id: number) {
    return this.get<Todo>(`/todos/${id}`);
  }

  async createTodo(todo: Partial<Todo>) {
    return this.post<Todo>('/todos', todo);
  }

  async updateTodo(id: number, todo: Partial<Todo>) {
    return this.put<Todo>(`/todos/${id}`, todo);
  }

  async patchTodo(id: number, todo: Partial<Todo>) {
    return this.patch<Todo>(`/todos/${id}`, todo);
  }

  async deleteTodo(id: number) {
    return this.delete(`/todos/${id}`);
  }

  // Query parameters support
  async getPostsWithQuery(params: Record<string, any>) {
    const queryString = new URLSearchParams(params).toString();
    return this.get<Post[]>(`/posts?${queryString}`);
  }

  async getCommentsWithQuery(params: Record<string, any>) {
    const queryString = new URLSearchParams(params).toString();
    return this.get<Comment[]>(`/comments?${queryString}`);
  }

  async getUsersWithQuery(params: Record<string, any>) {
    const queryString = new URLSearchParams(params).toString();
    return this.get<User[]>(`/users?${queryString}`);
  }

  // Health check
  async healthCheck() {
    try {
      const response = await this.get<Post>('/posts/1');
      return {
        status: 'healthy',
        responseTime: Date.now(),
        data: response.data
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        responseTime: Date.now(),
        error
      };
    }
  }
}
