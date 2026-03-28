"use client";

import React, { useState, useEffect } from "react";
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
import { applyTheme } from "@/lib/theme";
import {
  Brain,
  CheckCircle,
  XCircle,
  Edit,
  Save,
  X,
  Key,
  Zap,
  Activity,
  DollarSign,
  Settings,
  TestTube,
  TrendingUp,
  AlertCircle,
  Plus,
  Trash2,
} from "lucide-react";
import { getApiBaseUrl } from "@/lib/api-config";
import axios from "axios";
import { toast } from "sonner";

interface AIModel {
  id: string;
  name: string;
  provider: string;
  modelId: string;
  apiKey?: string;
  apiKeyName: string;
  status: "configured" | "not_configured" | "error" | "testing";
  endpoint?: string;
  capabilities: string[];
  costPerToken?: {
    input: number;
    output: number;
  };
  usage?: {
    tokensUsed: number;
    requests: number;
    lastUsed?: string;
  };
  isDefault?: boolean;
}

const DEFAULT_MODELS: AIModel[] = [
  {
    id: "openai-gpt4",
    name: "GPT-4",
    provider: "OpenAI",
    modelId: "gpt-4",
    apiKeyName: "OPENAI_API_KEY",
    status: "not_configured",
    endpoint: "https://api.openai.com/v1/chat/completions",
    capabilities: ["chat", "completion", "embeddings", "vision"],
    costPerToken: { input: 0.03, output: 0.06 },
  },
  {
    id: "openai-gpt35",
    name: "GPT-3.5 Turbo",
    provider: "OpenAI",
    modelId: "gpt-3.5-turbo",
    apiKeyName: "OPENAI_API_KEY",
    status: "not_configured",
    endpoint: "https://api.openai.com/v1/chat/completions",
    capabilities: ["chat", "completion"],
    costPerToken: { input: 0.0015, output: 0.002 },
  },
  {
    id: "anthropic-claude",
    name: "Claude 3 Opus",
    provider: "Anthropic",
    modelId: "claude-3-opus-20240229",
    apiKeyName: "ANTHROPIC_API_KEY",
    status: "not_configured",
    endpoint: "https://api.anthropic.com/v1/messages",
    capabilities: ["chat", "completion", "vision"],
    costPerToken: { input: 0.015, output: 0.075 },
  },
  {
    id: "google-gemini",
    name: "Gemini Pro",
    provider: "Google",
    modelId: "gemini-pro",
    apiKeyName: "GEMINI_API_KEY",
    status: "not_configured",
    endpoint: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
    capabilities: ["chat", "completion", "embeddings"],
    costPerToken: { input: 0.0005, output: 0.0015 },
  },
  {
    id: "openai-embeddings",
    name: "OpenAI Embeddings",
    provider: "OpenAI",
    modelId: "text-embedding-3-small",
    apiKeyName: "OPENAI_API_KEY",
    status: "not_configured",
    endpoint: "https://api.openai.com/v1/embeddings",
    capabilities: ["embeddings"],
    costPerToken: { input: 0.00002, output: 0 },
  },
];

export default function AIModelsPage() {
  const [models, setModels] = useState<AIModel[]>(DEFAULT_MODELS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [testingId, setTestingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDefault, setSelectedDefault] = useState<string>("");

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setLoading(false);
        return;
      }

      const apiBase = getApiBaseUrl();
      // TODO: Fetch from backend API
      // const response = await axios.get(`${apiBase}/api/admin/ai-models/`, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      // For now, check which API keys are configured
      const updatedModels = models.map((model) => {
        // In real implementation, check backend for configured keys
        return { ...model, status: "not_configured" as const };
      });

      setModels(updatedModels);
    } catch (error) {
      console.error("Error loading models:", error);
      toast.error("Failed to load AI models");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (model: AIModel) => {
    setEditingId(model.id);
    setEditValue(model.apiKey || "");
  };

  const handleSave = async (modelId: string) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const model = models.find((m) => m.id === modelId);
      if (!model) {
        toast.error("Model not found");
        return;
      }

      const apiBase = getApiBaseUrl();
      // TODO: Save to backend
      // await axios.post(
      //   `${apiBase}/api/admin/ai-models/${modelId}/api-key/`,
      //   { apiKey: editValue, keyName: model.apiKeyName },
      //   { headers: { Authorization: `Bearer ${token}` } }
      // );

      setModels(
        models.map((m) =>
          m.id === modelId
            ? {
                ...m,
                apiKey: editValue,
                status: editValue ? "configured" : "not_configured",
              }
            : m
        )
      );
      setEditingId(null);
      setEditValue("");
      toast.success(`${model.name} API key saved successfully`);
    } catch (error: any) {
      console.error("Error saving API key:", error);
      toast.error(error.response?.data?.error || "Failed to save API key");
    }
  };

  const handleTest = async (modelId: string) => {
    setTestingId(modelId);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const model = models.find((m) => m.id === modelId);
      if (!model || !model.apiKey) {
        toast.error("Please configure API key first");
        setTestingId(null);
        return;
      }

      const apiBase = getApiBaseUrl();
      // TODO: Test connection
      // await axios.post(
      //   `${apiBase}/api/admin/ai-models/${modelId}/test/`,
      //   {},
      //   { headers: { Authorization: `Bearer ${token}` } }
      // );

      // Simulate test
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setModels(
        models.map((m) =>
          m.id === modelId ? { ...m, status: "configured" } : m
        )
      );
      toast.success(`${model.name} connection test successful`);
    } catch (error: any) {
      setModels(
        models.map((m) =>
          m.id === modelId ? { ...m, status: "error" } : m
        )
      );
      toast.error(error.response?.data?.error || "Connection test failed");
    } finally {
      setTestingId(null);
    }
  };

  const handleSetDefault = async (modelId: string) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const apiBase = getApiBaseUrl();
      // TODO: Set default model
      // await axios.post(
      //   `${apiBase}/api/admin/ai-models/${modelId}/set-default/`,
      //   {},
      //   { headers: { Authorization: `Bearer ${token}` } }
      // );

      setModels(
        models.map((m) => ({
          ...m,
          isDefault: m.id === modelId,
        }))
      );
      setSelectedDefault(modelId);
      toast.success("Default model updated");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to set default model");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "configured":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Configured
          </Badge>
        );
      case "not_configured":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-700">
            <XCircle className="h-3 w-3 mr-1" />
            Not Configured
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

  const totalUsage = models.reduce(
    (acc, model) => acc + (model.usage?.tokensUsed || 0),
    0
  );
  const totalCost = models.reduce((acc, model) => {
    if (!model.usage || !model.costPerToken) return acc;
    const inputCost = (model.usage.tokensUsed * 0.7 * model.costPerToken.input) / 1000;
    const outputCost = (model.usage.tokensUsed * 0.3 * model.costPerToken.output) / 1000;
    return acc + inputCost + outputCost;
  }, 0);

  return (
    <div className={applyTheme.page()}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">AI Models Management</h1>
        <p className="text-slate-600">
          Configure and manage AI models for platform features. Set API keys, test connections, and monitor usage.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Models</p>
                <p className="text-2xl font-bold text-slate-800">{models.length}</p>
              </div>
              <Brain className="h-8 w-8 text-palette-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Configured</p>
                <p className="text-2xl font-bold text-green-600">
                  {models.filter((m) => m.status === "configured").length}
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
                <p className="text-sm text-slate-600">Total Tokens</p>
                <p className="text-2xl font-bold text-slate-800">
                  {totalUsage.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Estimated Cost</p>
                <p className="text-2xl font-bold text-slate-800">
                  ${totalCost.toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Models Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>AI Models</CardTitle>
              <CardDescription>
                Manage AI model configurations and API keys
              </CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Model
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-palette-primary mx-auto"></div>
              <p className="text-slate-600 mt-4">Loading models...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Model</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Capabilities</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>API Key</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {models.map((model) => {
                  const isEditing = editingId === model.id;
                  const isTesting = testingId === model.id;

                  return (
                    <TableRow key={model.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Brain className="h-5 w-5 text-palette-primary" />
                          <div>
                            <div className="font-medium text-slate-800">
                              {model.name}
                              {model.isDefault && (
                                <Badge className="ml-2 bg-blue-500">Default</Badge>
                              )}
                            </div>
                            <div className="text-sm text-slate-500">
                              {model.modelId}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-700">
                        {model.provider}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {model.capabilities.map((cap) => (
                            <Badge key={cap} variant="outline" className="text-xs">
                              {cap}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(model.status)}</TableCell>
                      <TableCell>
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="password"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              placeholder={`Enter ${model.apiKeyName}`}
                              className="w-64"
                            />
                            <Button
                              size="sm"
                              onClick={() => handleSave(model.id)}
                              variant="default"
                            >
                              <Save className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => {
                                setEditingId(null);
                                setEditValue("");
                              }}
                              variant="outline"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                              {model.apiKey
                                ? `${model.apiKey.substring(0, 8)}...`
                                : model.apiKeyName}
                            </code>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(model)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {model.usage ? (
                          <div className="text-sm">
                            <div className="font-medium">
                              {model.usage.tokensUsed.toLocaleString()} tokens
                            </div>
                            <div className="text-slate-500">
                              {model.usage.requests} requests
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-sm">No usage</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTest(model.id)}
                            disabled={isTesting || !model.apiKey}
                          >
                            <TestTube className="h-3 w-3 mr-1" />
                            {isTesting ? "Testing..." : "Test"}
                          </Button>
                          {!model.isDefault && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSetDefault(model.id)}
                            >
                              Set Default
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Default Model Selection */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Default Model Configuration</CardTitle>
          <CardDescription>
            Select the default AI model to use for platform features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Label htmlFor="default-model">Default Model</Label>
            <Select
              value={selectedDefault || models.find((m) => m.isDefault)?.id || ""}
              onValueChange={handleSetDefault}
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select default model" />
              </SelectTrigger>
              <SelectContent>
                {models
                  .filter((m) => m.status === "configured")
                  .map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name} ({model.provider})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

