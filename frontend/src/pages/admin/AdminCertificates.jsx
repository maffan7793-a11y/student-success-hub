import { useEffect, useState } from "react";
import { Award, Download } from "lucide-react";
import { listAdminCertificates } from "../../api/admin";
import LoadingSkeleton from "../../components/common/LoadingSkeleton";

export default function AdminCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listAdminCertificates().then((d) => setCertificates(d.certificates)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton rows={4} />;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Certificates</h1>
      <p className="mt-1 text-sm text-white/50">{certificates.length} certificate(s) issued.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {certificates.map((c) => (
          <div key={c.certificate_number} className="rounded-xl2 border border-white/10 bg-white/5 p-5">
            <Award size={20} className="mb-3 text-brand-violet" />
            <div className="font-medium">{c.student_name}</div>
            <div className="mt-1 text-xs capitalize text-white/50">{c.domain.replace("_", " ")}</div>
            <div className="mt-1 font-mono text-xs text-white/40">{c.certificate_number}</div>
            <div className="mt-3 text-xs text-white/40">Issued {new Date(c.issued_at).toLocaleDateString()}</div>
            {c.pdf_url && (
              <a href={c.pdf_url} target="_blank" rel="noreferrer" className="mt-4 flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
                <Download size={14} /> View PDF
              </a>
            )}
          </div>
        ))}

        {certificates.length === 0 && (
          <div className="col-span-full rounded-xl2 border border-white/10 bg-white/5 p-10 text-center text-white/40">
            No certificates issued yet.
          </div>
        )}
      </div>
    </div>
  );
}
