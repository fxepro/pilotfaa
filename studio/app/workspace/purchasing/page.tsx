"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PurchasingPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-slate-900">Purchasing</h1>
        <p className="text-sm text-slate-600">
          Manage suppliers, purchase orders, and receipts.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Suppliers</CardTitle>
            <CardDescription>Vendor directory and contacts</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button>Add supplier</Button>
            <Button variant="outline">View suppliers</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Purchase Orders</CardTitle>
            <CardDescription>Draft, approve, and track POs</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button>Create PO</Button>
            <Button variant="outline">PO list</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Receiving</CardTitle>
            <CardDescription>Partial or full receipts</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button variant="outline">Record receipt</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Next steps</CardTitle>
          <CardDescription>Connect to purchasing API</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          This module will host supplier management and PO workflows.
        </CardContent>
      </Card>
    </div>
  );
}
