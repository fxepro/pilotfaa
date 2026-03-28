"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  fetchBlogPost,
  updateBlogPost,
  fetchCategories,
  fetchTags,
  type Category,
  type Tag,
  type BlogPost,
} from "@/lib/api/blog";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { BlogRichTextEditor } from "@/components/blog-rich-text-editor";

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = Number(params.id);
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category_id: null as number | null,
    tag_ids: [] as number[],
    status: "draft" as "draft" | "published" | "archived",
    featured: false,
  });

  useEffect(() => {
    loadData();
  }, [postId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [postData, cats, tagList] = await Promise.all([
        fetchBlogPost(postId),
        fetchCategories(),
        fetchTags(),
      ]);
      setPost(postData);
      setCategories(cats);
      setTags(tagList);

      setFormData({
        title: postData.title,
        slug: postData.slug,
        excerpt: postData.excerpt || "",
        content: postData.content || "",
        category_id: postData.category?.id || null,
        tag_ids: postData.tags.map((t) => t.id),
        status: postData.status,
        featured: postData.featured,
      });
    } catch (err: any) {
      console.error("Error loading post:", err);
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to load blog post",
        variant: "destructive",
      });
      router.push("/workspace/blogging");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateBlogPost(postId, formData);
      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });
      router.push("/workspace/blogging");
    } catch (err: any) {
      console.error("Error updating post:", err);
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to update blog post",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Edit Blog Post</h1>
        <p className="text-muted-foreground mt-1">
          Update your blog post details
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Post Details</CardTitle>
            <CardDescription>
              Update the details for your blog post
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    title: e.target.value,
                    slug: e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/^-+|-+$/g, ""),
                  });
                }}
                required
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="content">Content *</Label>
              <BlogRichTextEditor
                value={formData.content}
                onChange={(value) =>
                  setFormData({ ...formData, content: value })
                }
                placeholder="Write your blog post content here..."
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="w-full h-10 px-3 border rounded-md"
                  value={formData.category_id || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category_id: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                >
                  <option value="">None</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  className="w-full h-10 px-3 border rounded-md"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as "draft" | "published" | "archived",
                    })
                  }
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData({ ...formData, featured: e.target.checked })
                }
                className="h-4 w-4"
              />
              <Label htmlFor="featured">Featured Post</Label>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
