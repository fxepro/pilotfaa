"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import { DynamicPageHeader } from "@/components/dynamic-page-header";

export default function SEOMonitoringPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <DynamicPageHeader />
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-palette-primary" />
              <CardTitle>SEO Monitoring</CardTitle>
            </div>
            <CardDescription>
              Track SEO rankings, keywords, and search performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">SEO Monitoring Dashboard</h3>
              <p className="text-gray-500">SEO monitoring features coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

