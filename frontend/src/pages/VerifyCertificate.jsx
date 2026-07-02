import { useState } from "react";
import { Search, ShieldCheck, Download } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { verifyCertificatePublic } from "../api/applications";

export default function VerifyCertificate() {
  const [certificateId, setCertificateId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setResults(null);
    setLoading(true);
    try {
      const data = await verifyCertificatePublic({
        certificate_id: certificateId || undefined,
        student_name: studentName || undefined,
      });
      setResults(data.results);
    } catch (err) {
      setError(err.response?.data?.message || "No matching certificate found.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="section max-w-2xl">
        <div className="text-center">
          <span className="eyebrow">Certificate Verification</span>
          <h1 className="text-3xl font-bold text-ink-900 dark:text-white">Verify a Student Success Hub Certificate</h1>
          <p className="mt-3 text-ink-500 dark:text-white/60">Search by certificate ID or student name.</p>
        </div>

        <form onSubmit={handleSearch} className="glass-card mt-8 flex flex-col gap-3 p-6 sm:flex-row">
          <input value={certificateId} onChange={(e) => setCertificateId(e.target.value)} placeholder="Certificate ID (e.g. SSH-CERT-123456)" className="input flex-1" />
          <input value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Student name" className="input flex-1" />
          <button type="submit" disabled={loading} className="btn-primary shrink-0 disabled:opacity-60">
            <Search size={16} /> {loading ? "Searching..." : "Verify"}
          </button>
        </form>

        {error && <p className="mt-6 text-center text-sm text-red-500">{error}</p>}

        {results && (
          <div className="mt-8 space-y-4">
            {results.map((r) => (
              <div key={r.certificate_number} className="glass-panel flex items-center justify-between p-6">
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-emerald-500" />
                    <span className="font-display font-semibold text-ink-900 dark:text-white">{r.student_name}</span>
                  </div>
                  <div className="mt-1 text-sm text-ink-500 dark:text-white/60">
                    {r.domain.replace("_", " ")} · Certificate {r.certificate_number}
                  </div>
                  <div className="mt-1 text-xs text-ink-500 dark:text-white/40">
                    Completed {new Date(r.completion_date).toLocaleDateString()} · Status: {r.status}
                  </div>
                </div>
                {r.pdf_url && (
                  <a href={r.pdf_url} target="_blank" rel="noreferrer" className="btn-secondary !px-4 !py-2 text-sm">
                    <Download size={14} />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
