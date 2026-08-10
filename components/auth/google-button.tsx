"use client";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4">
      <path fill="#4285F4" d="M23.52 12.27c0-.82-.07-1.42-.22-2.05H12v3.9h6.5c-.13 1.06-.84 2.66-2.42 3.73l3.72 2.85c2.22-2.03 3.72-5.02 3.72-8.43z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.06 7.94-2.88l-3.72-2.85c-1.03.7-2.4 1.19-4.22 1.19-3.24 0-5.98-2.14-6.96-5.09l-3.85 2.96C3.19 21.42 7.26 24 12 24z" />
      <path fill="#FBBC05" d="M5.04 14.37A7.36 7.36 0 0 1 4.63 12c0-.83.15-1.63.4-2.37L1.18 6.66A11.94 11.94 0 0 0 0 12c0 1.93.47 3.76 1.18 5.34l3.86-2.97z" />
      <path fill="#EA4335" d="M12 4.75c2.27 0 3.8.96 4.68 1.77l3.42-3.32C17.94 1.24 15.24 0 12 0 7.26 0 3.19 2.58 1.18 6.66l3.86 2.97C6.02 6.68 8.76 4.75 12 4.75z" />
    </svg>
  );
}

export function GoogleButton({ label = "Continue with Google" }: { label?: string }) {
  async function handleClick() {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/onboarding` },
    });
    if (error) toast.error("Couldn't connect to Google", { description: error.message });
  }

  return (
    <Button type="button" variant="outline" className="w-full" onClick={handleClick}>
      <GoogleIcon />
      {label}
    </Button>
  );
}
