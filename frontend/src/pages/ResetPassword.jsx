import { useForm } from "react-hook-form";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { resetPassword } from "../api/auth";
import { AuthShell, Field } from "./Register";

export default function ResetPassword() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [searchParams] = useSearchParams();
  const [serverError, setServerError] = useState("");
  const [done, setDone] = useState(false);
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const onSubmit = async (data) => {
    setServerError("");
    try {
      await resetPassword({ token, password: data.password });
      setDone(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setServerError(err.response?.data?.error || "This reset link is invalid or has expired.");
    }
  };

  if (!token) {
    return (
      <AuthShell title="Invalid link">
        <p className="text-center text-sm text-ink-500 dark:text-white/60">
          This reset link is missing a token. <Link to="/forgot-password" className="font-medium text-brand-violet">Request a new one</Link>.
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Set a new password">
      {done ? (
        <p className="text-center text-sm text-emerald-600">Password updated. Redirecting to login...</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field label="New Password" error={errors.password}>
            <input type="password" {...register("password", { required: "Password is required", minLength: { value: 8, message: "At least 8 characters" } })} className="input" placeholder="••••••••" />
          </Field>
          {serverError && <p className="text-sm text-red-500">{serverError}</p>}
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-60">
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
