"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-slate-900">Products</h1>
        <p className="text-sm text-slate-600">
          Manage product catalog, variants, media, and publishing.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Catalog</CardTitle>
            <CardDescription>Create and manage products</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button>Add product</Button>
            <Button variant="outline">Import</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Variants</CardTitle>
            <CardDescription>Manage SKUs and options</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button variant="outline">Create variant set</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Publishing</CardTitle>
            <CardDescription>Draft, publish, and archive</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button variant="outline">Review drafts</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Next steps</CardTitle>
          <CardDescription>Connect APIs and data sources</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          Hook this module to the Products API once endpoints are ready. This view is
          a scaffold for CRUD tables, filters, and editor workflows.
        </CardContent>
      </Card>
    </div>
  );
}
