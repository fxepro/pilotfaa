import { redirect } from "next/navigation";

/** Registration is handled on `/checkout` (account + payment). */
export default function RegisterPage() {
  redirect("/checkout");
}
