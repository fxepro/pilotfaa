"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-slate-900">Inventory</h1>
        <p className="text-sm text-slate-600">
          Track stock levels, locations, and inventory movements.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Stock Levels</CardTitle>
            <CardDescription>Monitor on-hand and reserved</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button>Adjust stock</Button>
            <Button variant="outline">Export</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Locations</CardTitle>
            <CardDescription>Warehouses and virtual stock</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button variant="outline">Add location</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Movements</CardTitle>
            <CardDescription>Audit stock changes</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button variant="outline">View log</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Next steps</CardTitle>
          <CardDescription>Connect to inventory service</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          This scaffold will host stock tables, alerts, and adjustment workflows.
        </CardContent>
      </Card>
    </div>
  );
}
