import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginStudent } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { AuthShell, Field } from "./Register";

export default function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [serverError, setServerError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setServerError("");
    try {
      const res = await loginStudent(data);
      login(res, "student");
      navigate("/dashboard");
    } catch (err) {
      setServerError(err.response?.data?.error || "Login failed. Please try again.");
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Log in to continue your internship">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="Email" error={errors.email}>
          <input type="email" {...register("email", { required: "Email is required" })} className="input" placeholder="you@college.edu" />
        </Field>
        <Field label="Password" error={errors.password}>
          <input type="password" {...register("password", { required: "Password is required" })} className="input" placeholder="••••••••" />
        </Field>

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-xs font-medium text-brand-violet">Forgot password?</Link>
        </div>

        {serverError && <p className="text-sm text-red-500">{serverError}</p>}

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-60">
          {isSubmitting ? "Logging in..." : "Log In"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500 dark:text-white/60">
        New here? <Link to="/register" className="font-medium text-brand-violet">Create an account</Link>
      </p>
      <p className="mt-2 text-center text-xs text-ink-500 dark:text-white/40">
        Are you an admin? <Link to="/admin/login" className="font-medium text-brand-violet">Admin login</Link>
      </p>
    </AuthShell>
  );
}
