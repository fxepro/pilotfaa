"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"
import {
  Calendar,
  Clock,
  User,
  ArrowRight,
  Zap,
  Shield,
  Globe,
  FileText,
  BookOpen,
  Loader2,
  Plane,
  Cloud,
  Scale,
  Compass,
} from "lucide-react"
import {
  fetchFeaturedPosts,
  fetchRecentPosts,
  fetchCategories,
  fetchTags,
  type BlogPost,
  type Category,
  type Tag,
} from "@/lib/api/blog"

function BlogHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0F1F3A] via-[#1756C8] to-[#4A7AE0] text-white">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[28rem] h-[28rem] bg-sky-200/40 rounded-full blur-3xl" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm mb-6">
          <Plane className="h-4 w-4" />
          PilotFAA journal
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Blog
        </h1>
        <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
          Study strategies, FAA handbook highlights, checkride prep ideas, and updates from the
          PilotFAA ground school team.
        </p>
      </div>
    </section>
  )
}

export default function BlogPage() {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([])
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadBlogData()
  }, [])

  const loadBlogData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [featured, recent, cats, tagList] = await Promise.all([
        fetchFeaturedPosts(),
        fetchRecentPosts(10),
        fetchCategories(),
        fetchTags(),
      ])

      setFeaturedPosts(featured || [])
      setRecentPosts(recent || [])
      setCategories(cats || [])
      setTags(tagList || [])
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { error?: string } }; message?: string }
      setError(
        ax.response?.data?.error ||
          ax.message ||
          "Could not load posts. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No date"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getCategoryIcon = (categoryName?: string): LucideIcon => {
    const n = (categoryName || "").toLowerCase()
    const iconMap: Record<string, LucideIcon> = {
      weather: Cloud,
      regulations: Scale,
      aerodynamics: Zap,
      navigation: Compass,
      systems: Shield,
      performance: Globe,
    }
    for (const key of Object.keys(iconMap)) {
      if (n.includes(key)) return iconMap[key]
    }
    return FileText
  }

  const popularTags = [...tags]
    .sort((a, b) => (b.post_count || 0) - (a.post_count || 0))
    .slice(0, 8)

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <BlogHero />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-[320px]">
            <Loader2 className="h-8 w-8 animate-spin text-[#1756C8]" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <BlogHero />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12 max-w-md mx-auto">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadBlogData} className="bg-[#1756C8] hover:bg-[#1347a8]">
              Try again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <BlogHero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {featuredPosts.length > 0 ? (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                  <FileText className="h-7 w-7 mr-2 text-[#1756C8]" />
                  Featured
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredPosts.map((post) => (
                    <Card
                      key={post.id}
                      className="group border-slate-200/80 hover:shadow-lg transition-shadow"
                    >
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          {post.category && (
                            <Badge
                              variant="outline"
                              className="text-[#1756C8] border-slate-200"
                            >
                              {post.category.name}
                            </Badge>
                          )}
                          <Badge className="bg-sky-100 text-[#1756C8] hover:bg-sky-100">
                            Featured
                          </Badge>
                        </div>
                        <CardTitle className="group-hover:text-[#1756C8] transition-colors">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="text-slate-600">
                          {post.excerpt || "No excerpt available"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 mb-4">
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {post.author.full_name || post.author.username}
                          </span>
                          {post.published_at && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(post.published_at)}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {post.read_time} min read
                          </span>
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
                          <Button
                            variant="outline"
                            className="group-hover:bg-[#1756C8] group-hover:text-white group-hover:border-[#1756C8]"
                          >
                            Read more
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            ) : null}

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                <BookOpen className="h-7 w-7 mr-2 text-[#1756C8]" />
                Latest posts
              </h2>
              {recentPosts.length === 0 && featuredPosts.length === 0 ? (
                <div className="text-center py-14 text-slate-600 rounded-xl border border-dashed border-slate-200 bg-white">
                  <Plane className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                  <p className="text-lg font-medium text-slate-800 mb-2">No posts yet</p>
                  <p className="text-sm mb-6 max-w-md mx-auto">
                    When the team publishes articles, they will appear here. Admins can add posts from
                    the workspace.
                  </p>
                  <Link href="/workspace/blogging">
                    <Button variant="outline">Open blog tools</Button>
                  </Link>
                </div>
              ) : recentPosts.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No recent posts.</p>
              ) : (
                <div className="space-y-6">
                  {recentPosts.map((post) => (
                    <Card
                      key={post.id}
                      className="group border-slate-200/80 hover:shadow-lg transition-shadow overflow-hidden"
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-2/3 p-6">
                          <div className="flex items-center gap-2 mb-2">
                            {post.category && (
                              <Badge
                                variant="outline"
                                className="text-[#1756C8] border-slate-200"
                              >
                                {post.category.name}
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="group-hover:text-[#1756C8] transition-colors mb-2">
                            {post.title}
                          </CardTitle>
                          <CardDescription className="text-slate-600 mb-4">
                            {post.excerpt || "No excerpt available"}
                          </CardDescription>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                              <span className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {post.author.full_name || post.author.username}
                              </span>
                              {post.published_at && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {formatDate(post.published_at)}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {post.read_time} min read
                              </span>
                            </div>
                            <Link href={`/blog/${post.slug}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="group-hover:bg-[#1756C8] group-hover:text-white group-hover:border-[#1756C8]"
                              >
                                Read more
                                <ArrowRight className="h-4 w-4 ml-2" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                        <div className="md:w-1/3 p-6 flex items-center justify-center bg-slate-100/80">
                          {post.featured_image ? (
                            <img
                              src={post.featured_image}
                              alt={post.title}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-32 bg-gradient-to-br from-sky-100 to-slate-100 rounded-lg flex items-center justify-center">
                              <FileText className="h-12 w-12 text-slate-300" />
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

          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {categories.length > 0 && (
                <Card className="border-slate-200/80">
                  <CardHeader>
                    <CardTitle className="text-lg">Categories</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    {categories.map((category) => {
                      const Icon = getCategoryIcon(category.name)
                      return (
                        <Link
                          key={category.id}
                          href={`/blog/category/${category.slug}`}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-[#1756C8]" />
                            <span className="text-sm group-hover:text-[#1756C8]">
                              {category.name}
                            </span>
                          </div>
                          {category.post_count !== undefined && category.post_count > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {category.post_count}
                            </Badge>
                          )}
                        </Link>
                      )
                    })}
                  </CardContent>
                </Card>
              )}

              <Card className="border-slate-200/80">
                <CardHeader>
                  <CardTitle className="text-lg">Stay in the loop</CardTitle>
                  <CardDescription>
                    Study tips and product updates from PilotFAA. (Newsletter signup coming soon.)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Email address"
                      disabled
                      className="w-full px-3 py-2 border border-slate-200 rounded-md bg-slate-50 text-slate-500 cursor-not-allowed"
                    />
                    <Button disabled className="w-full bg-slate-200 text-slate-500">
                      Coming soon
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {popularTags.length > 0 && (
                <Card className="border-slate-200/80">
                  <CardHeader>
                    <CardTitle className="text-lg">Popular tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {popularTags.map((tag) => (
                        <Link key={tag.id} href={`/blog/tag/${tag.slug}`}>
                          <Badge
                            variant="outline"
                            className="text-xs hover:bg-sky-50 hover:border-sky-200 cursor-pointer"
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
  )
}
