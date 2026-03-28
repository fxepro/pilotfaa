/**
 * Blog API Client
 * Functions for interacting with the blog API endpoints
 */

import axiosInstance from '../axios-config';

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  featured_image?: string;
  author: {
    id: number;
    username: string;
    email: string;
    full_name: string;
    avatar_url?: string;
  };
  category?: {
    id: number;
    name: string;
    slug: string;
    icon?: string;
  };
  tags: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  views_count: number;
  read_time: number;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_image?: string;
  language: string;
  translations?: Record<string, any>;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  order: number;
  post_count?: number;
  created_at: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  post_count?: number;
  created_at: string;
}

export interface BlogPostListParams {
  page?: number;
  page_size?: number;
  status?: 'draft' | 'published' | 'archived';
  category?: string;
  tag?: string;
  search?: string;
  language?: string;
  ordering?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * Fetch blog posts with optional filters
 */
export async function fetchBlogPosts(params?: BlogPostListParams): Promise<PaginatedResponse<BlogPost> | BlogPost[]> {
  const response = await axiosInstance.get('/api/blog/posts/', { params });
  return response.data;
}

/**
 * Fetch a single blog post by ID
 */
export async function fetchBlogPost(id: number): Promise<BlogPost> {
  const response = await axiosInstance.get(`/api/blog/posts/${id}/`);
  return response.data;
}

/**
 * Fetch a single blog post by slug
 */
export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost> {
  const response = await axiosInstance.get(`/api/blog/posts/slug/${slug}/`);
  return response.data;
}

/**
 * Create a new blog post
 */
export async function createBlogPost(data: Partial<BlogPost>): Promise<BlogPost> {
  const response = await axiosInstance.post('/api/blog/posts/create/', data);
  return response.data;
}

/**
 * Update a blog post
 */
export async function updateBlogPost(id: number, data: Partial<BlogPost>): Promise<BlogPost> {
  const response = await axiosInstance.put(`/api/blog/posts/${id}/update/`, data);
  return response.data;
}

/**
 * Delete a blog post
 */
export async function deleteBlogPost(id: number): Promise<void> {
  await axiosInstance.delete(`/api/blog/posts/${id}/delete/`);
}

/**
 * Fetch featured blog posts
 */
export async function fetchFeaturedPosts(): Promise<BlogPost[]> {
  const response = await axiosInstance.get('/api/blog/posts/featured/');
  return response.data;
}

/**
 * Fetch recent blog posts
 */
export async function fetchRecentPosts(limit: number = 5): Promise<BlogPost[]> {
  const response = await axiosInstance.get('/api/blog/posts/recent/', { params: { limit } });
  return response.data;
}

/**
 * Increment view count for a blog post
 */
export async function incrementViewCount(id: number): Promise<{ success: boolean; views_count: number }> {
  const response = await axiosInstance.post(`/api/blog/posts/${id}/view/`);
  return response.data;
}

/**
 * Fetch all categories
 */
export async function fetchCategories(): Promise<Category[]> {
  const response = await axiosInstance.get('/api/blog/categories/');
  return response.data;
}

/**
 * Create a new category
 */
export async function createCategory(data: Partial<Category>): Promise<Category> {
  const response = await axiosInstance.post('/api/blog/categories/create/', data);
  return response.data;
}

/**
 * Fetch all tags
 */
export async function fetchTags(): Promise<Tag[]> {
  const response = await axiosInstance.get('/api/blog/tags/');
  return response.data;
}

/**
 * Create a new tag
 */
export async function createTag(data: Partial<Tag>): Promise<Tag> {
  const response = await axiosInstance.post('/api/blog/tags/create/', data);
  return response.data;
}
