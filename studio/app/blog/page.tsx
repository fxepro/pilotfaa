"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SimpleHeroSection } from "@/components/simple-hero-section";
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowRight, 
  TrendingUp, 
  Zap, 
  Shield, 
  Globe,
  FileText,
  BarChart3,
  BookOpen,
  Loader2
} from "lucide-react";
import {
  fetchFeaturedPosts,
  fetchRecentPosts,
  fetchCategories,
  fetchTags,
  type BlogPost,
  type Category,
  type Tag,
} from "@/lib/api/blog";

export default function BlogPage() {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBlogData();
  }, []);

  const loadBlogData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [featured, recent, cats, tagList] = await Promise.all([
        fetchFeaturedPosts(),
        fetchRecentPosts(10),
        fetchCategories(),
        fetchTags(),
      ]);

      console.log("Blog data loaded:", { featured, recent, cats, tagList });

      setFeaturedPosts(featured || []);
      setRecentPosts(recent || []);
      setCategories(cats || []);
      setTags(tagList || []);
    } catch (err: any) {
      console.error("Error loading blog data:", err);
      console.error("Error details:", err.response?.data);
      setError(err.response?.data?.error || err.message || "Failed to load blog posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No date";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryIcon = (categoryName?: string) => {
    const iconMap: Record<string, any> = {
      "Performance": TrendingUp,
      "Optimization": Zap,
      "SEO": BarChart3,
      "Tools": Shield,
      "Development": Globe,
    };
    return iconMap[categoryName || ""] || FileText;
  };

  // Get most popular tags (top 8)
  const popularTags = tags
    .sort((a, b) => (b.post_count || 0) - (a.post_count || 0))
    .slice(0, 8);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <SimpleHeroSection
          title="Admin Rodeo Blog"
          subtitle="Expert insights on platform development, best practices, and implementation strategies."
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-palette-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <SimpleHeroSection
          title="Admin Rodeo Blog"
          subtitle="Expert insights on platform development, best practices, and implementation strategies."
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadBlogData}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <SimpleHeroSection
        title="Admin Rodeo Blog"
        subtitle="Expert insights on platform development, best practices, and implementation strategies."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Posts */}
            {featuredPosts.length > 0 ? (
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center">
                  <FileText className="h-8 w-8 mr-3 text-palette-primary" />
                  Featured Articles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredPosts.map((post) => (
                    <Card key={post.id} className="group hover:shadow-lg transition-all duration-300">
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          {post.category && (
                            <Badge variant="outline" className="text-palette-primary border-palette-accent-2">
                              {post.category.name}
                            </Badge>
                          )}
                          <Badge variant="secondary" className="bg-palette-accent-3 text-palette-primary">
                            Featured
                          </Badge>
                        </div>
                        <CardTitle className="group-hover:text-palette-primary transition-colors">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="text-slate-600">
                          {post.excerpt || "No excerpt available"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {post.author.full_name || post.author.username}
                            </div>
                            {post.published_at && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDate(post.published_at)}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {post.read_time} min read
                            </div>
                          </div>
                        </div>
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag.id} variant="outline" className="text-xs">
                                {tag.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <Link href={`/blog/${post.slug}`}>
                          <Button variant="outline" className="group-hover:bg-palette-primary group-hover:text-white group-hover:border-palette-primary transition-all">
                            Read More
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            ) : null}

            {/* Recent Posts */}
            <section>
              <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center">
                <TrendingUp className="h-8 w-8 mr-3 text-palette-primary" />
                Latest Articles
              </h2>
              {recentPosts.length === 0 && featuredPosts.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No blog posts available yet.</p>
                  <p className="text-sm mb-4">Create your first blog post in the workspace to get started.</p>
                  <Link href="/workspace/blogging">
                    <Button>Go to Blog Management</Button>
                  </Link>
                </div>
              ) : recentPosts.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <p>No recent posts available.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {recentPosts.map((post) => (
                    <Card key={post.id} className="group hover:shadow-lg transition-all duration-300">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-2/3 p-6">
                          <div className="flex items-center gap-2 mb-2">
                            {post.category && (
                              <Badge variant="outline" className="text-palette-primary border-palette-accent-2">
                                {post.category.name}
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="group-hover:text-palette-primary transition-colors mb-2">
                            {post.title}
                          </CardTitle>
                          <CardDescription className="text-slate-600 mb-4">
                            {post.excerpt || "No excerpt available"}
                          </CardDescription>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {post.author.full_name || post.author.username}
                              </div>
                              {post.published_at && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {formatDate(post.published_at)}
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {post.read_time} min read
                              </div>
                            </div>
                            <Link href={`/blog/${post.slug}`}>
                              <Button variant="outline" size="sm" className="group-hover:bg-palette-primary group-hover:text-white group-hover:border-palette-primary transition-all">
                                Read More
                                <ArrowRight className="h-4 w-4 ml-2" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                        <div className="md:w-1/3 p-6 flex items-center justify-center bg-slate-50">
                          {post.featured_image ? (
                            <img
                              src={post.featured_image}
                              alt={post.title}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-32 bg-gradient-to-br from-palette-accent-3 to-palette-accent-3 rounded-lg flex items-center justify-center">
                              <FileText className="h-12 w-12 text-palette-accent-2" />
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Categories */}
              {categories.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Categories</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {categories.map((category) => {
                      const Icon = getCategoryIcon(category.name);
                      return (
                        <Link
                          key={category.id}
                          href={`/blog/category/${category.slug}`}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-palette-primary" />
                            <span className="text-sm group-hover:text-palette-primary transition-colors">
                              {category.name}
                            </span>
                          </div>
                          {category.post_count !== undefined && category.post_count > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {category.post_count}
                            </Badge>
                          )}
                        </Link>
                      );
                    })}
                  </CardContent>
                </Card>
              )}

              {/* Newsletter Signup */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Stay Updated</CardTitle>
                  <CardDescription>
                    Get the latest platform insights and tips delivered to your inbox.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-primary"
                    />
                    <Button className="w-full bg-palette-primary hover:bg-palette-primary-hover">
                      Subscribe
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Popular Tags */}
              {popularTags.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Popular Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {popularTags.map((tag) => (
                        <Link
                          key={tag.id}
                          href={`/blog/tag/${tag.slug}`}
                        >
                          <Badge
                            variant="outline"
                            className="text-xs hover:bg-palette-accent-3 hover:border-palette-accent-2 cursor-pointer"
                          >
                            {tag.name}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
