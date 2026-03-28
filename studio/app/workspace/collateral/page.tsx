"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

export default function CollateralLibraryPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Collateral library</h1>
        <p className="text-slate-600 mt-1">
          Marketing and training assets for PilotFAA. Replace this placeholder when your asset workflow is ready.
        </p>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center gap-3 space-y-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-palette-accent-3 text-palette-primary">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg">Coming soon</CardTitle>
            <CardDescription>Uploads, folders, and sharing will live here.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          Use <strong>Blogging</strong> in the sidebar for published content until this area is built out.
        </CardContent>
      </Card>
    </div>
  );
}
