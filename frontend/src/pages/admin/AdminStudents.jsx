import { useEffect, useState } from "react";
import { Search, Ban } from "lucide-react";
import { listAdminStudents, deactivateStudent } from "../../api/admin";
import LoadingSkeleton from "../../components/common/LoadingSkeleton";

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async (q = "") => {
    setLoading(true);
    const data = await listAdminStudents({ search: q });
    setStudents(data.students);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    load(search);
  };

  const handleDeactivate = async (id) => {
    await deactivateStudent(id);
    load(search);
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Students</h1>

      <form onSubmit={handleSearch} className="mt-4 flex gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email" className="input !bg-white/5 !border-white/10 !text-white" />
        <button type="submit" className="btn-secondary !border-white/15 !bg-white/5 !text-white"><Search size={16} /></button>
      </form>

      {loading ? (
        <div className="mt-6"><LoadingSkeleton rows={5} /></div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl2 border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-white/60">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">College</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-t border-white/10">
                  <td className="px-4 py-3">{s.full_name}</td>
                  <td className="px-4 py-3 text-white/60">{s.email}</td>
                  <td className="px-4 py-3 text-white/60">{s.college || "—"}</td>
                  <td className="px-4 py-3 text-white/60">{new Date(s.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDeactivate(s.id)} className="text-red-400 hover:text-red-300" title="Deactivate">
                      <Ban size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-white/40">No students found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
