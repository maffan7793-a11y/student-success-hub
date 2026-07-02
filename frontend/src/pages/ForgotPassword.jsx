import { useForm } from "react-hook-form";
import { useState } from "react";
import { forgotPassword } from "../api/auth";
import { AuthShell, Field } from "./Register";

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [sent, setSent] = useState(false);

  const onSubmit = async (data) => {
    await forgotPassword(data.email);
    setSent(true);
  };

  return (
    <AuthShell title="Reset your password" subtitle="We'll email you a reset link">
      {sent ? (
        <p className="text-center text-sm text-emerald-600">
          If that email is registered, a reset link has been sent. Check your inbox.
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field label="Email" error={errors.email}>
            <input type="email" {...register("email", { required: "Email is required" })} className="input" placeholder="you@college.edu" />
          </Field>
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-60">
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
