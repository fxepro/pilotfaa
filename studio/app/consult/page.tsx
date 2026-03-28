"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SimpleHeroSection } from "@/components/simple-hero-section";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  MessageCircle, 
  Code,
  Database,
  Users,
  Shield,
  Settings,
  Layers,
  Rocket,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Zap,
  Server,
  Cpu,
  Calendar,
  Phone,
  Mail,
  MapPin,
  FileText,
  Upload,
  Clock,
  Award,
  Target,
  Star
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? (typeof window !== 'undefined' ? '' : 'http://localhost:8000');

export default function ConsultPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    service: "",
    budget: "",
    timeline: "",
    priority: "",
    message: "",
    files: [] as File[],
    needs: [] as string[],
    currentStack: "",
    goals: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({ ...prev, files: [...prev.files, ...files] }));
  };

  const handleNeedToggle = (need: string) => {
    setFormData(prev => ({
      ...prev,
      needs: prev.needs.includes(need)
        ? prev.needs.filter(n => n !== need)
        : [...prev.needs, need]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Send to Django backend
      const response = await fetch(`${API_BASE}/api/consultation/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          currentTools: formData.currentStack, // Map currentStack to currentTools for backend
          issues: formData.needs, // Map needs to issues for backend
        }),
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        toast({
          title: "Consultation Request Submitted",
          description: "We'll get back to you within 24 hours with next steps.",
        });
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          company: "",
          phone: "",
          service: "",
          budget: "",
          timeline: "",
          priority: "",
          message: "",
          files: [],
          needs: [],
          currentStack: "",
          goals: ""
        });
      } else {
        throw new Error(result.error || 'Failed to submit consultation request');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit consultation request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <SimpleHeroSection
        title="Get Expert Help with Admin Rodeo"
        subtitle="Professional consultation and implementation services for the Admin Rodeo platform. Let our experts help you build faster, customize effectively, and deploy with confidence."
      />
      {/* Additional badges section */}
      <section className="py-8 px-4 bg-slate-50 border-b">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="border-palette-primary/40 text-slate-700 bg-white px-4 py-2">
              <Award className="h-4 w-4 mr-2" />
              Expert Guidance
            </Badge>
            <Badge variant="outline" className="border-palette-primary/40 text-slate-700 bg-white px-4 py-2">
              <Clock className="h-4 w-4 mr-2" />
              24hr Response
            </Badge>
            <Badge variant="outline" className="border-palette-primary/40 text-slate-700 bg-white px-4 py-2">
              <Shield className="h-4 w-4 mr-2" />
              Proven Platform
            </Badge>
          </div>
        </div>
      </section>
      
      {/* Service Offerings */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Consulting Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive services to help you get the most out of the Admin Rodeo platform foundation
            </p>
          </div>

          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {/* Platform Implementation */}
            <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl bg-gradient-to-br from-white to-slate-50 transition-all duration-500 transform hover:-translate-y-2" style={{ boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-palette-accent-1/5 to-palette-accent-1/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-8 relative z-10">
                <div className="mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-palette-accent-1 to-palette-accent-1 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Rocket className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-800">Platform Implementation</h3>
                  <p className="text-slate-600 mb-4">
                    Get your Admin Rodeo platform up and running quickly with expert setup, configuration, and deployment assistance.
                  </p>
                </div>
                <ul className="space-y-2 text-sm text-slate-500">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-accent-1" />
                    Initial setup and configuration
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-accent-1" />
                    Database schema setup
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-accent-1" />
                    Deployment and hosting guidance
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-accent-1" />
                    Best practices implementation
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Customization & Development */}
            <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl bg-gradient-to-br from-white to-slate-50 transition-all duration-500 transform hover:-translate-y-2" style={{ boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-palette-accent-2/5 to-palette-accent-2/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-8 relative z-10">
                <div className="mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-palette-accent-2 to-palette-accent-2 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Code className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-800">Customization & Development</h3>
                  <p className="text-slate-600 mb-4">
                    Extend the platform with custom features, modules, and integrations tailored to your specific business needs.
                  </p>
                </div>
                <ul className="space-y-2 text-sm text-slate-500">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-accent-2" />
                    Custom module development
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-accent-2" />
                    API integrations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-accent-2" />
                    UI/UX customization
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-accent-2" />
                    Feature enhancements
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* User Management & Security */}
            <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl bg-gradient-to-br from-white to-slate-50 transition-all duration-500 transform hover:-translate-y-2" style={{ boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-palette-accent-1/5 to-palette-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-8 relative z-10">
                <div className="mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-palette-accent-1 to-palette-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-800">User Management & Security</h3>
                  <p className="text-slate-600 mb-4">
                    Expert guidance on implementing RBAC, authentication flows, permissions, and security best practices.
                  </p>
                </div>
                <ul className="space-y-2 text-sm text-slate-500">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-accent-1" />
                    RBAC implementation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-accent-1" />
                    Authentication setup
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-accent-1" />
                    Permission system design
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-accent-1" />
                    Security hardening
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Training & Onboarding */}
            <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl bg-gradient-to-br from-white to-slate-50 transition-all duration-500 transform hover:-translate-y-2" style={{ boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-palette-accent-3/5 to-palette-accent-2/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-8 relative z-10">
                <div className="mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-palette-accent-3 to-palette-accent-2 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <BookOpen className="h-8 w-8 text-palette-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-800">Training & Onboarding</h3>
                  <p className="text-slate-600 mb-4">
                    Comprehensive training programs to get your team up to speed with the Admin Rodeo platform quickly.
                  </p>
                </div>
                <ul className="space-y-2 text-sm text-slate-500">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-accent-3" />
                    Platform overview and navigation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-accent-3" />
                    Development best practices
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-accent-3" />
                    Customization techniques
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-accent-3" />
                    Ongoing support and mentoring
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Migration & Integration */}
            <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl bg-gradient-to-br from-white to-slate-50 transition-all duration-500 transform hover:-translate-y-2" style={{ boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-palette-secondary/5 to-palette-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-8 relative z-10">
                <div className="mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-palette-secondary to-palette-secondary-hover flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Database className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-800">Migration & Integration</h3>
                  <p className="text-slate-600 mb-4">
                    Migrate existing applications or integrate Admin Rodeo with your current tech stack seamlessly.
                  </p>
                </div>
                <ul className="space-y-2 text-sm text-slate-500">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-secondary" />
                    Data migration assistance
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-secondary" />
                    Third-party integrations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-secondary" />
                    Legacy system integration
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-palette-secondary" />
                    API connection setup
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Architecture & Scaling */}
            <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl bg-gradient-to-br from-white to-slate-50 transition-all duration-500 transform hover:-translate-y-2" style={{ boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-8 relative z-10">
                <div className="mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Server className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-800">Architecture & Scaling</h3>
                  <p className="text-slate-600 mb-4">
                    Design scalable architectures and optimize performance for growing applications built on Admin Rodeo.
                  </p>
                </div>
                <ul className="space-y-2 text-sm text-slate-500">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-red-500" />
                    Scalability planning
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-red-500" />
                    Performance optimization
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-red-500" />
                    Infrastructure design
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-red-500" />
                    Load testing and monitoring
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Consultation Form */}
      <section id="consultation-form" className="py-16 px-4 bg-gradient-to-br from-slate-50 to-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Request Your Consultation
            </h2>
            <p className="text-xl text-gray-600">
              Tell us about your project and we'll help you get started with Admin Rodeo
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Consultation Form */}
            <div>
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Consultation Request Form</CardTitle>
                  <CardDescription className="text-center">
                    Fill out the form below and we'll get back to you within 24 hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Service Selection */}
                <div>
                  <Label htmlFor="service">Service Needed *</Label>
                  <Select value={formData.service} onValueChange={(value) => handleInputChange("service", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="platform-implementation">Platform Implementation</SelectItem>
                      <SelectItem value="customization-development">Customization & Development</SelectItem>
                      <SelectItem value="user-management-security">User Management & Security</SelectItem>
                      <SelectItem value="training-onboarding">Training & Onboarding</SelectItem>
                      <SelectItem value="migration-integration">Migration & Integration</SelectItem>
                      <SelectItem value="architecture-scaling">Architecture & Scaling</SelectItem>
                      <SelectItem value="custom">Custom Package</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Budget and Timeline */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="budget">Budget Range</Label>
                    <Select value={formData.budget} onValueChange={(value) => handleInputChange("budget", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                        <SelectItem value="1000-5000">$1,000 - $5,000</SelectItem>
                        <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                        <SelectItem value="10000+">$10,000+</SelectItem>
                        <SelectItem value="custom">Custom pricing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="timeline">Timeline</Label>
                    <Select value={formData.timeline} onValueChange={(value) => handleInputChange("timeline", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate (ASAP)</SelectItem>
                        <SelectItem value="1week">1 week</SelectItem>
                        <SelectItem value="2-4weeks">2-4 weeks</SelectItem>
                        <SelectItem value="1-3months">1-3 months</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Priority Level */}
                <div>
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select priority level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgent">Urgent (within 24 hours)</SelectItem>
                      <SelectItem value="high">High (within 1 week)</SelectItem>
                      <SelectItem value="medium">Medium (within 1 month)</SelectItem>
                      <SelectItem value="low">Low (flexible timeline)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Platform Needs */}
                <div>
                  <Label>Platform Needs (Select all that apply)</Label>
                  <div className="grid md:grid-cols-2 gap-3 mt-3">
                    {[
                      "User management setup",
                      "RBAC implementation",
                      "Custom module development",
                      "API integration",
                      "Database migration",
                      "Security hardening",
                      "UI/UX customization",
                      "Performance optimization",
                      "Training & documentation",
                      "Ongoing support"
                    ].map((need) => (
                      <div key={need} className="flex items-center space-x-2">
                        <Checkbox
                          id={need}
                          checked={formData.needs.includes(need)}
                          onCheckedChange={() => handleNeedToggle(need)}
                        />
                        <Label htmlFor={need} className="text-sm">{need}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Goals and Current Stack */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="goals">What are your main goals?</Label>
                    <Textarea
                      id="goals"
                      value={formData.goals}
                      onChange={(e) => handleInputChange("goals", e.target.value)}
                      className="mt-1"
                      rows={3}
                      placeholder="e.g., Build a SaaS application, Migrate existing system, etc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="currentStack">Current tech stack</Label>
                    <Textarea
                      id="currentStack"
                      value={formData.currentStack}
                      onChange={(e) => handleInputChange("currentStack", e.target.value)}
                      className="mt-1"
                      rows={3}
                      placeholder="e.g., Django, React, PostgreSQL, etc."
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <Label htmlFor="message">Additional Details *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    required
                    className="mt-1"
                    rows={4}
                    placeholder="Describe your project, what you're trying to build, and how we can help..."
                  />
                </div>

                {/* File Upload */}
                <div>
                  <Label htmlFor="files">Upload Project Documents (Optional)</Label>
                  <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Drag and drop files here, or click to select
                    </p>
                    <Input
                      id="files"
                      type="file"
                      multiple
                      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('files')?.click()}
                    >
                      Choose Files
                    </Button>
                    {formData.files.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">Selected files:</p>
                        {formData.files.map((file, index) => (
                          <p key={index} className="text-xs text-gray-500">{file.name}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-palette-accent-1 to-palette-primary hover:from-palette-primary hover:to-palette-primary-hover text-white px-8 py-3 text-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Clock className="h-5 w-5 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <MessageCircle className="h-5 w-5 mr-2" />
                        Submit Consultation Request
                      </>
                    )}
                  </Button>
                </div>
              </form>
                </CardContent>
              </Card>
            </div>

            {/* Calendar Booking */}
            <div>
              <Card className="shadow-xl sticky top-8">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-palette-primary" />
                    Book Appointment
                  </CardTitle>
                  <CardDescription>
                    Schedule a consultation call at your convenience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-gradient-to-br from-palette-accent-3 to-palette-accent-3 rounded-lg">
                      <Calendar className="h-12 w-12 text-palette-primary mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Schedule Your Call</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Choose a time that works best for you. We'll send you a calendar invite with meeting details.
                      </p>
                      <Button className="w-full bg-gradient-to-r from-palette-accent-1 to-palette-primary hover:from-palette-primary hover:to-palette-primary-hover text-white">
                        <Calendar className="h-4 w-4 mr-2" />
                        Open Calendar
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Available Times</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span>Monday - Friday</span>
                          <span className="text-palette-primary font-medium">9 AM - 6 PM</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span>Saturday</span>
                          <span className="text-palette-primary font-medium">10 AM - 4 PM</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span>Sunday</span>
                          <span className="text-gray-400">Closed</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-semibold text-gray-900 mb-3">Meeting Options</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-green-600" />
                          <span>Phone Call</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4 text-palette-accent-1" />
                          <span>Video Conference</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-palette-primary" />
                          <span>In-Person (Local)</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-semibold text-gray-900 mb-2">Quick Contact</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>(555) 123-4567</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>consult@adminrodeo.com</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600">
              Success stories from teams using Admin Rodeo platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                company: "TechStart Inc.",
                rating: 5,
                text: "The implementation support was incredible. We had our admin panel up and running in just 2 days, and the customization guidance helped us build exactly what we needed.",
                improvement: "2 days to launch"
              },
              {
                name: "Mike Chen",
                company: "E-commerce Plus",
                rating: 5,
                text: "Professional, knowledgeable, and delivered exactly what they promised. The RBAC implementation was seamless and the training got our team productive immediately.",
                improvement: "Seamless RBAC setup"
              },
              {
                name: "Emily Rodriguez",
                company: "Digital Agency",
                rating: 5,
                text: "Outstanding service! They helped us customize the platform for our agency's needs and provided training that actually made sense. Highly recommend!",
                improvement: "Customized in 1 week"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                  <div className="border-t pt-4">
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.company}</p>
                    <Badge variant="outline" className="mt-2 text-green-600 border-green-200">
                      {testimonial.improvement}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-slate-50 to-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Common questions about our consulting services
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                question: "How quickly will I receive my consultation?",
                answer: "We respond to all consultation requests within 24 hours. For urgent requests, we can often provide initial feedback within 4-6 hours during business hours."
              },
              {
                question: "What information do I need to provide?",
                answer: "The more information you can provide about your project goals, current tech stack, and specific needs, the better we can help. This includes project requirements, timeline, budget, and any existing systems you need to integrate with."
              },
              {
                question: "Do you work with all types of applications?",
                answer: "Yes! Admin Rodeo is designed to work as a foundation for any type of application - SaaS platforms, e-commerce, content management, internal tools, and more. Our consulting services help you adapt it to your specific use case."
              },
              {
                question: "What if I'm not satisfied with the consultation?",
                answer: "We offer a 100% satisfaction guarantee. If you're not completely satisfied with our guidance and recommendations, we'll provide a full refund or additional consultation at no extra cost."
              },
              {
                question: "Can you help with ongoing development?",
                answer: "Absolutely! We offer ongoing support packages that include regular check-ins, development assistance, code reviews, and continuous guidance to keep your project on track."
              },
              {
                question: "What's included in Platform Implementation?",
                answer: "Our Platform Implementation service includes initial setup, database configuration, deployment guidance, best practices implementation, and a complete walkthrough of the platform features. It's perfect for getting started quickly."
              },
              {
                question: "Do you provide training for my development team?",
                answer: "Yes! We offer comprehensive training sessions including platform overview, development best practices, customization techniques, and hands-on workshops. We can train your team on how to effectively use and extend the Admin Rodeo platform."
              },
              {
                question: "How much does a consultation cost?",
                answer: "Our consultation pricing varies based on the scope and complexity of your needs. We offer flexible packages from basic guidance to comprehensive implementation support. Contact us for a custom quote based on your specific requirements."
              },
              {
                question: "Can you help migrate from another admin system?",
                answer: "Absolutely! Migration assistance is one of our core services. We help with data migration, feature mapping, user migration, and ensuring a smooth transition to the Admin Rodeo platform."
              },
              {
                question: "What technologies does Admin Rodeo support?",
                answer: "Admin Rodeo is built on Django (backend) and Next.js (frontend), with PostgreSQL support. It's designed to integrate with modern tech stacks and can be customized to work with various databases, APIs, and third-party services."
              }
            ].map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-palette-primary to-palette-secondary text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Build Your Application Faster?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Get expert guidance and start building on the Admin Rodeo platform foundation today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-palette-primary hover:bg-palette-accent-3" asChild>
              <Link href="#consultation-form">
                <MessageCircle className="h-5 w-5 mr-2" />
                Start Free Consultation
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link href="/workspace">
                <Rocket className="h-5 w-5 mr-2" />
                Explore Platform
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
