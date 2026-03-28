"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { applyTheme } from "@/lib/theme";
import {
  Database,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Server,
  HardDrive,
  Activity,
  RefreshCw,
  TestTube,
  Eye,
  EyeOff,
  Edit,
  Save,
  X,
} from "lucide-react";
import { getApiBaseUrl } from "@/lib/api-config";
import axios from "axios";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DatabaseConnection {
  id: string;
  name: string;
  type: "postgresql" | "mysql" | "mongodb" | "sqlite" | "redis";
  host: string;
  port: number;
  database: string;
  username: string;
  password?: string;
  schema?: string;
  status: "connected" | "disconnected" | "error" | "testing";
  lastChecked?: string;
  connectionPool?: {
    min: number;
    max: number;
    active: number;
    idle: number;
  };
  stats?: {
    size: number;
    tables: number;
    indexes: number;
    queries: number;
  };
  isDefault?: boolean;
}

interface Schema {
  name: string;
  tables: Table[];
}

interface Table {
  name: string;
  schema: string;
  rows: number;
  size: number;
  indexes: number;
  type: string;
}

export default function DatabaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dbId = Array.isArray(params.id) ? params.id[0] : params.id || "";

  const [database, setDatabase] = useState<DatabaseConnection | null>(null);
  const [schemas, setSchemas] = useState<Schema[]>([]);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<DatabaseConnection>>({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (dbId) {
      loadDatabase();
      loadSchemas();
    }
  }, [dbId]);

  const loadDatabase = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Authentication required");
        router.push("/workspace/databases");
        return;
      }

      const apiBase = getApiBaseUrl();
      const response = await axios.get(`${apiBase}/api/admin/databases/${dbId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const dbData = response.data;
      const loadedDatabase: DatabaseConnection = {
        id: dbData.id,
        name: dbData.name,
        type: dbData.engine,
        host: dbData.host,
        port: dbData.port,
        database: dbData.database_name,
        username: dbData.username,
        schema: dbData.schema,
        status: dbData.status || 'disconnected',
        lastChecked: dbData.last_checked,
        connectionPool: undefined, // Not provided by API
        stats: undefined, // Will be calculated
        isDefault: dbData.is_default || false,
      };

      setDatabase(loadedDatabase);
      setEditForm({
        name: loadedDatabase.name,
        host: loadedDatabase.host,
        port: loadedDatabase.port,
        database: loadedDatabase.database,
        username: loadedDatabase.username,
        schema: loadedDatabase.schema,
      });
    } catch (error: any) {
      console.error("Error loading database:", error);
      if (error.response?.status === 404) {
        toast.error("Database connection not found");
        router.push("/workspace/databases");
      } else if (error.response?.status === 401) {
        toast.error("Authentication required. Please log in again.");
        router.push("/workspace/databases");
      } else {
        toast.error(error.response?.data?.error || "Failed to load database connection");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadSchemas = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const apiBase = getApiBaseUrl();
      
      // First, get all schemas
      const schemasResponse = await axios.get(`${apiBase}/api/admin/databases/${dbId}/schemas/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Then, get all tables grouped by schema with statistics
      const tablesResponse = await axios.get(`${apiBase}/api/admin/databases/${dbId}/tables/?include_stats=true`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const schemasData = schemasResponse.data || [];
      const tablesData = tablesResponse.data || [];

      // Group tables by schema
      const schemaMap = new Map<string, Schema>();
      
      schemasData.forEach((schema: any) => {
        schemaMap.set(schema.name, {
          name: schema.name,
          tables: []
        });
      });

      // Add tables to their schemas with real statistics
      tablesData.forEach((table: any) => {
        const schemaName = table.schema || 'public';
        if (!schemaMap.has(schemaName)) {
          schemaMap.set(schemaName, {
            name: schemaName,
            tables: []
          });
        }
        
        const schema = schemaMap.get(schemaName)!;
        schema.tables.push({
          name: table.name,
          schema: schemaName,
          rows: table.rows || 0, // Real row count from API
          size: table.size || 0, // Real size in bytes from API
          indexes: table.indexes || 0, // Real index count from API
          type: "table",
        });
      });

      const schemasArray = Array.from(schemaMap.values());
      setSchemas(schemasArray);
      
      // Update status to connected if data was loaded successfully (even if empty)
      // This indicates the connection is working
      if (database) {
        setDatabase({
          ...database,
          status: "connected",
          lastChecked: new Date().toISOString(),
        });
      }
    } catch (error: any) {
      console.error("Error loading schemas:", error);
      toast.error(error.response?.data?.error || "Failed to load database schemas");
      setSchemas([]);
      
      // Update status to error if loading failed
      if (database) {
        setDatabase({
          ...database,
          status: "error",
        });
      }
    }
  };

  const handleTest = async () => {
    setTesting(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const apiBase = getApiBaseUrl();
      const response = await axios.post(
        `${apiBase}/api/admin/databases/${dbId}/test/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        if (database) {
          setDatabase({
            ...database,
            status: "connected",
            lastChecked: new Date().toISOString(),
          });
        }
        toast.success("Connection test successful");
      } else {
        if (database) {
          setDatabase({ ...database, status: "error" });
        }
        toast.error(response.data.error || "Connection test failed");
      }
    } catch (error: any) {
      if (database) {
        setDatabase({ ...database, status: "error" });
      }
      toast.error(error.response?.data?.error || error.response?.data?.message || "Connection test failed");
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const apiBase = getApiBaseUrl();
      const updateData = {
        name: editForm.name,
        host: editForm.host,
        port: editForm.port,
        database_name: editForm.database,
        username: editForm.username,
        password: editForm.password, // Will be encrypted by backend
        schema: editForm.schema,
      };

      const response = await axios.put(
        `${apiBase}/api/admin/databases/${dbId}/`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Reload database to get updated data
      await loadDatabase();
      setEditing(false);
      toast.success("Database connection updated successfully");
    } catch (error: any) {
      console.error("Error saving database:", error);
      toast.error(error.response?.data?.error || "Failed to save database connection");
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Connected
          </Badge>
        );
      case "disconnected":
        return (
          <Badge variant="outline" className="border-gray-500 text-gray-700">
            <XCircle className="h-3 w-3 mr-1" />
            Disconnected
          </Badge>
        );
      case "error":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Error
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      postgresql: "bg-blue-500",
      mysql: "bg-orange-500",
      mongodb: "bg-green-500",
      sqlite: "bg-purple-500",
      redis: "bg-red-500",
    };
    return (
      <Badge className={colors[type] || "bg-gray-500"}>
        {type.toUpperCase()}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className={applyTheme.page()}>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-palette-primary mx-auto"></div>
          <p className="text-slate-600 mt-4">Loading database details...</p>
        </div>
      </div>
    );
  }

  if (!database) {
    return (
      <div className={applyTheme.page()}>
        <div className="text-center py-12">
          <p className="text-slate-600">Database not found</p>
          <Button className="mt-4" asChild>
            <Link href="/workspace/databases">Back to Databases</Link>
          </Button>
        </div>
      </div>
    );
  }

  const allTables = schemas.flatMap((schema) => schema.tables);

  return (
    <div className={applyTheme.page()}>
      {/* Back Button */}
      <div className="mb-4">
        <Button variant="ghost" asChild>
          <Link href="/workspace/databases">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Databases
          </Link>
        </Button>
      </div>

      {/* Header Section with Connection Details */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Database className="h-8 w-8 text-palette-primary" />
              <div>
                <CardTitle className="text-2xl">{database.name}</CardTitle>
                <CardDescription>
                  {getTypeBadge(database.type)}
                  {database.isDefault && (
                    <Badge className="ml-2 bg-blue-500">Default</Badge>
                  )}
                  <span className="ml-2">{getStatusBadge(database.status)}</span>
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {editing ? (
                <>
                  <Button onClick={handleSave} variant="default">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      setEditing(false);
                      setEditForm({
                        name: database.name,
                        host: database.host,
                        port: database.port,
                        database: database.database,
                        username: database.username,
                        schema: database.schema,
                      });
                    }}
                    variant="outline"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => setEditing(true)} variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    onClick={handleTest}
                    disabled={testing}
                    variant="outline"
                  >
                    <TestTube className="h-4 w-4 mr-2" />
                    {testing ? "Testing..." : "Test Connection"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <Label className="text-sm font-semibold text-slate-600">Host</Label>
              {editing ? (
                <Input
                  value={editForm.host || database.host}
                  onChange={(e) =>
                    setEditForm({ ...editForm, host: e.target.value })
                  }
                  className="mt-1"
                />
              ) : (
                <p className="text-slate-800 mt-1">{database.host}</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-semibold text-slate-600">Port</Label>
              {editing ? (
                <Input
                  type="number"
                  value={editForm.port || database.port}
                  onChange={(e) =>
                    setEditForm({ ...editForm, port: parseInt(e.target.value) })
                  }
                  className="mt-1"
                />
              ) : (
                <p className="text-slate-800 mt-1">{database.port}</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-semibold text-slate-600">Database</Label>
              {editing ? (
                <Input
                  value={editForm.database || database.database}
                  onChange={(e) =>
                    setEditForm({ ...editForm, database: e.target.value })
                  }
                  className="mt-1"
                />
              ) : (
                <p className="text-slate-800 mt-1">{database.database}</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-semibold text-slate-600">Username</Label>
              {editing ? (
                <Input
                  value={editForm.username || database.username}
                  onChange={(e) =>
                    setEditForm({ ...editForm, username: e.target.value })
                  }
                  className="mt-1"
                />
              ) : (
                <p className="text-slate-800 mt-1">{database.username}</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-semibold text-slate-600">Password</Label>
              {editing ? (
                <div className="relative mt-1">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={editForm.password || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, password: e.target.value })
                    }
                    placeholder="Enter password"
                    className="pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              ) : (
                <p className="text-slate-800 mt-1">••••••••</p>
              )}
            </div>
            {database.schema && (
              <div>
                <Label className="text-sm font-semibold text-slate-600">Schema</Label>
                {editing ? (
                  <Input
                    value={editForm.schema || database.schema}
                    onChange={(e) =>
                      setEditForm({ ...editForm, schema: e.target.value })
                    }
                    className="mt-1"
                  />
                ) : (
                  <p className="text-slate-800 mt-1">{database.schema}</p>
                )}
              </div>
            )}
            {database.connectionPool && (
              <div>
                <Label className="text-sm font-semibold text-slate-600">Connection Pool</Label>
                <p className="text-slate-800 mt-1">
                  {database.connectionPool.active}/{database.connectionPool.max} active,{" "}
                  {database.connectionPool.idle} idle
                </p>
              </div>
            )}
            {database.stats && (
              <>
                <div>
                  <Label className="text-sm font-semibold text-slate-600">Database Size</Label>
                  <p className="text-slate-800 mt-1">{formatBytes(database.stats.size)}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-slate-600">Total Tables</Label>
                  <p className="text-slate-800 mt-1">{database.stats.tables}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-slate-600">Total Indexes</Label>
                  <p className="text-slate-800 mt-1">{database.stats.indexes}</p>
                </div>
              </>
            )}
            {database.lastChecked && (
              <div>
                <Label className="text-sm font-semibold text-slate-600">Last Checked</Label>
                <p className="text-slate-800 mt-1">
                  {new Date(database.lastChecked).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Schemas and Tables Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Schemas & Tables</CardTitle>
              <CardDescription>
                View all schemas and tables in this database
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                loadSchemas();
                loadDatabase();
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Schema</TableHead>
                <TableHead>Table Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Rows</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Indexes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schemas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                    No schemas or tables found
                  </TableCell>
                </TableRow>
              ) : (
                schemas.map((schema) =>
                  schema.tables.map((table, index) => (
                    <TableRow key={`${schema.name}-${table.name}`}>
                      {index === 0 && (
                        <TableCell
                          rowSpan={schema.tables.length}
                          className="font-semibold text-palette-primary align-top"
                        >
                          {schema.name}
                        </TableCell>
                      )}
                      <TableCell className="font-medium">{table.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{table.type}</Badge>
                      </TableCell>
                      <TableCell>{table.rows.toLocaleString()}</TableCell>
                      <TableCell>{formatBytes(table.size)}</TableCell>
                      <TableCell>{table.indexes}</TableCell>
                    </TableRow>
                  ))
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

