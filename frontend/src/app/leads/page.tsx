"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLeads } from "@/hooks/useLeads";
import { LeadStatus } from "@/types/lead.types";
import CreateLeadModal from "@/components/CreateLeadModal";
import { LeadTableRow } from "@/components/LeadTableRow";

export default function Home() {
  const limit = 10;
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    leads,
    meta,
    error,
    loading,
    setPage,
    status,
    setStatus,
    search,
    setSearch,
    sort,
    setSort,
    order,
    setOrder,
    refresh,
  } = useLeads(1, limit);

  // Обчислення діапазону для пагінації
  const from = (meta.page - 1) * limit + 1;
  const to = Math.min(meta.page * limit, meta.total);

  const toggleSort = (field: string) => {
    if (sort === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSort(field);
      setOrder("desc");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header - можна також винести в окремий компонент */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Lead Dashboard
            </h1>
            <p className="text-slate-500 mt-1">
              Керуйте угодами та відстежуйте прогрес
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-indigo-100"
          >
            + Новий лід
          </button>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <span className="text-xl italic font-bold">⚠️ Помилка:</span>
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Filters Section */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="relative w-full md:w-1/2">
            <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
            <input
              type="text"
              placeholder="Пошук..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <select
            className="w-full md:w-1/4 px-4 py-2 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Всі статуси</option>
            {Object.values(LeadStatus).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              setSearch("");
              setStatus("");
              setPage(1);
            }}
            className="text-sm text-indigo-600 font-medium hover:text-indigo-800"
          >
            Скинути
          </button>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th
                    onClick={() => toggleSort("name")}
                    className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase cursor-pointer hover:text-indigo-600"
                  >
                    Клієнт {sort === "name" && (order === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Компанія
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th
                    onClick={() => toggleSort("value")}
                    className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right cursor-pointer hover:text-indigo-600"
                  >
                    Сума {sort === "value" && (order === "asc" ? "↑" : "↓")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={4} className="px-6 py-6">
                        <div className="h-4 bg-slate-100 rounded w-full"></div>
                      </td>
                    </tr>
                  ))
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-5xl mb-4">📂</span>
                        <p className="text-slate-600 text-lg font-bold">
                          Ліди не знайдені
                        </p>
                        <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">
                          За вашим запитом нічого не знайдено. Спробуйте змінити
                          фільтри або додати нового клієнта.
                        </p>
                        {(search || status) && (
                          <button
                            onClick={() => {
                              setSearch("");
                              setStatus("");
                              setPage(1);
                            }}
                            className="mt-6 text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
                          >
                            Скинути всі фільтри
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <LeadTableRow
                      key={lead.id}
                      lead={lead}
                      onClick={() => router.push(`/leads/${lead.id}`)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <footer className="px-6 py-5 bg-slate-50/30 border-t flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Показано{" "}
              <span className="font-medium text-slate-700">
                {meta.total === 0 ? 0 : `${from}–${to}`}
              </span>{" "}
              з <span className="font-medium text-slate-700">{meta.total}</span>
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(meta.page - 1)}
                disabled={meta.page <= 1 || loading}
                className="px-4 py-2 text-sm font-medium border rounded-xl bg-white disabled:opacity-40"
              >
                Назад
              </button>
              <button
                onClick={() => setPage(meta.page + 1)}
                disabled={meta.page >= meta.lastPage || loading}
                className="px-4 py-2 text-sm font-medium border rounded-xl bg-white disabled:opacity-40"
              >
                Вперед
              </button>
            </div>
          </footer>
        </div>
      </div>

      {isModalOpen && (
        <CreateLeadModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => refresh()}
        />
      )}
    </div>
  );
}
