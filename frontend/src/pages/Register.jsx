import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { GraduationCap } from "lucide-react";
import { registerStudent } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [serverError, setServerError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setServerError("");
    try {
      const res = await registerStudent(data);
      login(res, "student");
      navigate("/dashboard");
    } catch (err) {
      setServerError(err.response?.data?.error || "Registration failed. Please try again.");
    }
  };

  return (
    <AuthShell title="Create your account" subtitle="Start your internship journey today">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="Full Name" error={errors.full_name}>
          <input {...register("full_name", { required: "Name is required" })} className="input" placeholder="Aisha Verma" />
        </Field>
        <Field label="Email" error={errors.email}>
          <input type="email" {...register("email", { required: "Email is required" })} className="input" placeholder="you@college.edu" />
        </Field>
        <Field label="Phone" error={errors.phone}>
          <input {...register("phone", { required: "Phone is required" })} className="input" placeholder="98765 43210" />
        </Field>
        <Field label="College" error={errors.college}>
          <input {...register("college")} className="input" placeholder="Your college (optional)" />
        </Field>
        <Field label="Password" error={errors.password}>
          <input type="password" {...register("password", { required: "Password is required", minLength: { value: 8, message: "At least 8 characters" } })} className="input" placeholder="••••••••" />
        </Field>

        {serverError && <p className="text-sm text-red-500">{serverError}</p>}

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-60">
          {isSubmitting ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500 dark:text-white/60">
        Already have an account? <Link to="/login" className="font-medium text-brand-violet">Log in</Link>
      </p>
    </AuthShell>
  );
}

export function AuthShell({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-radial px-6 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2 font-display text-lg font-bold text-ink-900 dark:text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white"><GraduationCap size={18} /></span>
          Student Success Hub
        </Link>
        <div className="glass-card p-8">
          <h1 className="text-center font-display text-2xl font-bold text-ink-900 dark:text-white">{title}</h1>
          {subtitle && <p className="mt-1 text-center text-sm text-ink-500 dark:text-white/60">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-white/80">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
    </div>
  );
}
