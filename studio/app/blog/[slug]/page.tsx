"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, User, Share2, Loader2, BookOpen } from "lucide-react";
import { fetchBlogPostBySlug, incrementViewCount, fetchRecentPosts, type BlogPost } from "@/lib/api/blog";

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      loadPost();
    }
  }, [slug]);

  const loadPost = async () => {
    try {
      setLoading(true);
      setError(null);

      const postData = await fetchBlogPostBySlug(slug);
      setPost(postData);

      // Increment view count
      try {
        await incrementViewCount(postData.id);
      } catch (err) {
        // Ignore view count errors
        console.warn("Failed to increment view count:", err);
      }

      // Load related posts (recent posts from same category if available)
      try {
        const related = await fetchRecentPosts(3);
        // Filter to exclude current post
        const filtered = related.filter((p) => p.id !== postData.id);
        setRelatedPosts(filtered.slice(0, 3));
      } catch (err) {
        console.warn("Failed to load related posts:", err);
      }
    } catch (err: any) {
      console.error("Error loading blog post:", err);
      if (err.response?.status === 404) {
        setError("Blog post not found");
      } else {
        setError(err.response?.data?.error || "Failed to load blog post. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No date";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt || post.title,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or error occurred
        console.log("Share cancelled or failed");
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-palette-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-slate-400" />
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Post Not Found</h1>
            <p className="text-slate-600 mb-6">{error || "The blog post you're looking for doesn't exist."}</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => router.push("/blog")} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Button>
              <Button onClick={loadPost}>Try Again</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link href="/blog">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </Link>

        {/* Article Header */}
        <article>
          <header className="mb-8">
            {/* Category and Tags */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {post.category && (
                <Link href={`/blog/category/${post.category.slug}`}>
                  <Badge variant="outline" className="text-palette-primary border-palette-accent-2 hover:bg-palette-accent-3 cursor-pointer">
                    {post.category.name}
                  </Badge>
                </Link>
              )}
              {post.featured && (
                <Badge variant="secondary" className="bg-palette-accent-3 text-palette-primary">
                  Featured
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-slate-600 mb-6 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex items-center gap-6 text-slate-600 mb-6 flex-wrap">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span className="font-medium">{post.author.full_name || post.author.username}</span>
              </div>
              {post.published_at && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{post.read_time} min read</span>
              </div>
              <div className="flex items-center gap-2">
                <span>{post.views_count} views</span>
              </div>
            </div>

            {/* Featured Image */}
            {post.featured_image && (
              <div className="mb-8 rounded-lg overflow-hidden">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            {/* Share Button */}
            <div className="flex justify-end mb-8">
              <Button onClick={handleShare} variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </header>

          {/* Article Content */}
          <div className="mb-12">
            <div
              className="blog-content text-slate-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: (post.content ?? "") as string }}
              style={{
                fontSize: "1.125rem",
                lineHeight: "1.8",
              }}
            />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-12 pb-8 border-b border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link key={tag.id} href={`/blog/tag/${tag.slug}`}>
                    <Badge
                      variant="outline"
                      className="text-xs hover:bg-palette-accent-3 hover:border-palette-accent-2 cursor-pointer"
                    >
                      {tag.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Author Bio */}
          {post.author && (
            <Card className="mb-12">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {post.author.avatar_url && (
                    <img
                      src={post.author.avatar_url}
                      alt={post.author.full_name || post.author.username}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">
                      {post.author.full_name || post.author.username}
                    </h3>
                    {post.author.email && (
                      <p className="text-sm text-slate-600 mb-2">{post.author.email}</p>
                    )}
                    <p className="text-slate-600">
                      Author of this blog post. Follow for more insights and updates.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                      <CardContent className="p-4">
                        {relatedPost.featured_image && (
                          <div className="mb-4 rounded-lg overflow-hidden">
                            <img
                              src={relatedPost.featured_image}
                              alt={relatedPost.title}
                              className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <h3 className="font-semibold text-slate-800 mb-2 group-hover:text-palette-primary transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        {relatedPost.excerpt && (
                          <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                            {relatedPost.excerpt}
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          {relatedPost.published_at && (
                            <span>{formatDate(relatedPost.published_at)}</span>
                          )}
                          <span>•</span>
                          <span>{relatedPost.read_time} min read</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Back to Blog */}
        <div className="text-center pt-8 border-t border-slate-200">
          <Link href="/blog">
            <Button variant="outline" size="lg">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to All Posts
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
