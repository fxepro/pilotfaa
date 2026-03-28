"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  Loader2,
  BookOpen,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { applyTheme } from "@/lib/theme";
import {
  fetchBlogPosts,
  deleteBlogPost,
  type BlogPost,
  type BlogPostListParams,
  type PaginatedResponse,
} from "@/lib/api/blog";

export default function BloggingPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [pagination, setPagination] = useState<{
    count: number;
    next: string | null;
    previous: string | null;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    loadPosts();
  }, [currentPage, statusFilter]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: BlogPostListParams = {
        page: currentPage,
        page_size: 10,
      };

      if (statusFilter !== "all") {
        params.status = statusFilter as "draft" | "published" | "archived";
      }

      if (searchTerm) {
        params.search = searchTerm;
      }

      const response = await fetchBlogPosts(params);
      
      if (Array.isArray(response)) {
        setPosts(response);
        setPagination(null);
      } else {
        setPosts(response.results);
        setPagination({
          count: response.count,
          next: response.next,
          previous: response.previous,
        });
      }
    } catch (err: any) {
      console.error("Error loading posts:", err);
      setError(err.response?.data?.error || "Failed to load blog posts");
      toast({
        title: "Error",
        description: "Failed to load blog posts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      await deleteBlogPost(id);
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
      loadPosts();
    } catch (err: any) {
      console.error("Error deleting post:", err);
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to delete blog post",
        variant: "destructive",
      });
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadPosts();
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      published: "default",
      draft: "secondary",
      archived: "outline",
    };
    return (
      <Badge variant={variants[status] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const stats = {
    total: pagination?.count || posts.length,
    published: posts.filter((p) => p.status === "published").length,
    draft: posts.filter((p) => p.status === "draft").length,
    archived: posts.filter((p) => p.status === "archived").length,
  };

  return (
    <div className={applyTheme.page()}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Blogging
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your blog posts, categories, and tags
          </p>
        </div>
        <Button onClick={() => router.push("/workspace/blogging/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Post
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Posts</CardDescription>
            <CardTitle className="text-2xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Published</CardDescription>
            <CardTitle className="text-2xl text-green-600">{stats.published}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Drafts</CardDescription>
            <CardTitle className="text-2xl text-yellow-600">{stats.draft}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Archived</CardDescription>
            <CardTitle className="text-2xl text-gray-600">{stats.archived}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                onClick={() => {
                  setStatusFilter("all");
                  setCurrentPage(1);
                }}
              >
                All
              </Button>
              <Button
                variant={statusFilter === "published" ? "default" : "outline"}
                onClick={() => {
                  setStatusFilter("published");
                  setCurrentPage(1);
                }}
              >
                Published
              </Button>
              <Button
                variant={statusFilter === "draft" ? "default" : "outline"}
                onClick={() => {
                  setStatusFilter("draft");
                  setCurrentPage(1);
                }}
              >
                Drafts
              </Button>
              <Button
                variant={statusFilter === "archived" ? "default" : "outline"}
                onClick={() => {
                  setStatusFilter("archived");
                  setCurrentPage(1);
                }}
              >
                Archived
              </Button>
            </div>
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      <Card>
        <CardHeader>
          <CardTitle>Blog Posts</CardTitle>
          <CardDescription>
            {loading ? "Loading..." : `${stats.total} post${stats.total !== 1 ? "s" : ""} found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {error && (
            <div className="text-center py-12 text-destructive">{error}</div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No blog posts found.</p>
              <Button
                className="mt-4"
                onClick={() => router.push("/workspace/blogging/new")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Post
              </Button>
            </div>
          )}

          {!loading && !error && posts.length > 0 && (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{post.title}</h3>
                        {post.featured && (
                          <Badge variant="outline" className="text-xs">
                            Featured
                          </Badge>
                        )}
                        {getStatusBadge(post.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {post.excerpt || "No excerpt provided"}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {post.author.full_name || post.author.username}
                        </span>
                        {post.category && (
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            {post.category.name}
                          </span>
                        )}
                        {post.published_at && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(post.published_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        )}
                        <span>{post.views_count} views</span>
                        <span>{post.read_time} min read</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/blog/${post.slug}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/workspace/blogging/${post.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(post.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && (pagination.next || pagination.previous) && (
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                disabled={!pagination.previous}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {Math.ceil(pagination.count / 10)}
              </span>
              <Button
                variant="outline"
                disabled={!pagination.next}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
