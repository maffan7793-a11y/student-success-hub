import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Code2, LineChart, CreditCard, PartyPopper, GraduationCap } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { registerStudent, loginStudent } from "../api/auth";
import { createApplication } from "../api/applications";
import { createOrder, openRazorpayCheckout } from "../api/payments";

const STEPS = ["Your Info", "Domain", "Payment", "Success"];

export default function Apply() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, login, refresh } = useAuth();

  const [step, setStep] = useState(0);
  const [domain, setDomain] = useState(location.state?.domain || "");
  const [application, setApplication] = useState(null);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  const goNext = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleInfoSubmit = async (formData) => {
    setError("");
    try {
      if (role === "student") {
        // already logged in — just move on
      } else {
        // Register (or the backend will 409 if the email exists — direct them to log in)
        const res = await registerStudent(formData);
        login(res, "student");
      }
      goNext();
    } catch (err) {
      if (err.response?.status === 409) {
        setError("An account with this email already exists. Please log in first.");
      } else {
        setError(err.response?.data?.error || "Something went wrong. Please try again.");
      }
    }
  };

  const handleDomainSubmit = async () => {
    setError("");
    try {
      const res = await createApplication({ domain });
      setApplication(res.application);
      goNext();
    } catch (err) {
      setError(err.response?.data?.error || "Could not create application.");
    }
  };

  const handlePayment = async () => {
    setError("");
    setPaying(true);
    try {
      const order = await createOrder(application.application_id);
      openRazorpayCheckout({
        order,
        student: user,
        onSuccess: (result) => {
          setApplication(result.application);
          setPaying(false);
          refresh();
          goNext();
        },
        onFailure: (err) => {
          setPaying(false);
          setError(err.message || "Payment failed or was cancelled.");
        },
      });
    } catch (err) {
      setPaying(false);
      setError(err.response?.data?.error || "Could not start payment.");
    }
  };

  return (
    <div className="min-h-screen bg-brand-radial px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2 font-display text-lg font-bold text-ink-900 dark:text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white"><GraduationCap size={18} /></span>
          Student Success Hub
        </Link>

        <StepIndicator step={step} />

        <div className="glass-card mt-8 p-8">
          {error && <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10">{error}</div>}

          <AnimatePresence mode="wait">
            {step === 0 && (
              <StepWrapper key="info">
                <InfoStep onSubmit={handleInfoSubmit} isLoggedIn={role === "student"} onSkip={goNext} />
              </StepWrapper>
            )}
            {step === 1 && (
              <StepWrapper key="domain">
                <DomainStep domain={domain} setDomain={setDomain} onNext={handleDomainSubmit} onBack={goBack} />
              </StepWrapper>
            )}
            {step === 2 && (
              <StepWrapper key="payment">
                <PaymentStep application={application} paying={paying} onPay={handlePayment} onBack={goBack} />
              </StepWrapper>
            )}
            {step === 3 && (
              <StepWrapper key="success">
                <SuccessStep application={application} onDashboard={() => navigate("/dashboard")} />
              </StepWrapper>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function StepWrapper({ children }) {
  return (
    <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }}>
      {children}
    </motion.div>
  );
}

function StepIndicator({ step }) {
  return (
    <div className="flex items-center justify-between">
      {STEPS.map((label, i) => (
        <div key={label} className="flex flex-1 items-center">
          <div className="flex flex-col items-center gap-2">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                i < step ? "bg-brand-violet text-white" : i === step ? "bg-brand-gradient text-white shadow-glow" : "bg-ink-900/10 text-ink-500 dark:bg-white/10 dark:text-white/50"
              }`}
            >
              {i < step ? <Check size={16} /> : i + 1}
            </div>
            <span className="hidden text-xs text-ink-500 dark:text-white/50 sm:block">{label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`mx-2 h-px flex-1 ${i < step ? "bg-brand-violet" : "bg-ink-900/10 dark:bg-white/10"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function InfoStep({ onSubmit, isLoggedIn, onSkip }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  if (isLoggedIn) {
    return (
      <div className="text-center">
        <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-white">You're logged in</h2>
        <p className="mt-2 text-sm text-ink-500 dark:text-white/60">We'll use your existing profile details.</p>
        <button onClick={onSkip} className="btn-primary mt-6 w-full">Continue</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-white">Student Information</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput label="Full Name" error={errors.full_name} {...register("full_name", { required: "Required" })} />
        <TextInput label="Email" type="email" error={errors.email} {...register("email", { required: "Required" })} />
        <TextInput label="Phone" error={errors.phone} {...register("phone", { required: "Required" })} />
        <TextInput label="College" error={errors.college} {...register("college")} />
        <TextInput label="Course" error={errors.course} {...register("course")} />
        <TextInput label="Graduation Year" type="number" error={errors.graduation_year} {...register("graduation_year")} />
      </div>
      <TextInput label="Password" type="password" error={errors.password} {...register("password", { required: "Required", minLength: { value: 8, message: "At least 8 characters" } })} />
      <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-60">
        {isSubmitting ? "Saving..." : "Continue"}
      </button>
      <p className="text-center text-xs text-ink-500 dark:text-white/40">
        Already applied before? <Link to="/login" className="font-medium text-brand-violet">Log in</Link>
      </p>
    </form>
  );
}

function TextInput({ label, error, type = "text", ...rest }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-white/80">{label}</label>
      <input type={type} className="input" {...rest} />
      {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
    </div>
  );
}

function DomainStep({ domain, setDomain, onNext, onBack }) {
  const options = [
    { key: "web_development", icon: Code2, title: "Web Development", desc: "React, Flask, auth, deployment." },
    { key: "data_analytics", icon: LineChart, title: "Data Analytics", desc: "Cleaning, EDA, Power BI, reporting." },
  ];

  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-white">Choose Your Internship Domain</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {options.map((o) => (
          <button
            key={o.key}
            type="button"
            onClick={() => setDomain(o.key)}
            className={`rounded-xl2 border p-5 text-left transition-all ${
              domain === o.key ? "border-brand-violet bg-brand-violet/5 shadow-glow" : "border-ink-900/10 dark:border-white/10"
            }`}
          >
            <o.icon size={22} className="mb-3 text-brand-violet" />
            <div className="font-display font-semibold text-ink-900 dark:text-white">{o.title}</div>
            <div className="mt-1 text-xs text-ink-500 dark:text-white/60">{o.desc}</div>
          </button>
        ))}
      </div>

      <div className="mt-6 flex gap-3">
        <button onClick={onBack} className="btn-secondary flex-1">Back</button>
        <button onClick={onNext} disabled={!domain} className="btn-primary flex-1 disabled:opacity-50">Continue</button>
      </div>
    </div>
  );
}

function PaymentStep({ application, paying, onPay, onBack }) {
  return (
    <div className="text-center">
      <CreditCard size={32} className="mx-auto mb-4 text-brand-violet" />
      <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-white">Complete Your Payment</h2>
      <p className="mt-2 text-sm text-ink-500 dark:text-white/60">
        Application ID: <span className="font-mono">{application?.application_id}</span>
      </p>

      <div className="my-8 font-display text-4xl font-bold text-ink-900 dark:text-white">₹79</div>

      <button onClick={onPay} disabled={paying} className="btn-primary w-full disabled:opacity-60">
        {paying ? "Opening payment..." : "Pay ₹79 with Razorpay"}
      </button>
      <button onClick={onBack} className="btn-secondary mt-3 w-full">Back</button>
    </div>
  );
}

function SuccessStep({ application, onDashboard }) {
  return (
    <div className="text-center">
      <PartyPopper size={36} className="mx-auto mb-4 text-brand-violet" />
      <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-white">You're In!</h2>
      <p className="mt-2 text-sm text-ink-500 dark:text-white/60">Your internship is now active.</p>

      <div className="glass-panel mx-auto mt-6 max-w-xs p-5 text-left text-sm">
        <div className="flex justify-between py-1"><span className="text-ink-500 dark:text-white/50">Application ID</span><span className="font-mono font-medium">{application?.application_id}</span></div>
        <div className="flex justify-between py-1"><span className="text-ink-500 dark:text-white/50">Domain</span><span className="font-medium">{application?.domain?.replace("_", " ")}</span></div>
        <div className="flex justify-between py-1"><span className="text-ink-500 dark:text-white/50">Status</span><span className="font-medium text-emerald-600">Active</span></div>
      </div>

      <button onClick={onDashboard} className="btn-primary mt-8 w-full">Go to Dashboard</button>
    </div>
  );
}
