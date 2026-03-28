import { redirect } from "next/navigation";

// /login → /workspace/login (single unified login for all users)
export default function LoginPage() {
  redirect("/workspace/login");
}
