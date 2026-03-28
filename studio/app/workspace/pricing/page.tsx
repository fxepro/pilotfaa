"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-slate-900">Pricing</h1>
        <p className="text-sm text-slate-600">
          Manage price books, promotions, and product pricing.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Price Books</CardTitle>
            <CardDescription>Default and regional pricing</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button>Create price book</Button>
            <Button variant="outline">View all</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Price Rules</CardTitle>
            <CardDescription>Schedule or tier pricing</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button variant="outline">Add rule</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Overrides</CardTitle>
            <CardDescription>Variant-level pricing overrides</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button variant="outline">Manage overrides</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Next steps</CardTitle>
          <CardDescription>Connect to pricing API</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          This module will host pricing tables and schedule controls.
        </CardContent>
      </Card>
    </div>
  );
}
