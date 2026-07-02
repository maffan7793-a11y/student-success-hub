import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { adminLogin } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import { AuthShell, Field } from "../Register";

export default function AdminLogin() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [serverError, setServerError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setServerError("");
    try {
      const res = await adminLogin(data);
      login(res, res.admin.role);
      navigate("/admin/dashboard");
    } catch (err) {
      setServerError(err.response?.data?.error || "Login failed. Please try again.");
    }
  };

  return (
    <AuthShell title="Admin Portal" subtitle="Sign in to manage the platform">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="Admin Email" error={errors.email}>
          <input type="email" {...register("email", { required: "Email is required" })} className="input" placeholder="admin@studentsuccesshub.com" />
        </Field>
        <Field label="Password" error={errors.password}>
          <input type="password" {...register("password", { required: "Password is required" })} className="input" placeholder="••••••••" />
        </Field>
        {serverError && <p className="text-sm text-red-500">{serverError}</p>}
        <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-60">
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </AuthShell>
  );
}
