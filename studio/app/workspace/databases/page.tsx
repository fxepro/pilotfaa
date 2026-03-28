"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { applyTheme } from "@/lib/theme";
import {
  Database,
  CheckCircle,
  XCircle,
  Edit,
  Save,
  X,
  Activity,
  Server,
  HardDrive,
  Users,
  Settings,
  TestTube,
  TrendingUp,
  AlertCircle,
  Plus,
  Trash2,
  RefreshCw,
  Download,
  Upload,
  Key,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { getApiBaseUrl } from "@/lib/api-config";
import axios from "axios";
import { toast } from "sonner";

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

const DEFAULT_DATABASES: DatabaseConnection[] = [
  {
    id: "default-postgres",
    name: "Default PostgreSQL",
    type: "postgresql",
    host: "localhost",
    port: 5432,
    database: "pagerodeo",
    username: "postgres",
    status: "connected",
    connectionPool: {
      min: 2,
      max: 10,
      active: 3,
      idle: 2,
    },
    stats: {
      size: 1024 * 1024 * 500, // 500 MB
      tables: 45,
      indexes: 120,
      queries: 15234,
    },
    isDefault: true,
  },
];

export default function DatabasesPage() {
  const [databases, setDatabases] = useState<DatabaseConnection[]>(DEFAULT_DATABASES);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("connections");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const dialogOpeningRef = useRef(false);
  const [showPassword, setShowPassword] = useState(false);
  const [creating, setCreating] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [performanceData, setPerformanceData] = useState<Record<string, any>>({});
  const [loadingPerformance, setLoadingPerformance] = useState<Record<string, boolean>>({});
  const [connectionForm, setConnectionForm] = useState({
    name: "",
    engine: "postgresql" as "postgresql" | "mysql" | "sqlite",
    host: "localhost",
    port: 5432,
    username: "",
    password: "",
    database_name: "",
    schema: "",
    is_active: true,
  });

  useEffect(() => {
    loadDatabases();
  }, []);

  useEffect(() => {
    // Load performance metrics after databases are loaded
    if (databases.length > 0 && !loading) {
      loadPerformanceMetrics();
    }
  }, [databases.length, loading]);

  const loadDatabases = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setLoading(false);
        return;
      }

      const apiBase = getApiBaseUrl();
      const response = await axios.get(`${apiBase}/api/admin/databases/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && Array.isArray(response.data)) {
        // Transform API response to match our interface
        const transformed = response.data.map((db: any) => ({
          id: db.id,
          name: db.name,
          type: db.engine,
          host: db.host,
          port: db.port,
          database: db.database_name || db.database, // Handle both field names
          username: db.username,
          schema: db.schema,
          status: db.status || 'disconnected', // Use status from API
          lastChecked: db.last_checked,
          connectionPool: undefined, // Will be fetched separately if needed
          stats: undefined, // Will be calculated from tables
          isDefault: db.is_default || false,
        }));
        setDatabases(transformed);
        console.log(`Loaded ${transformed.length} database connection(s) from API`);
      } else {
        setDatabases([]);
        console.log("No database connections found");
      }
    } catch (error: any) {
      console.error("Error loading databases:", error);
      if (error.response?.status === 401) {
        toast.error("Authentication required. Please log in again.");
      } else {
        toast.error(error.response?.data?.error || "Failed to load database connections");
      }
      setDatabases([]);
    } finally {
      setLoading(false);
    }
  };


  const handleTest = async (dbId: string) => {
    setTestingId(dbId);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const db = databases.find((d) => d.id === dbId);
      if (!db) {
        toast.error("Database not found");
        setTestingId(null);
        return;
      }

      const apiBase = getApiBaseUrl();
      const response = await axios.post(
        `${apiBase}/api/admin/databases/${dbId}/test/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Refresh from server to get updated status and last_checked
        await loadDatabases();
        toast.success(`${db.name} connection test successful`);
      } else {
        // Refresh from server to get updated status
        await loadDatabases();
        toast.error(response.data.error || "Connection test failed");
      }
    } catch (error: any) {
      // Refresh from server to get updated status
      await loadDatabases();
      toast.error(error.response?.data?.error || error.response?.data?.message || "Connection test failed");
    } finally {
      setTestingId(null);
    }
  };

  const handleRefresh = async (dbId: string) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const apiBase = getApiBaseUrl();
      // TODO: Refresh stats
      // const response = await axios.post(
      //   `${apiBase}/api/admin/databases/${dbId}/refresh/`,
      //   {},
      //   { headers: { Authorization: `Bearer ${token}` } }
      // );

      toast.success("Database stats refreshed");
      loadDatabases();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to refresh stats");
    }
  };

  const handlePingDatabase = async (dbId: string) => {
    setLoadingPerformance((prev) => ({ ...prev, [dbId]: true }));
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const apiBase = getApiBaseUrl();
      // POST to gather and save new metrics
      const response = await axios.post(
        `${apiBase}/api/admin/databases/${dbId}/performance/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPerformanceData((prev) => ({
        ...prev,
        [dbId]: response.data,
      }));

      toast.success(`Performance metrics gathered and saved for ${databases.find((db) => db.id === dbId)?.name || 'database'}`);
    } catch (error: any) {
      console.error("Error pinging database:", error);
      toast.error(error.response?.data?.error || error.response?.data?.message || "Failed to gather performance metrics");
    } finally {
      setLoadingPerformance((prev) => ({ ...prev, [dbId]: false }));
    }
  };

  const loadPerformanceMetrics = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const apiBase = getApiBaseUrl();
      const metricsPromises = databases.map(async (db) => {
        try {
          const response = await axios.get(
            `${apiBase}/api/admin/databases/${db.id}/performance/`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (response.data) {
            return { dbId: db.id, data: response.data };
          }
        } catch (error) {
          // Silently fail for individual metrics
          console.warn(`Failed to load metrics for ${db.id}:`, error);
        }
        return null;
      });

      const results = await Promise.all(metricsPromises);
      const newPerformanceData: Record<string, any> = {};
      results.forEach((result) => {
        if (result) {
          newPerformanceData[result.dbId] = result.data;
        }
      });
      setPerformanceData(newPerformanceData);
    } catch (error) {
      console.error("Error loading performance metrics:", error);
    }
  };

  const handleTestNewConnection = async () => {
    setTestingConnection(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Authentication required");
        setTestingConnection(false);
        return;
      }

      // Validate required fields
      if (!connectionForm.host || !connectionForm.database_name || !connectionForm.username || !connectionForm.password) {
        toast.error("Please fill in all required fields (host, database, username, password)");
        setTestingConnection(false);
        return;
      }

      // Create a temporary connection to test
      const apiBase = getApiBaseUrl();
      const createResponse = await axios.post(
        `${apiBase}/api/admin/databases/`,
        {
          name: connectionForm.name || "Test Connection",
          engine: connectionForm.engine,
          host: connectionForm.host,
          port: parseInt(connectionForm.port.toString()),
          username: connectionForm.username,
          password: connectionForm.password,
          database_name: connectionForm.database_name,
          schema: connectionForm.schema || null,
          is_active: false, // Don't activate test connections
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const testConnectionId = createResponse.data.id;

      // Test the connection
      const testResponse = await axios.post(
        `${apiBase}/api/admin/databases/${testConnectionId}/test/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (testResponse.data.success) {
        toast.success("Connection test successful!");
        // Delete the test connection
        await axios.delete(
          `${apiBase}/api/admin/databases/${testConnectionId}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        toast.error(testResponse.data.error || "Connection test failed");
        // Delete the failed test connection
        await axios.delete(
          `${apiBase}/api/admin/databases/${testConnectionId}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (error: any) {
      console.error("Connection test error:", error);
      toast.error(error.response?.data?.error || error.response?.data?.message || "Connection test failed");
    } finally {
      setTestingConnection(false);
    }
  };

  const handleCreateConnection = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    console.log("handleCreateConnection called", connectionForm);
    
    setCreating(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Authentication required");
        setCreating(false);
        return;
      }

      // Validate required fields
      if (!connectionForm.name || !connectionForm.host || !connectionForm.database_name || !connectionForm.username || !connectionForm.password) {
        toast.error("Please fill in all required fields (name, host, database, username, password)");
        setCreating(false);
        return;
      }

      const apiBase = getApiBaseUrl();
      console.log("Creating connection with:", {
        name: connectionForm.name,
        engine: connectionForm.engine,
        host: connectionForm.host,
        port: parseInt(connectionForm.port.toString()),
        username: connectionForm.username,
        password: "***",
        database_name: connectionForm.database_name,
        schema: connectionForm.schema || null,
        is_active: connectionForm.is_active,
      });
      
      const response = await axios.post(
        `${apiBase}/api/admin/databases/`,
        {
          name: connectionForm.name,
          engine: connectionForm.engine,
          host: connectionForm.host,
          port: parseInt(connectionForm.port.toString()),
          username: connectionForm.username,
          password: connectionForm.password,
          database_name: connectionForm.database_name,
          schema: connectionForm.schema || null,
          is_active: connectionForm.is_active,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Connection created:", response.data);
      
      if (response.data) {
        toast.success("Database connection created successfully");
        setShowAddDialog(false);
        // Reset form
        setConnectionForm({
          name: "",
          engine: "postgresql",
          host: "localhost",
          port: 5432,
          username: "",
          password: "",
          database_name: "",
          schema: "",
          is_active: true,
        });
        // Reload databases to get the new connection with all settings from server
        await loadDatabases();
        // Also reload performance metrics if any
        await loadPerformanceMetrics();
      }
    } catch (error: any) {
      console.error("Error creating connection:", error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          "Failed to create database connection";
      toast.error(errorMessage);
    } finally {
      setCreating(false);
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
      case "testing":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-700">
            <Activity className="h-3 w-3 mr-1 animate-spin" />
            Testing
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

  const totalSize = databases.reduce(
    (acc, db) => acc + (db.stats?.size || 0),
    0
  );
  const totalTables = databases.reduce(
    (acc, db) => acc + (db.stats?.tables || 0),
    0
  );

  return (
    <div className={applyTheme.page()}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Database Management</h1>
        <p className="text-slate-600">
          Configure and manage database connections, monitor performance, and perform maintenance operations.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Databases</p>
                <p className="text-2xl font-bold text-slate-800">{databases.length}</p>
              </div>
              <Database className="h-8 w-8 text-palette-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Connected</p>
                <p className="text-2xl font-bold text-green-600">
                  {databases.filter((d) => d.status === "connected").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Size</p>
                <p className="text-2xl font-bold text-slate-800">
                  {formatBytes(totalSize)}
                </p>
              </div>
              <HardDrive className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Tables</p>
                <p className="text-2xl font-bold text-slate-800">{totalTables}</p>
              </div>
              <Server className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="connections" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Database Connections</CardTitle>
                  <CardDescription>
                    Manage database connection settings and credentials
                  </CardDescription>
                </div>
                <Button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Add Connection button clicked");
                    dialogOpeningRef.current = true;
                    setTimeout(() => {
                      setShowAddDialog(true);
                      setTimeout(() => {
                        dialogOpeningRef.current = false;
                      }, 100);
                    }, 0);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Connection
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-palette-primary mx-auto"></div>
                  <p className="text-slate-600 mt-4">Loading databases...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Stats</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {databases.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                          No database connections found. Click "Add Connection" to create one.
                        </TableCell>
                      </TableRow>
                    ) : (
                      databases.map((db) => {
                      return (
                        <TableRow key={db.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Database className="h-5 w-5 text-palette-primary" />
                              <div>
                                <div className="font-medium text-slate-800">
                                  {db.name}
                                  {db.isDefault && (
                                    <Badge className="ml-2 bg-blue-500">Default</Badge>
                                  )}
                                </div>
                                {db.lastChecked && (
                                  <div className="text-sm text-slate-500">
                                    Last checked: {new Date(db.lastChecked).toLocaleString()}
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getTypeBadge(db.type)}</TableCell>
                          <TableCell>{getStatusBadge(db.status)}</TableCell>
                          <TableCell>
                            {db.stats ? (
                              <div className="text-sm">
                                <div className="font-medium">
                                  {db.stats.tables} tables
                                </div>
                                <div className="text-slate-500">
                                  {formatBytes(db.stats.size)}
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-sm">N/A</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="default"
                                asChild
                              >
                                <Link href={`/workspace/databases/${db.id}`}>
                                  View Details
                                  <ArrowRight className="h-3 w-3 ml-1" />
                                </Link>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleTest(db.id)}
                                disabled={testingId === db.id}
                              >
                                <TestTube className="h-3 w-3 mr-1" />
                                {testingId === db.id ? "Testing..." : "Test"}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    }))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Monitor database performance, ping latency, and query statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {databases.map((db) => {
                  const perf = performanceData[db.id];
                  const isLoading = loadingPerformance[db.id];
                  
                  return (
                    <Card key={db.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{db.name}</CardTitle>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePingDatabase(db.id)}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <Activity className="h-4 w-4 mr-2 animate-spin" />
                                Pinging...
                              </>
                            ) : (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Ping Database
                              </>
                            )}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {isLoading ? (
                          <div className="text-center py-8">
                            <Activity className="h-8 w-8 mx-auto mb-2 animate-spin text-palette-primary" />
                            <p className="text-slate-500">Gathering performance metrics...</p>
                          </div>
                        ) : perf ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div>
                                <p className="text-sm text-slate-600">Ping Time</p>
                                <p className="text-xl font-bold text-slate-800">
                                  {perf.ping_time ? `${perf.ping_time} ms` : 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-slate-600">Query Time</p>
                                <p className="text-xl font-bold text-slate-800">
                                  {perf.query_time ? `${perf.query_time} ms` : 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-slate-600">Database Size</p>
                                <p className="text-xl font-bold text-slate-800">
                                  {perf.database_size ? formatBytes(perf.database_size) : 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-slate-600">Tables</p>
                                <p className="text-xl font-bold text-slate-800">
                                  {perf.table_count ?? 'N/A'}
                                </p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div>
                                <p className="text-sm text-slate-600">Indexes</p>
                                <p className="text-xl font-bold text-slate-800">
                                  {perf.index_count ?? 'N/A'}
                                </p>
                              </div>
                              {perf.connection_count !== null && perf.connection_count !== undefined && (
                                <div>
                                  <p className="text-sm text-slate-600">Active Connections</p>
                                  <p className="text-xl font-bold text-slate-800">
                                    {perf.connection_count}
                                  </p>
                                </div>
                              )}
                              {perf.cache_hit_ratio !== null && perf.cache_hit_ratio !== undefined && (
                                <div>
                                  <p className="text-sm text-slate-600">Cache Hit Ratio</p>
                                  <p className="text-xl font-bold text-slate-800">
                                    {perf.cache_hit_ratio}%
                                  </p>
                                </div>
                              )}
                              {perf.uptime && (
                                <div>
                                  <p className="text-sm text-slate-600">Uptime</p>
                                  <p className="text-xl font-bold text-slate-800">
                                    {perf.uptime}
                                  </p>
                                </div>
                              )}
                            </div>
                            {perf.version && (
                              <div className="pt-2 border-t">
                                <p className="text-sm text-slate-600">Database Version</p>
                                <p className="text-sm font-mono text-slate-700">{perf.version}</p>
                              </div>
                            )}
                            {perf.timestamp && (
                              <div className="text-xs text-slate-500">
                                Last updated: {new Date(perf.timestamp).toLocaleString()}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-slate-500">
                            <p>Click "Ping Database" to gather performance metrics</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Connection Dialog */}
      <Dialog 
        open={showAddDialog} 
        onOpenChange={(open) => {
          console.log("Dialog onOpenChange triggered:", open, "dialogOpeningRef:", dialogOpeningRef.current);
          // Prevent closing if we're in the process of opening
          if (!open && dialogOpeningRef.current) {
            console.log("Preventing dialog close during opening");
            return;
          }
          setShowAddDialog(open);
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Database Connection</DialogTitle>
              <DialogDescription>
                Create a new database connection profile. Passwords will be encrypted securely.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Connection Name *</Label>
                <Input
                  id="name"
                  value={connectionForm.name}
                  onChange={(e) =>
                    setConnectionForm({ ...connectionForm, name: e.target.value })
                  }
                  placeholder="e.g., Production DB"
                  required
                />
              </div>
              <div>
                <Label htmlFor="engine">Database Type *</Label>
                <Select
                  value={connectionForm.engine}
                  onValueChange={(value: "postgresql" | "mysql" | "sqlite") => {
                    setConnectionForm({
                      ...connectionForm,
                      engine: value,
                      port: value === "postgresql" ? 5432 : value === "mysql" ? 3306 : 0,
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="postgresql">PostgreSQL</SelectItem>
                    <SelectItem value="mysql">MySQL</SelectItem>
                    <SelectItem value="sqlite">SQLite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="host">Host *</Label>
                <Input
                  id="host"
                  value={connectionForm.host}
                  onChange={(e) =>
                    setConnectionForm({ ...connectionForm, host: e.target.value })
                  }
                  placeholder="localhost"
                  required
                />
              </div>
              <div>
                <Label htmlFor="port">Port *</Label>
                <Input
                  id="port"
                  type="number"
                  value={connectionForm.port}
                  onChange={(e) =>
                    setConnectionForm({
                      ...connectionForm,
                      port: parseInt(e.target.value) || 5432,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="database_name">Database Name *</Label>
              <Input
                id="database_name"
                value={connectionForm.database_name}
                onChange={(e) =>
                  setConnectionForm({ ...connectionForm, database_name: e.target.value })
                }
                placeholder="database_name"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  value={connectionForm.username}
                  onChange={(e) =>
                    setConnectionForm({ ...connectionForm, username: e.target.value })
                  }
                  placeholder="postgres"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={connectionForm.password}
                    onChange={(e) =>
                      setConnectionForm({ ...connectionForm, password: e.target.value })
                    }
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="schema">Schema (Optional)</Label>
              <Input
                id="schema"
                value={connectionForm.schema}
                onChange={(e) =>
                  setConnectionForm({ ...connectionForm, schema: e.target.value })
                }
                placeholder="public"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_active"
                checked={connectionForm.is_active}
                onChange={(e) =>
                  setConnectionForm({ ...connectionForm, is_active: e.target.checked })
                }
                className="rounded border-gray-300"
              />
              <Label htmlFor="is_active" className="cursor-pointer">
                Active (connection will be available for use)
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddDialog(false);
                setConnectionForm({
                  name: "",
                  engine: "postgresql",
                  host: "localhost",
                  port: 5432,
                  username: "",
                  password: "",
                  database_name: "",
                  schema: "",
                  is_active: true,
                });
              }}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleTestNewConnection();
              }}
              variant="outline"
              disabled={creating || testingConnection}
            >
              <TestTube className="h-4 w-4 mr-2" />
              {testingConnection ? "Testing..." : "Test Connection"}
            </Button>
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleCreateConnection(e);
              }}
              disabled={creating || testingConnection}
            >
              {creating ? (
                <>
                  <Activity className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Connection
                </>
              )}
            </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </div>
  );
}

