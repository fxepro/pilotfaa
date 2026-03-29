"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, CheckCircle, Loader2, ArrowLeft, Lock, Shield, UserPlus } from "lucide-react";
import axios from "axios";
import {
  PILOTFAA_DEFAULT_CHECKOUT_DISPLAY,
  PILOTFAA_DEFAULT_CHECKOUT_PLAN,
  pilotfaaCheckoutCourseDisplay,
  pilotfaaCheckoutIntroPrice,
  pilotfaaCheckoutRegularPrice,
} from "@/lib/pilotfaa-marketing";

// Use relative URL in production (browser), localhost in dev (SSR)
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? (typeof window !== 'undefined' ? 'http://localhost:8000' : 'http://localhost:8000');

interface PlanInfo {
  name: string;
  price: number;
  billingPeriod: 'monthly' | 'annual';
  /** Strikethrough “regular” list price for display (introductory checkout only). */
  listPrice?: number;
}

interface DealInfo {
  id: number;
  name: string;
  slug: string;
  description: string;
  base_plan: {
    name: string;
    display_name: string;
  };
  discount_percentage: number;
  original_price: number;
  deal_price: number;
  billing_period: 'monthly' | 'annual';
  start_date: string;
  end_date: string;
  badge_text: string;
  is_valid: boolean;
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [plan, setPlan] = useState<PlanInfo | null>(null);
  const [deal, setDeal] = useState<DealInfo | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [loading, setLoading] = useState(false);
  const [paypalLoading, setPaypalLoading] = useState(false);
  const [coinbaseLoading, setCoinbaseLoading] = useState(false);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("paypal");
  const [paypalError, setPaypalError] = useState<string | null>(null);
  const [coinbaseError, setCoinbaseError] = useState<string | null>(null);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const [paypalSDKLoaded, setPaypalSDKLoaded] = useState(false);
  const [sessionResolved, setSessionResolved] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [regForm, setRegForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    if (!token) {
      setIsAuthenticated(false);
      setSessionResolved(true);
      return;
    }

    axios
      .get(`${API_BASE}/api/user-info/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setIsAuthenticated(true);
        setSessionResolved(true);
      })
      .catch(async (err) => {
        if (err.response?.status === 401 && refreshToken) {
          try {
            const res = await axios.post(`${API_BASE}/api/token/refresh/`, {
              refresh: refreshToken,
            });
            const newAccessToken = res.data.access;
            localStorage.setItem("access_token", newAccessToken);
            if (res.data.refresh) {
              localStorage.setItem("refresh_token", res.data.refresh);
            }
            setIsAuthenticated(true);
            setSessionResolved(true);
          } catch {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            setIsAuthenticated(false);
            setSessionResolved(true);
          }
        } else {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          setIsAuthenticated(false);
          setSessionResolved(true);
        }
      });
  }, []);

  useEffect(() => {
    const dealSlug = searchParams.get("deal");

    if (dealSlug) {
      axios
        .get(`${API_BASE}/api/deals/${dealSlug}/`)
        .then((response) => {
          const dealData = response.data;
          if (!dealData.is_valid) {
            alert("This deal is no longer available");
            router.push("/courses");
            return;
          }
          setDeal(dealData);
          setBillingPeriod(dealData.billing_period);
          setPlan({
            name: dealData.base_plan.name,
            price: dealData.deal_price,
            billingPeriod: dealData.billing_period,
          });
        })
        .catch(() => {
          alert("Deal not found. Redirecting to courses.");
          router.push("/courses");
        });
      return;
    }

    setDeal(null);
    const planName = searchParams.get("plan");
    const priceParam = searchParams.get("price");

    if (planName && priceParam) {
      const listParam = searchParams.get("list");
      setPlan({
        name: planName,
        price: parseFloat(priceParam),
        listPrice: listParam ? parseFloat(listParam) : undefined,
        billingPeriod: "monthly",
      });
      return;
    }

    const storedPlan =
      typeof window !== "undefined" ? sessionStorage.getItem("selectedPlan") : null;
    if (storedPlan) {
      setPlan(JSON.parse(storedPlan));
      return;
    }

    const cs = searchParams.get("course");
    setPlan({
      name: PILOTFAA_DEFAULT_CHECKOUT_PLAN.planName,
      price: pilotfaaCheckoutIntroPrice(cs),
      listPrice: pilotfaaCheckoutRegularPrice(cs),
      billingPeriod: "monthly",
    });
  }, [searchParams, router]);

  const handleCheckoutRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    if (regForm.password !== regForm.confirmPassword) {
      setRegError("Passwords do not match");
      return;
    }
    if (regForm.password.length < 8) {
      setRegError("Password must be at least 8 characters");
      return;
    }
    setRegLoading(true);
    try {
      await axios.post(`${API_BASE}/api/register/`, {
        username: regForm.username,
        email: regForm.email,
        password: regForm.password,
        first_name: regForm.first_name,
        last_name: regForm.last_name,
        role: "student",
      });
      const loginRes = await axios.post(`${API_BASE}/api/token/`, {
        username: regForm.username,
        password: regForm.password,
      });
      localStorage.setItem("access_token", loginRes.data.access);
      localStorage.setItem("refresh_token", loginRes.data.refresh);
      setIsAuthenticated(true);
    } catch (err: unknown) {
      const ax = err as {
        response?: { data?: Record<string, unknown> & { error?: string; message?: string } };
      };
      const d = ax.response?.data;
      if (d?.error) setRegError(String(d.error));
      else if (d?.username) setRegError("Username already exists. Try another or sign in.");
      else if (d?.email) setRegError("Email already registered. Sign in instead.");
      else setRegError(d?.message || "Registration failed. Try again.");
    } finally {
      setRegLoading(false);
    }
  };

  // Handle Coinbase payment
  const handleCoinbasePayment = useCallback(async () => {
    if (!plan) {
      setCoinbaseError('Plan information is missing');
      return;
    }

    setCoinbaseLoading(true);
    setCoinbaseError(null);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setCoinbaseError('Authentication required. Please log in again.');
        router.push("/workspace/login");
        return;
      }

      const planName = deal ? deal.base_plan.name : plan.name;
      const billingPeriodValue = deal ? deal.billing_period : billingPeriod;

      // Create Coinbase charge
      const response = await axios.post(
        `${API_BASE}/api/payments/coinbase/create-charge`,
        {
          plan_name: planName,
          billing_period: billingPeriodValue,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const { hosted_url, charge_id } = response.data;

      if (!hosted_url) {
        setCoinbaseError('Failed to get payment URL from Coinbase');
        setCoinbaseLoading(false);
        return;
      }

      // Store charge info for return handling
      sessionStorage.setItem('coinbase_charge_id', charge_id);
      sessionStorage.setItem('coinbase_plan_name', planName);

      // Redirect to Coinbase checkout
      window.location.href = hosted_url;
    } catch (error: any) {
      console.error('Coinbase payment error:', error);
      setCoinbaseError(
        error.response?.data?.error || 
        'Failed to create Coinbase payment. Please try again.'
      );
      setCoinbaseLoading(false);
    }
  }, [plan, deal, billingPeriod, router]);

  // Handle Stripe payment
  const handleStripePayment = useCallback(async () => {
    if (!plan && !deal) {
      setStripeError('Plan information is missing');
      return;
    }

    setStripeLoading(true);
    setStripeError(null);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setStripeError('Authentication required. Please log in again.');
        router.push("/workspace/login");
        return;
      }

      // Get plan name
      const planName = deal?.base_plan?.name || plan?.name;
      if (!planName) {
        setStripeError('Plan name is required');
        setStripeLoading(false);
        return;
      }

      // Determine billing period
      const billingPeriodValue = deal?.billing_period || billingPeriod;

      // Create Stripe checkout session
      const response = await axios.post(
        `${API_BASE}/api/payments/stripe/create-checkout`,
        {
          plan_name: planName,
          billing_period: billingPeriodValue,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.url) {
        // Redirect to Stripe Checkout
        window.location.href = response.data.url;
      } else {
        setStripeError('Failed to create checkout session. Please try again.');
        setStripeLoading(false);
      }
    } catch (error: any) {
      console.error('Stripe payment error:', error);
      setStripeError(
        error.response?.data?.error || 
        'Failed to create Stripe payment. Please try again.'
      );
      setStripeLoading(false);
    }
  }, [plan, deal, billingPeriod, router]);

  // Check for return from Coinbase
  useEffect(() => {
    const chargeId = sessionStorage.getItem('coinbase_charge_id');
    const canceled = searchParams.get('canceled');
    
    if (chargeId && !canceled) {
      // User returned from Coinbase - check if payment was successful
      // The webhook will handle the actual confirmation, but we can check status
      const token = localStorage.getItem("access_token");
      if (token) {
        // Redirect to success page - webhook will have processed the payment
        router.push('/checkout/success?provider=coinbase');
        sessionStorage.removeItem('coinbase_charge_id');
        sessionStorage.removeItem('coinbase_plan_name');
      }
    } else if (canceled === 'true') {
      // User canceled payment
      setCoinbaseError('Payment was canceled. You can try again.');
      sessionStorage.removeItem('coinbase_charge_id');
      sessionStorage.removeItem('coinbase_plan_name');
    }
  }, [searchParams, router]);

  // Check for return from Stripe
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const provider = searchParams.get('provider');
    const canceled = searchParams.get('canceled');
    
    if (sessionId && provider === 'stripe' && !canceled) {
      // User returned from Stripe - redirect to success page
      // The webhook will have processed the payment
      router.push(`/checkout/success?provider=stripe&session_id=${sessionId}`);
    } else if (canceled === 'true' && activeTab === 'stripe') {
      // User canceled Stripe payment
      setStripeError('Payment was canceled. You can try again.');
    }
  }, [searchParams, router, activeTab]);

  const renderPayPalButton = useCallback(() => {
    console.log('renderPayPalButton called');
    const container = document.getElementById('paypal-button-container');
    if (!container) {
      console.error('PayPal button container not found');
      setPaypalError('PayPal button container not found');
      return;
    }
    
    if (!plan) {
      console.error('Plan not available');
      return;
    }
    
    if (!(window as any).paypal) {
      console.error('PayPal SDK not loaded');
      setPaypalError('PayPal SDK not loaded');
      return;
    }

    console.log('Rendering PayPal button for plan:', plan?.name || 'Unknown');

    // Clear existing buttons
    container.innerHTML = '';
    setPaypalError(null);

    try {
      (window as any).paypal.Buttons({
      createSubscription: async function(data: any, actions: any) {
        try {
          setPaypalLoading(true);
          
          // Helper function to get valid token (with refresh if needed)
          const getValidToken = async (): Promise<string | null> => {
            let token = localStorage.getItem('access_token');
            const refreshToken = localStorage.getItem('refresh_token');
            
            if (!token) {
              throw new Error('No access token found. Please log in again.');
            }

            // Try to use the token, refresh if it fails
            try {
              // Test token validity with a simple request
              await axios.get(`${API_BASE}/api/user-info/`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              return token;
            } catch (err: any) {
              if (err.response?.status === 401 && refreshToken) {
                // Token expired, try to refresh
                try {
                  const res = await axios.post(`${API_BASE}/api/token/refresh/`, {
                    refresh: refreshToken,
                  });
                  const newAccessToken = res.data.access;
                  localStorage.setItem("access_token", newAccessToken);
                  if (res.data.refresh) {
                    localStorage.setItem("refresh_token", res.data.refresh);
                  }
                  return newAccessToken;
                } catch (refreshErr) {
                  // Refresh failed, redirect to login
                  localStorage.removeItem("access_token");
                  localStorage.removeItem("refresh_token");
                  sessionStorage.setItem('checkout_redirect', window.location.href);
                  router.push("/workspace/login");
                  throw new Error('Session expired. Please log in again.');
                }
              }
              throw err;
            }
          };

          const token = await getValidToken();
          if (!token) {
            throw new Error('Authentication failed. Please log in again.');
          }
          
          // Use deal endpoint if deal exists, otherwise regular endpoint
          const endpoint = deal 
            ? `${API_BASE}/api/payments/paypal/create-deal-subscription/`
            : `${API_BASE}/api/payments/paypal/create-subscription`;
          
          const payload = deal
            ? { deal_slug: deal.slug }
            : {
                plan_name: plan?.name || '',
                price: plan?.price || 0,
                billing_period: billingPeriod
              };
          
          const response = await axios.post(
            endpoint,
            payload,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );

          setPaypalLoading(false);
          return response.data.subscriptionID;
        } catch (error: any) {
          console.error('Error creating subscription:', error);
          setPaypalLoading(false);
          const errorMessage = error.response?.data?.error || error.message || 'Failed to create subscription. Please try again.';
          alert(errorMessage);
          throw error;
        }
      },
      onApprove: async function(data: any, actions: any) {
        try {
          setPaypalLoading(true);
          
          // Helper function to get valid token (with refresh if needed)
          const getValidToken = async (): Promise<string | null> => {
            let token = localStorage.getItem('access_token');
            const refreshToken = localStorage.getItem('refresh_token');
            
            if (!token) {
              throw new Error('No access token found. Please log in again.');
            }

            // Try to use the token, refresh if it fails
            try {
              await axios.get(`${API_BASE}/api/user-info/`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              return token;
            } catch (err: any) {
              if (err.response?.status === 401 && refreshToken) {
                try {
                  const res = await axios.post(`${API_BASE}/api/token/refresh/`, {
                    refresh: refreshToken,
                  });
                  const newAccessToken = res.data.access;
                  localStorage.setItem("access_token", newAccessToken);
                  if (res.data.refresh) {
                    localStorage.setItem("refresh_token", res.data.refresh);
                  }
                  return newAccessToken;
                } catch (refreshErr) {
                  localStorage.removeItem("access_token");
                  localStorage.removeItem("refresh_token");
                  sessionStorage.setItem('checkout_redirect', window.location.href);
                  router.push("/workspace/login");
                  throw new Error('Session expired. Please log in again.');
                }
              }
              throw err;
            }
          };

          const token = await getValidToken();
          if (!token) {
            throw new Error('Authentication failed. Please log in again.');
          }
          
          // Use deal confirm endpoint if deal exists
          const confirmEndpoint = deal
            ? `${API_BASE}/api/payments/paypal/confirm-deal/`
            : `${API_BASE}/api/payments/paypal/confirm`;
          
          const confirmPayload = deal
            ? {
                subscriptionID: data.subscriptionID,
                deal_slug: deal.slug
              }
            : {
                subscriptionID: data.subscriptionID,
                plan_name: plan?.name,
                billing_period: billingPeriod
              };
          
          const response = await axios.post(
            confirmEndpoint,
            confirmPayload,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );

          if (response.data.success) {
            // Redirect to success page
            const successParams = deal
              ? `deal=${deal.slug}&subscription_id=${data.subscriptionID}`
              : `plan=${plan?.name}&subscription_id=${data.subscriptionID}`;
            router.push(`/checkout/success?${successParams}`);
          }
        } catch (error: any) {
          console.error('Error confirming subscription:', error);
          const errorMessage = error.response?.data?.error || error.message || 'Failed to confirm subscription. Please try again.';
          alert(errorMessage);
        } finally {
          setPaypalLoading(false);
        }
      },
      onError: function(err: any) {
        console.error('PayPal error:', err);
        setPaypalLoading(false);
        alert('An error occurred with PayPal. Please try again.');
      },
      onCancel: function(data: any) {
        console.log('User cancelled PayPal payment');
        setPaypalLoading(false);
      }
    }).render('#paypal-button-container');
    } catch (error: any) {
      console.error('Error rendering PayPal button:', error);
      setPaypalError(`Failed to render PayPal button: ${error.message}`);
    }
  }, [plan, deal, billingPeriod, router]);

  useEffect(() => {
    // Load PayPal SDK (only after login/register so payment DOM exists)
    if (activeTab === 'paypal' && typeof window !== 'undefined' && plan && isAuthenticated) {
      setPaypalError(null);
      
      // In Next.js, NEXT_PUBLIC_ vars are available at build time
      // They should be accessible via process.env in client components
      const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
      
      // Debug: Log environment check
      console.log('🔍 PayPal Environment Check:', {
        hasPayPalClientId: !!clientId,
        clientIdLength: clientId?.length || 0,
        clientIdPreview: clientId ? `${clientId.substring(0, 10)}...` : 'NOT SET',
        // Note: process.env in browser only shows NEXT_PUBLIC_ vars that were set at build time
      });
      
      if (!clientId || clientId === 'YOUR_CLIENT_ID' || clientId === 'your_paypal_client_id_here' || clientId.trim() === '') {
        setPaypalError('PayPal Client ID not configured. Please set NEXT_PUBLIC_PAYPAL_CLIENT_ID in your .env.local file and restart the dev server.');
        console.error('PayPal Client ID not configured. Current value:', clientId);
        console.error('Make sure:');
        console.error('1. .env.local file exists in the studio/ directory');
        console.error('2. NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_actual_client_id is in .env.local');
        console.error('3. Dev server was restarted after adding the env var');
        return;
      }

      // Check if PayPal SDK is already loaded
      if ((window as any).paypal) {
        console.log('PayPal SDK already loaded');
        setPaypalSDKLoaded(true);
        // Use setTimeout to ensure DOM is ready
        setTimeout(() => {
          renderPayPalButton();
        }, 100);
        return;
      }

      // Check if script is already being loaded
      const existingScript = document.querySelector(`script[src*="paypal.com/sdk"]`);
      if (existingScript) {
        console.log('PayPal SDK script already exists, waiting for load...');
        // Wait for it to load
        const checkInterval = setInterval(() => {
          if ((window as any).paypal) {
            clearInterval(checkInterval);
            setPaypalSDKLoaded(true);
            renderPayPalButton();
          }
        }, 100);
        
        return () => clearInterval(checkInterval);
      }

      console.log('Loading PayPal SDK...');
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&vault=true&intent=subscription&currency=USD`;
      script.async = true;
      
      script.onload = () => {
        console.log('PayPal SDK script loaded');
        if ((window as any).paypal) {
          console.log('PayPal SDK available, rendering button...');
          setPaypalSDKLoaded(true);
          // Small delay to ensure DOM is ready
          setTimeout(() => {
            renderPayPalButton();
          }, 100);
        } else {
          setPaypalError('PayPal SDK failed to load. Please check your Client ID.');
          console.error('PayPal SDK not available after script load');
        }
      };
      
      script.onerror = (error) => {
        setPaypalError('Failed to load PayPal SDK. Please check your internet connection and Client ID.');
        console.error('PayPal SDK script failed to load:', error);
      };
      
      document.body.appendChild(script);
      console.log('PayPal SDK script added to DOM');

      return () => {
        const scriptToRemove = document.querySelector(`script[src*="paypal.com/sdk"]`);
        if (scriptToRemove && scriptToRemove.parentNode) {
          scriptToRemove.parentNode.removeChild(scriptToRemove);
        }
        setPaypalSDKLoaded(false);
      };
    } else {
      // Reset state when not on PayPal tab
      setPaypalSDKLoaded(false);
      setPaypalError(null);
    }
  }, [activeTab, plan, billingPeriod, renderPayPalButton, isAuthenticated]);

  const calculatePrice = () => {
    if (!plan) return 0;
    if (deal) return deal.deal_price;
    return plan.price || 0;
  };

  const courseSlugParam = searchParams.get("course");
  const catalogCourse = pilotfaaCheckoutCourseDisplay(courseSlugParam);

  const nonDealOrderHeadline = (() => {
    if (catalogCourse) {
      return {
        name: catalogCourse.name,
        sub: catalogCourse.sub,
        emoji: catalogCourse.emoji,
      };
    }
    if (courseSlugParam) {
      const name = courseSlugParam
        .split("-")
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
      return { name, sub: "", emoji: "" };
    }
    if (plan && plan.name !== PILOTFAA_DEFAULT_CHECKOUT_PLAN.planName) {
      return { name: plan.name, sub: "", emoji: "" };
    }
    return {
      name: PILOTFAA_DEFAULT_CHECKOUT_DISPLAY.name,
      sub: PILOTFAA_DEFAULT_CHECKOUT_DISPLAY.sub,
      emoji: PILOTFAA_DEFAULT_CHECKOUT_DISPLAY.emoji,
    };
  })();

  if (!sessionResolved || (!plan && !deal)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-palette-primary mx-auto mb-4" />
          <p className="text-slate-600">
            {!sessionResolved ? "Loading…" : "Loading checkout…"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-palette-accent-3 via-white to-palette-accent-3">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push('/courses')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to courses
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order summary</CardTitle>
              <CardDescription>What you are enrolling in</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Deal Badge */}
              {deal && (
                <div className="p-4 bg-gradient-to-r from-palette-primary/10 to-palette-secondary/10 rounded-lg border-2 border-palette-primary/20 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-palette-primary text-white">{deal.badge_text}</Badge>
                    <span className="text-sm font-semibold text-green-600">{deal.discount_percentage}% OFF</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{deal.name}</h3>
                  <p className="text-sm text-slate-600">{deal.description || deal.base_plan.display_name}</p>
                </div>
              )}

              <div className="p-4 bg-slate-50 rounded-lg">
                {deal ? (
                  <>
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                      <h3 className="font-semibold text-lg text-slate-900">{deal.base_plan.display_name}</h3>
                      <Badge variant="outline">
                        {deal.billing_period === "annual" ? "Annual" : "Monthly"}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600">
                      {deal.billing_period === "annual" ? "Billed once per year." : "Billed each month."}
                    </p>
                  </>
                ) : (
                  <div className="flex items-start gap-3">
                    {nonDealOrderHeadline.emoji ? (
                      <span className="text-2xl leading-none pt-0.5" aria-hidden>
                        {nonDealOrderHeadline.emoji}
                      </span>
                    ) : null}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-lg text-slate-900">{nonDealOrderHeadline.name}</h3>
                      {nonDealOrderHeadline.sub ? (
                        <p className="text-sm text-slate-600 mt-0.5">{nonDealOrderHeadline.sub}</p>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 border-t pt-4">
                {deal ? (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Original Price</span>
                      <span className="line-through text-slate-400">${deal.original_price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Deal Discount ({deal.discount_percentage}%)</span>
                      <span>-${(deal.original_price - deal.deal_price).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-3">
                      <span>Total</span>
                      <span className="text-green-600">${deal.deal_price.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {deal.billing_period === 'monthly' 
                        ? `Billed $${deal.deal_price.toFixed(2)} per month`
                        : `Billed $${deal.deal_price.toFixed(2)} per year`}
                    </p>
                  </>
                ) : (
                  <>
                    {plan &&
                    plan.listPrice != null &&
                    plan.listPrice > (plan.price || 0) ? (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Regular price</span>
                        <span className="line-through text-slate-400">
                          ${plan.listPrice.toFixed(0)}
                        </span>
                      </div>
                    ) : null}
                    <div className="flex justify-between text-lg font-bold border-t pt-3">
                      <span>Due today</span>
                      <span className="text-green-700">${calculatePrice().toFixed(0)}</span>
                    </div>
                    <p className="text-xs text-slate-500">Taxes may apply where required.</p>
                  </>
                )}
              </div>

              {/* Security Badge */}
              <div className="flex items-center gap-2 text-sm text-slate-600 pt-4 border-t">
                <Lock className="h-4 w-4" />
                <span>Secure payment processing</span>
              </div>
            </CardContent>
          </Card>

          {!isAuthenticated ? (
          <Card>
            <CardHeader>
              <CardTitle>Create your PilotFAA account</CardTitle>
              <CardDescription>
                Add your details below. After you register, you can complete payment on this page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCheckoutRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="pf-co-fn">First name</Label>
                    <Input
                      id="pf-co-fn"
                      value={regForm.first_name}
                      onChange={(e) => setRegForm((f) => ({ ...f, first_name: e.target.value }))}
                      required
                      disabled={regLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pf-co-ln">Last name</Label>
                    <Input
                      id="pf-co-ln"
                      value={regForm.last_name}
                      onChange={(e) => setRegForm((f) => ({ ...f, last_name: e.target.value }))}
                      required
                      disabled={regLoading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pf-co-user">Username</Label>
                  <Input
                    id="pf-co-user"
                    value={regForm.username}
                    onChange={(e) => setRegForm((f) => ({ ...f, username: e.target.value }))}
                    required
                    disabled={regLoading}
                    autoComplete="username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pf-co-email">Email</Label>
                  <Input
                    id="pf-co-email"
                    type="email"
                    value={regForm.email}
                    onChange={(e) => setRegForm((f) => ({ ...f, email: e.target.value }))}
                    required
                    disabled={regLoading}
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pf-co-pw">Password</Label>
                  <Input
                    id="pf-co-pw"
                    type="password"
                    value={regForm.password}
                    onChange={(e) => setRegForm((f) => ({ ...f, password: e.target.value }))}
                    required
                    minLength={8}
                    disabled={regLoading}
                    autoComplete="new-password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pf-co-pw2">Confirm password</Label>
                  <Input
                    id="pf-co-pw2"
                    type="password"
                    value={regForm.confirmPassword}
                    onChange={(e) => setRegForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                    required
                    disabled={regLoading}
                    autoComplete="new-password"
                  />
                </div>
                {regError ? <p className="text-sm text-red-600">{regError}</p> : null}
                <Button type="submit" className="w-full" disabled={regLoading}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  {regLoading ? "Creating account…" : "Continue to payment"}
                </Button>
              </form>
              <p className="text-sm text-slate-600 mt-6 text-center">
                Already have an account?{" "}
                <Link
                  href="/workspace/login"
                  className="text-palette-primary font-semibold underline"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      sessionStorage.setItem("checkout_redirect", window.location.href);
                    }
                  }}
                >
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>
          ) : (
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Choose your preferred payment provider</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="paypal" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    PayPal
                  </TabsTrigger>
                  <TabsTrigger value="stripe" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Stripe
                  </TabsTrigger>
                  <TabsTrigger value="coinbase" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Coinbase
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="paypal" className="space-y-4 mt-6">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      Complete your subscription using PayPal. You'll be redirected to PayPal to approve the payment.
                    </p>
                  </div>
                  
                  {paypalError && (
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-sm text-red-800 font-medium mb-2">PayPal Error:</p>
                      <p className="text-sm text-red-700">{paypalError}</p>
                      {paypalError.includes('Client ID') && (
                        <p className="text-xs text-red-600 mt-2">
                          Add NEXT_PUBLIC_PAYPAL_CLIENT_ID to your .env.local file and restart the dev server.
                        </p>
                      )}
                    </div>
                  )}
                  
                  {paypalLoading && (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-palette-primary mr-2" />
                      <span className="text-slate-600">Processing...</span>
                    </div>
                  )}
                  
                  {!paypalError && !paypalLoading && !paypalSDKLoaded && (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-palette-primary mr-2" />
                      <span className="text-slate-600">Loading PayPal...</span>
                    </div>
                  )}
                  
                  <div id="paypal-button-container" className="min-h-[200px]">
                    {!paypalError && !paypalSDKLoaded && (
                      <div className="flex items-center justify-center h-[200px] text-slate-400">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        <span>Loading PayPal button...</span>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="stripe" className="space-y-4 mt-6">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800 mb-2">
                      Complete your subscription using Stripe. You'll be redirected to Stripe Checkout to complete payment.
                    </p>
                    <p className="text-xs text-blue-700">
                      Secure payment processing with credit/debit cards.
                    </p>
                  </div>
                  
                  {stripeError && (
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-sm text-red-800 font-medium mb-2">Stripe Error:</p>
                      <p className="text-sm text-red-700">{stripeError}</p>
                    </div>
                  )}
                  
                  {stripeLoading && (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-palette-primary mr-2" />
                      <span className="text-slate-600">Creating Stripe checkout session...</span>
                    </div>
                  )}
                  
                  {!stripeLoading && (
                    <Button
                      onClick={handleStripePayment}
                      disabled={!plan && !deal}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      size="lg"
                    >
                      <CreditCard className="h-5 w-5 mr-2" />
                      Continue to Stripe Checkout
                    </Button>
                  )}
                </TabsContent>

                <TabsContent value="coinbase" className="space-y-4 mt-6">
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm text-purple-800 mb-2">
                      Pay with cryptocurrency using Coinbase Commerce
                    </p>
                    <p className="text-xs text-purple-700">
                      Supports Bitcoin (BTC), Ethereum (ETH), USD Coin (USDC), Litecoin (LTC), Dogecoin (DOGE), and more.
                    </p>
                  </div>

                  {coinbaseError && (
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-sm text-red-800 font-medium mb-2">Error:</p>
                      <p className="text-sm text-red-700">{coinbaseError}</p>
                    </div>
                  )}

                  {coinbaseLoading && (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-palette-primary mr-2" />
                      <span className="text-slate-600">Creating payment request...</span>
                    </div>
                  )}

                  {!coinbaseError && !coinbaseLoading && (
                    <div className="space-y-4">
                      <Button
                        onClick={handleCoinbasePayment}
                        disabled={!plan || coinbaseLoading}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-6 text-lg font-semibold"
                        size="lg"
                      >
                        <CreditCard className="h-5 w-5 mr-2" />
                        Pay with Cryptocurrency
                      </Button>
                      <p className="text-xs text-center text-slate-500">
                        You'll be redirected to Coinbase Commerce to complete your payment
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          )}
        </div>

        {/* Security & Trust */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-6 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>Cancel Anytime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-palette-primary" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}

