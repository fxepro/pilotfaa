import { useState, useCallback } from "react";

/** Site config from API (palette/typography fields removed — use fixed CSS in globals.css). */
export interface SiteConfig {
  id: number;
  site_name: string;
  site_description: string;
  default_language: string;
  default_theme: string;
  session_timeout_minutes: number;
  max_login_attempts: number;
  require_strong_passwords: boolean;
  enable_two_factor: boolean;
  enable_email_verification: boolean;
  enable_email_notifications: boolean;
  enable_push_notifications: boolean;
  enable_sms_notifications: boolean;
  notification_email: string;
  api_base_url: string;
  api_rate_limit: number;
  enable_cors: boolean;
  enable_api_docs: boolean;
}

export function useSiteConfig() {
  const [config] = useState<SiteConfig | null>(null);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    /* Reserved for callers that still expect refetch; no remote typography/palette. */
  }, []);

  return { config, loading, error, refetch };
}
