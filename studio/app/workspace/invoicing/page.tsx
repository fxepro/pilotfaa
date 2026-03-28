"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function InvoicingPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-slate-900">Invoicing</h1>
        <p className="text-sm text-slate-600">
          Create invoices, track payments, and manage billing status.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
            <CardDescription>Draft, issue, and manage invoices</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button>Create invoice</Button>
            <Button variant="outline">Invoice list</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Payments</CardTitle>
            <CardDescription>Track payment activity</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button variant="outline">View payments</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
            <CardDescription>Overdue and unpaid invoices</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button variant="outline">Review overdue</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Next steps</CardTitle>
          <CardDescription>Connect to invoicing API</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          This scaffold will host invoice tables, filters, and payment reconciliation.
        </CardContent>
      </Card>
    </div>
  );
}
