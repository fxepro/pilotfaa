"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  Mail,
  Clock,
  Send,
  CheckCircle,
  Globe,
  Users,
  Headphones,
  BookOpen,
  Plane,
} from "lucide-react"

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  (typeof window !== "undefined" ? "" : "http://localhost:8000")

const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "support@pilotfaa.com"

export function ContactMain() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`${API_BASE}/api/contact/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        toast({
          title: "Message sent",
          description: "Thanks for reaching out. We typically reply within one business day.",
        })
        setFormData({ name: "", email: "", subject: "", message: "" })
      } else {
        throw new Error(result.error || "Failed to send message")
      }
    } catch {
      toast({
        title: "Something went wrong",
        description: "We could not send your message. Please try again or email us directly.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <section className="relative min-h-[44vh] flex items-center justify-center bg-gradient-to-br from-[#0F1F3A] via-[#1756C8] to-[#4A7AE0]">
        <div className="absolute inset-0 overflow-hidden opacity-40">
          <div className="absolute -inset-10">
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-300/30 rounded-full blur-3xl" />
          </div>
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:72px_72px]" />

        <div className="relative z-10 container mx-auto px-4 text-center max-w-3xl">
          <div className="mb-6">
            <Badge
              variant="outline"
              className="border-white/35 text-white bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm"
            >
              <Plane className="h-3.5 w-3.5 mr-2 inline" />
              PilotFAA
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Contact us
          </h1>
          <p className="text-lg text-white/90 leading-relaxed">
            Questions about courses, your account, or how we cite FAA sources? Send a note—we are
            happy to help student pilots and instructors.
          </p>
        </div>
      </section>

      <div className="bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 py-14 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-10 mb-14">
            <Card className="border-slate-200/80 shadow-md">
              <CardHeader>
                <CardTitle className="text-slate-900 flex items-center gap-2 text-xl">
                  <Send className="h-5 w-5 text-[#1756C8]" />
                  Send a message
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Tell us what you need. We read every message.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your name"
                        required
                        className="border-slate-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="you@example.com"
                        required
                        className="border-slate-200"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="e.g. Private pilot course, billing, technical issue"
                      required
                      className="border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="How can we help?"
                      rows={6}
                      required
                      className="border-slate-200 resize-y min-h-[140px]"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#1756C8] hover:bg-[#1347a8] text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="h-4 w-4 mr-2 inline-block animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="border-slate-200/80 shadow-md">
                <CardHeader>
                  <CardTitle className="text-slate-900 flex items-center gap-2 text-xl">
                    <Headphones className="h-5 w-5 text-[#1756C8]" />
                    Reach us
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5 text-[#1756C8]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Email</h4>
                      <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="text-[#1756C8] hover:underline"
                      >
                        {CONTACT_EMAIL}
                      </a>
                      <p className="text-sm text-slate-500 mt-1">
                        Best for account help, course questions, and partnerships.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
                      <Clock className="h-5 w-5 text-[#1756C8]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Response time</h4>
                      <p className="text-slate-600 text-sm">
                        We aim to reply within one business day (U.S. Eastern time).
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
                      <Globe className="h-5 w-5 text-[#1756C8]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">What we offer</h4>
                      <p className="text-slate-600 text-sm">
                        FAA-grounded ground school for Private, Instrument, and rotorcraft tracks—with
                        lessons, quizzes, and citations to official FAA material.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-emerald-200/60 bg-emerald-50/40 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-emerald-900 flex items-center gap-2 text-lg">
                    <BookOpen className="h-5 w-5" />
                    Why PilotFAA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2.5 text-sm text-emerald-900/90">
                    <li className="flex gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Content tied to PHAK, ACS, FAR/AIM, and related FAA publications.</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Quizzes and study paths aligned to knowledge test prep—not generic trivia.</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Clear citations so you can verify every teaching point at the source.</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="border-slate-200/80 shadow-md">
            <CardHeader>
              <CardTitle className="text-slate-900 flex items-center gap-2 text-xl">
                <Users className="h-5 w-5 text-[#1756C8]" />
                Common questions
              </CardTitle>
              <CardDescription className="text-slate-600">
                Quick answers before you write in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8 text-sm">
                <div className="space-y-5">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Is this a substitute for a flight school?</h4>
                    <p className="text-slate-600">
                      No. PilotFAA supports ground training and knowledge test preparation. You still need
                      a certificated instructor and practical training for your certificate or rating.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Where do lessons come from?</h4>
                    <p className="text-slate-600">
                      We ground lessons and explanations in official FAA documents (e.g. PHAK, ACS) and
                      show citations so you can read the original text.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Login or billing issues?</h4>
                    <p className="text-slate-600">
                      Email us with the address you use to sign in and a short description. We will
                      help you get back into your account or correct a charge.
                    </p>
                  </div>
                </div>
                <div className="space-y-5">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Do you offer refunds?</h4>
                    <p className="text-slate-600">
                      Refund rules depend on your plan and timing. Mention your purchase date in your
                      message and we will follow your applicable policy.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Feature requests or bugs</h4>
                    <p className="text-slate-600">
                      We welcome feedback. Include your browser, device, and steps to reproduce if
                      something is broken—we prioritize fixes that affect studying and assessments.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Press or partnerships</h4>
                    <p className="text-slate-600">
                      Use the form with subject line “Partnership” or “Media.” We will route it to the
                      right person.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
