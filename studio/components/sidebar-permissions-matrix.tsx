"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, RefreshCw, Loader2, Lock, Eye, Edit, Plus, Trash2 } from "lucide-react";
import { applyTheme } from "@/lib/theme";
import axios from "axios";
import { toast } from "sonner";

// Use relative URL in production (browser), localhost in dev (SSR)
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? (typeof window !== 'undefined' ? 'http://localhost:8000' : 'http://localhost:8000');

interface Role {
  id: number;
  name: string;
  is_system_role: boolean;
}

interface SidebarItem {
  id: string;
  title: string;
  section: string;
  section_title: string;
  required_permissions: Record<string, string>;
  href: string;
  role_access: Record<string, {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    display: string;
  }>;
}

interface MatrixData {
  roles: Role[];
  sidebar_items: SidebarItem[];
  summary: {
    total_items: number;
    role_counts: Record<string, number>;
  };
}

export function SidebarPermissionsMatrix() {
  const [matrixData, setMatrixData] = useState<MatrixData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [changes, setChanges] = useState<Record<string, Record<string, string[]>>>({}); // role_id -> sidebar_item_id -> permission_codes

  useEffect(() => {
    fetchMatrix();
  }, []);

  const fetchMatrix = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Authentication token not found. Please log in.");
        return;
      }

      const response = await axios.get(`${API_BASE}/api/roles/sidebar-matrix/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMatrixData(response.data);
      setChanges({});
    } catch (error: any) {
      console.error("Error fetching matrix:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setError("Session expired. Please log in again.");
        window.location.href = "/workspace/login";
      } else {
        setError(error.response?.data?.error || "Failed to fetch matrix data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (roleId: number, sidebarItemId: string, permissionType: string, granted: boolean) => {
    if (!matrixData) return;

    // All roles (system and custom) can have their permissions edited
    // System roles just can't be renamed or deleted, but permissions are editable

    const sidebarItem = matrixData.sidebar_items.find(item => item.id === sidebarItemId);
    if (!sidebarItem) return;

    const permissionCode = sidebarItem.required_permissions[permissionType];
    if (!permissionCode) return;

    setChanges(prev => {
      const newChanges = { ...prev };
      const roleKey = roleId.toString();
      const itemKey = sidebarItemId;

      if (!newChanges[roleKey]) {
        newChanges[roleKey] = {};
      }
      if (!newChanges[roleKey][itemKey]) {
        // Initialize with current permissions
        const currentAccess = sidebarItem.role_access[roleKey] || { view: false, create: false, edit: false, delete: false };
        const currentPerms: string[] = [];
        if (currentAccess.view && sidebarItem.required_permissions.view) currentPerms.push(sidebarItem.required_permissions.view);
        if (currentAccess.create && sidebarItem.required_permissions.create) currentPerms.push(sidebarItem.required_permissions.create);
        if (currentAccess.edit && sidebarItem.required_permissions.edit) currentPerms.push(sidebarItem.required_permissions.edit);
        if (currentAccess.delete && sidebarItem.required_permissions.delete) currentPerms.push(sidebarItem.required_permissions.delete);
        newChanges[roleKey][itemKey] = [...currentPerms];
      }

      const perms = newChanges[roleKey][itemKey];
      if (granted) {
        if (!perms.includes(permissionCode)) {
          newChanges[roleKey][itemKey] = [...perms, permissionCode];
        }
      } else {
        newChanges[roleKey][itemKey] = perms.filter(p => p !== permissionCode);
      }

      return newChanges;
    });
  };

  const getAccessValue = (roleId: number, sidebarItemId: string): string => {
    if (!matrixData) return "-";
    
    const roleKey = roleId.toString();
    const sidebarItem = matrixData.sidebar_items.find(item => item.id === sidebarItemId);
    if (!sidebarItem) return "-";

    // Check if there are pending changes
    const roleChanges = changes[roleKey];
    if (roleChanges && roleChanges[sidebarItemId]) {
      const changedPerms = roleChanges[sidebarItemId];
      const parts: string[] = [];
      if (sidebarItem.required_permissions.view && changedPerms.includes(sidebarItem.required_permissions.view)) parts.push('V');
      if (sidebarItem.required_permissions.create && changedPerms.includes(sidebarItem.required_permissions.create)) parts.push('C');
      if (sidebarItem.required_permissions.edit && changedPerms.includes(sidebarItem.required_permissions.edit)) parts.push('E');
      if (sidebarItem.required_permissions.delete && changedPerms.includes(sidebarItem.required_permissions.delete)) parts.push('D');
      return parts.length > 0 ? parts.join('+') : '-';
    }

    // Return current access
    const access = sidebarItem.role_access[roleKey];
    return access?.display || "-";
  };

  const getPermissionChecked = (roleId: number, sidebarItemId: string, permissionType: string): boolean => {
    if (!matrixData) return false;
    
    const roleKey = roleId.toString();
    const sidebarItem = matrixData.sidebar_items.find(item => item.id === sidebarItemId);
    if (!sidebarItem) return false;

    const permissionCode = sidebarItem.required_permissions[permissionType];
    if (!permissionCode) return false;

    // Check if there are pending changes
    const roleChanges = changes[roleKey];
    if (roleChanges && roleChanges[sidebarItemId]) {
      return roleChanges[sidebarItemId].includes(permissionCode);
    }

    // Return current access
    const access = sidebarItem.role_access[roleKey];
    if (!access) return false;

    const permissionValue = access[permissionType as keyof typeof access];
    return typeof permissionValue === 'boolean' ? permissionValue : false;
  };

  const hasChanges = () => {
    return Object.keys(changes).length > 0;
  };

  const saveChanges = async () => {
    if (!matrixData || !hasChanges()) {
      console.log("No changes to save or no matrix data");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      let token = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");
      
      console.log("Starting save changes...", { changesCount: Object.keys(changes).length });
      
      if (!token) {
        const errorMsg = "Authentication token not found.";
        setError(errorMsg);
        toast.error(errorMsg);
        setSaving(false);
        return;
      }

      // Helper function to refresh token
      const refreshAccessToken = async (): Promise<string | null> => {
        if (!refreshToken) {
          return null;
        }
        
        try {
          const res = await axios.post(`${API_BASE}/api/token/refresh/`, {
            refresh: refreshToken,
          });
          const newAccessToken = res.data.access;
          localStorage.setItem("access_token", newAccessToken);
          // Update refresh token if a new one is provided (token rotation)
          if (res.data.refresh) {
            localStorage.setItem("refresh_token", res.data.refresh);
          }
          return newAccessToken;
        } catch (err) {
          console.error("Token refresh failed:", err);
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          return null;
        }
      };

      // Helper function to make authenticated request with retry on 401
      const makeRequest = async (roleId: number, permCodes: string[], currentToken: string): Promise<void> => {
        try {
          await axios.post(
            `${API_BASE}/api/roles/sidebar-matrix/update/`,
            {
              role_id: roleId,
              permission_codes: permCodes,
            },
            {
              headers: { Authorization: `Bearer ${currentToken}` },
            }
          );
        } catch (err: any) {
          // If 401, try to refresh token and retry
          if (err.response?.status === 401) {
            const newToken = await refreshAccessToken();
            if (newToken) {
              // Retry with new token
              await axios.post(
                `${API_BASE}/api/roles/sidebar-matrix/update/`,
                {
                  role_id: roleId,
                  permission_codes: permCodes,
                },
                {
                  headers: { Authorization: `Bearer ${newToken}` },
                }
              );
              // Update token for subsequent requests
              token = newToken;
            } else {
              throw new Error("Session expired. Please log in again.");
            }
          } else {
            throw err;
          }
        }
      };

      // Get current permissions from backend for each role that has changes
      // Fetch the actual role data which includes permissions
      const rolesWithChanges = new Set(Object.keys(changes).map(id => parseInt(id)));
      const rolePermissionMap: Record<number, Set<string>> = {};
      
      // Fetch current role data from backend (source of truth)
      await Promise.all(
        Array.from(rolesWithChanges).map(async (roleId) => {
          try {
            const roleResponse = await axios.get(
              `${API_BASE}/api/roles/${roleId}/`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            
            // Extract permission codes from role.permissions
            // The role serializer returns permissions with codename
            const permissionCodes = new Set<string>();
            const permissions = roleResponse.data.permissions || [];
            
            // Convert Django permission codenames to FeaturePermission codes
            // Backend uses the same conversion logic in get_sidebar_matrix
            permissions.forEach((perm: any) => {
              const codename = perm.codename || '';
              // Match the backend conversion logic from permission_views.py line 786-795
              if (codename.endsWith('_view')) {
                permissionCodes.add(codename.slice(0, -5).replace(/_/g, '.') + '.view');
              } else if (codename.endsWith('_create')) {
                permissionCodes.add(codename.slice(0, -7).replace(/_/g, '.') + '.create');
              } else if (codename.endsWith('_edit')) {
                permissionCodes.add(codename.slice(0, -5).replace(/_/g, '.') + '.edit');
              } else if (codename.endsWith('_delete')) {
                permissionCodes.add(codename.slice(0, -7).replace(/_/g, '.') + '.delete');
              } else {
                // Fallback: try direct conversion
                permissionCodes.add(codename.replace(/_/g, '.'));
              }
            });
            
            rolePermissionMap[roleId] = permissionCodes;
            console.log(`Fetched ${permissionCodes.size} permissions for role ${roleId} from backend`);
          } catch (err: any) {
            console.error(`Failed to fetch role ${roleId}:`, err);
            // Fallback: use matrix data (less reliable but better than nothing)
            rolePermissionMap[roleId] = new Set();
            matrixData.sidebar_items.forEach(item => {
              const access = item.role_access[roleId.toString()];
              if (access) {
                if (access.view && item.required_permissions.view) rolePermissionMap[roleId].add(item.required_permissions.view);
                if (access.create && item.required_permissions.create) rolePermissionMap[roleId].add(item.required_permissions.create);
                if (access.edit && item.required_permissions.edit) rolePermissionMap[roleId].add(item.required_permissions.edit);
                if (access.delete && item.required_permissions.delete) rolePermissionMap[roleId].add(item.required_permissions.delete);
              }
            });
          }
        })
      );

      // Apply changes to the fetched permissions
      Object.entries(changes).forEach(([roleIdStr, itemChanges]) => {
        const roleId = parseInt(roleIdStr);
        if (!rolePermissionMap[roleId]) rolePermissionMap[roleId] = new Set();

        Object.entries(itemChanges).forEach(([itemId, permCodes]) => {
          const item = matrixData.sidebar_items.find(i => i.id === itemId);
          if (!item) return;

          // Get all permission codes that this specific item can have
          const itemPermissionCodes = new Set<string>();
          if (item.required_permissions.view) itemPermissionCodes.add(item.required_permissions.view);
          if (item.required_permissions.create) itemPermissionCodes.add(item.required_permissions.create);
          if (item.required_permissions.edit) itemPermissionCodes.add(item.required_permissions.edit);
          if (item.required_permissions.delete) itemPermissionCodes.add(item.required_permissions.delete);

          // Remove this item's permissions from the role
          itemPermissionCodes.forEach(code => rolePermissionMap[roleId].delete(code));

          // Add back the new permissions for this item
          permCodes.forEach(code => {
            if (itemPermissionCodes.has(code)) {
              rolePermissionMap[roleId].add(code);
            }
          });
        });
      });

      // Save each role with the complete permission set
      const savePromises = Object.entries(rolePermissionMap).map(async ([roleIdStr, permCodes]) => {
        const roleId = parseInt(roleIdStr);
        const permCodesArray = Array.from(permCodes);
        console.log(`Saving role ${roleId} with ${permCodesArray.length} permissions:`, permCodesArray.slice(0, 10));
        try {
          await makeRequest(roleId, permCodesArray, token!);
          console.log(`Successfully saved role ${roleId}`);
        } catch (err: any) {
          console.error(`Failed to save role ${roleId}:`, err);
          throw err;
        }
      });

      await Promise.all(savePromises);
      console.log("All roles saved successfully");

      // Refresh matrix data
      await fetchMatrix();
      
      // Show success message
      toast.success("Permissions saved successfully!");
    } catch (error: any) {
      console.error("Error saving changes:", error);
      const errorMessage = error.response?.data?.error || error.message || "Failed to save changes. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className={applyTheme.card()}>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-palette-primary" />
          <span className="ml-2 text-slate-600">Loading matrix data...</span>
        </CardContent>
      </Card>
    );
  }

  if (error && !matrixData) {
    return (
      <Card className={applyTheme.card()}>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchMatrix} variant="outline">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!matrixData) {
    return null;
  }

  // Group sidebar items by section
  const itemsBySection: Record<string, SidebarItem[]> = {};
  matrixData.sidebar_items.forEach(item => {
    if (!itemsBySection[item.section]) {
      itemsBySection[item.section] = [];
    }
    itemsBySection[item.section].push(item);
  });

  return (
    <Card className={applyTheme.card()}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Sidebar Permissions Matrix</CardTitle>
            <CardDescription>
              Manage which sidebar options each role can access. System roles (Viewer, Analyst, Manager, Director, Admin) can have permissions edited but cannot be renamed or deleted.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={fetchMatrix} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            {hasChanges() && (
              <Button onClick={saveChanges} disabled={saving} size="sm">
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
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px] sticky left-0 bg-white z-10">Sidebar Option</TableHead>
                      {/* Sort roles by seniority: Admin, Agency, Executive, Director, Manager, Analyst, Auditor, Viewer */}
                      {(() => {
                        const ROLE_ORDER = ['Admin', 'Agency', 'Executive', 'Director', 'Manager', 'Analyst', 'Auditor', 'Viewer'];
                        const sortedRoles = [...matrixData.roles].sort((a, b) => {
                          const aIndex = ROLE_ORDER.indexOf(a.name);
                          const bIndex = ROLE_ORDER.indexOf(b.name);
                          if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
                          if (aIndex !== -1) return -1;
                          if (bIndex !== -1) return 1;
                          return a.name.localeCompare(b.name);
                        });
                        return sortedRoles.map(role => (
                          <TableHead key={role.id} className="text-center min-w-[120px]">
                            <div className="flex flex-col items-center gap-1">
                              <span>{role.name}</span>
                              {role.is_system_role && (
                                <Badge variant="outline" className="text-xs">
                                  System
                                </Badge>
                              )}
                            </div>
                          </TableHead>
                        ));
                      })()}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(itemsBySection).map(([sectionId, items]) => (
                <React.Fragment key={sectionId}>
                  <TableRow className="bg-slate-50">
                    <TableCell colSpan={matrixData.roles.length + 1} className="font-semibold">
                      {items[0]?.section_title || sectionId}
                    </TableCell>
                  </TableRow>
                  {items.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium sticky left-0 bg-white z-10">
                        {item.title}
                      </TableCell>
                      {(() => {
                        const ROLE_ORDER = ['Admin', 'Agency', 'Executive', 'Director', 'Manager', 'Analyst', 'Auditor', 'Viewer'];
                        const sortedRoles = [...matrixData.roles].sort((a, b) => {
                          const aIndex = ROLE_ORDER.indexOf(a.name);
                          const bIndex = ROLE_ORDER.indexOf(b.name);
                          if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
                          if (aIndex !== -1) return -1;
                          if (bIndex !== -1) return 1;
                          return a.name.localeCompare(b.name);
                        });
                        return sortedRoles.map(role => {
                          const access = item.role_access[role.id.toString()] || { view: false, create: false, edit: false, delete: false };
                          const displayValue = getAccessValue(role.id, item.id);

                          return (
                            <TableCell key={role.id} className="text-center">
                            <div className="flex flex-col gap-1 items-center">
                              {item.required_permissions.view && (
                                <div className="flex gap-1 items-center">
                                  <Checkbox
                                    checked={getPermissionChecked(role.id, item.id, 'view')}
                                    onCheckedChange={(checked) => handlePermissionChange(role.id, item.id, 'view', checked as boolean)}
                                  />
                                  <span className="text-xs text-gray-500">V</span>
                                </div>
                              )}
                              {item.required_permissions.edit && (
                                <div className="flex gap-1 items-center">
                                  <Checkbox
                                    checked={getPermissionChecked(role.id, item.id, 'edit')}
                                    onCheckedChange={(checked) => handlePermissionChange(role.id, item.id, 'edit', checked as boolean)}
                                  />
                                  <span className="text-xs text-gray-500">E</span>
                                </div>
                              )}
                              {item.required_permissions.create && (
                                <div className="flex gap-1 items-center">
                                  <Checkbox
                                    checked={getPermissionChecked(role.id, item.id, 'create')}
                                    onCheckedChange={(checked) => handlePermissionChange(role.id, item.id, 'create', checked as boolean)}
                                  />
                                  <span className="text-xs text-gray-500">C</span>
                                </div>
                              )}
                              {item.required_permissions.delete && (
                                <div className="flex gap-1 items-center">
                                  <Checkbox
                                    checked={getPermissionChecked(role.id, item.id, 'delete')}
                                    onCheckedChange={(checked) => handlePermissionChange(role.id, item.id, 'delete', checked as boolean)}
                                  />
                                  <span className="text-xs text-gray-500">D</span>
                                </div>
                              )}
                              <Badge variant="outline" className="text-xs mt-1">
                                {displayValue}
                              </Badge>
                            </div>
                          </TableCell>
                          );
                        });
                      })()}
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 p-3 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-600">
            <strong>Legend:</strong> V = View, C = Create, E = Edit, D = Delete. System roles can have permissions edited but cannot be renamed or deleted.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

