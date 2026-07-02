import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../api/applications";
import LoadingSkeleton from "../../components/common/LoadingSkeleton";

export default function Profile() {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getProfile().then(({ student }) => {
      reset({
        college: student.college || "",
        skills: (student.skills || []).join(", "),
        github_url: student.github_url || "",
        linkedin_url: student.linkedin_url || "",
        resume_url: student.resume_url || "",
        profile_photo_url: student.profile_photo_url || "",
      });
    }).finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (data) => {
    setSaved(false);
    await updateProfile({ ...data, skills: data.skills.split(",").map((s) => s.trim()).filter(Boolean) });
    setSaved(true);
  };

  if (loading) return <LoadingSkeleton rows={4} />;

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Profile</h1>
      <p className="mt-1 text-sm text-ink-500 dark:text-white/60">Keep your details up to date for mentors and certificates.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="glass-panel mt-6 space-y-4 p-6">
        <LabeledInput label="Profile Photo URL" {...register("profile_photo_url")} />
        <LabeledInput label="College" {...register("college")} />
        <LabeledInput label="Skills (comma separated)" {...register("skills")} placeholder="React, Flask, SQL" />
        <LabeledInput label="GitHub URL" {...register("github_url")} />
        <LabeledInput label="LinkedIn URL" {...register("linkedin_url")} />
        <LabeledInput label="Resume URL" {...register("resume_url")} placeholder="Link to your resume (Drive, etc.)" />

        {saved && <p className="text-sm text-emerald-600">Profile updated.</p>}

        <button type="submit" disabled={isSubmitting} className="btn-primary disabled:opacity-60">
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

function LabeledInput({ label, ...rest }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-white/80">{label}</label>
      <input className="input" {...rest} />
    </div>
  );
}
