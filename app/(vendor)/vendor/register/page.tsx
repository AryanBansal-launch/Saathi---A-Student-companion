import { redirect } from "next/navigation";

export default function VendorRegisterPage() {
  redirect("/register?role=vendor");
}
