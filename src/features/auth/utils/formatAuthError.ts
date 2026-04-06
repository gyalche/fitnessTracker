export function formatAuthError(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("over_email_send_rate_limit") || normalized.includes("email rate limit exceeded")) {
    return "Too many auth emails were sent recently. For development, disable email confirmation in Supabase Auth settings or wait before trying again.";
  }

  if (normalized.includes("without an active session")) {
    return "Your account may require email confirmation first. Disable email confirmation in Supabase for development, or verify the email before signing in.";
  }

  if (normalized.includes("invalid login credentials")) {
    return "Incorrect email or password.";
  }

  if (normalized.includes("email not confirmed")) {
    return "Your email is not confirmed yet. Verify the email first, or disable email confirmation in Supabase while developing.";
  }

  if (normalized.includes("schema is not installed yet") || normalized.includes("run docs/supabase.sql")) {
    return "Supabase tables are missing. Open the Supabase SQL Editor, run docs/supabase.sql from this repo, then restart Expo.";
  }

  if (normalized.includes("bootstrap rows are missing") || normalized.includes("auth.users trigger")) {
    return "Supabase profile bootstrap is missing. Re-run docs/supabase.sql so the auth.users trigger creates profiles and privacy_settings rows.";
  }

  return message;
}
