"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import $api from "@/api/axios";
import { Lead, LeadStatus, Comment, LeadFormValues } from "@/types/lead.types";
import { validateLeadForm } from "@/utils/validation";
import { AxiosError } from "axios";
import LeadCommentsSection from "@/components/LeadCommentsSection";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/ConfirmModal";

export default function LeadDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [lead, setLead] = useState<Lead | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [leadRes, commentsRes] = await Promise.all([
          $api.get<Lead>(`/leads/${id}`),
          $api.get<Comment[]>(`/leads/${id}/comments`),
        ]);
        setLead(leadRes.data);
        setComments(commentsRes.data);
      } catch (err) {
        if (err instanceof AxiosError && err.response?.status !== 404) {
          setError(
            err.response?.data?.message || err.message || "Помилка мережі",
          );
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleUpdate = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    const formData = new FormData(e.currentTarget);

    const formValues: LeadFormValues = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      company: formData.get("company") as string,
      status: formData.get("status") as string,
      value: Number(formData.get("value")) || 0,
      notes: formData.get("notes") as string,
    };

    const errors = validateLeadForm(formValues);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      const payload = { ...formValues };
      if (!payload.email?.trim()) delete payload.email;

      const res = await $api.patch<Lead>(`/leads/${id}`, payload);

      setLead(res.data);
      setIsEditing(false);

      toast.success("Дані оновлено!");
    } catch {
      toast.error("Помилка при збереженні");
    }
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      await $api.delete(`/leads/${id}`);
      toast.success("Ліда успішно видалено");
      router.push("/leads");
    } catch {
      toast.error("Не вдалося видалити ліда");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const clearFieldError = (field: string) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  if (loading)
    return (
      <div className="p-20 text-center animate-pulse text-slate-400">
        Завантаження...
      </div>
    );

  if (error) {
    return (
      <div className="p-20 text-center">
        <div className="inline-block p-6 bg-red-50 border border-red-100 rounded-3xl">
          <span className="text-4xl mb-4 block">🔌</span>

          <h2 className="text-xl font-bold text-red-700 mb-2">
            Помилка з’єднання
          </h2>

          <p className="text-red-500 mb-4">{error}</p>

          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all"
          >
            Спробувати знову
          </button>
        </div>
      </div>
    );
  }

  if (!lead)
    return (
      <div className="p-20 text-center text-slate-500">
        <span className="text-4xl mb-4 block">🔍</span>

        <h2 className="text-xl font-bold mb-2">Лід не знайдений</h2>

        <p>Об’єкт з таким ID не існує в базі даних.</p>

        <button
          onClick={() => router.push("/leads")}
          className="mt-4 text-indigo-600 underline"
        >
          Повернутися до списку
        </button>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10">
      <button
        onClick={() => router.push("/leads")}
        className="mb-8 flex items-center text-slate-500 hover:text-indigo-600 transition-colors font-medium"
      >
        ← Назад до списку
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
              <h2 className="font-bold text-slate-800 text-xl">Деталі ліда</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 text-sm font-semibold border rounded-xl hover:bg-white transition-all"
                >
                  {isEditing ? "Скасувати" : "Редагувати"}
                </button>
                {!isEditing && (
                  <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="px-4 py-2 text-sm font-semibold bg-red-50 text-red-600 rounded-xl hover:bg-red-100 hover:text-red-700 transition-all border border-red-100"
                  >
                    Видалити
                  </button>
                )}
              </div>
            </div>

            {isEditing ? (
              <form
                onSubmit={handleUpdate}
                noValidate
                className="p-6 space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase">
                      Ім’я *
                    </label>
                    <input
                      name="name"
                      defaultValue={lead.name}
                      onChange={() => clearFieldError("name")}
                      className={`w-full p-2.5 bg-slate-50 border rounded-xl outline-none ${fieldErrors.name ? "border-red-500" : "border-slate-200"}`}
                    />
                    {/* 2. ВІДОБРАЖЕННЯ ВАЛІДАЦІЇ */}
                    {fieldErrors.name && (
                      <p className="text-[10px] text-red-500 font-bold">
                        {fieldErrors.name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase">
                      Email
                    </label>
                    <input
                      name="email"
                      defaultValue={lead.email || ""}
                      onChange={() => clearFieldError("email")}
                      className={`w-full p-2.5 bg-slate-50 border rounded-xl outline-none ${fieldErrors.email ? "border-red-500" : "border-slate-200"}`}
                    />
                    {fieldErrors.email && (
                      <p className="text-[10px] text-red-500 font-bold">
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase">
                      Компанія
                    </label>
                    <input
                      name="company"
                      defaultValue={lead.company || ""}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase">
                      Сума ($)
                    </label>
                    <input
                      name="value"
                      type="number"
                      defaultValue={lead.value}
                      onChange={() => clearFieldError("value")}
                      className={`w-full p-2.5 bg-slate-50 border rounded-xl outline-none ${fieldErrors.value ? "border-red-500" : "border-slate-200"}`}
                    />
                    {fieldErrors.value && (
                      <p className="text-[10px] text-red-500 font-bold">
                        {fieldErrors.value}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">
                    Статус
                  </label>
                  <select
                    name="status"
                    defaultValue={lead.status}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    {Object.values(LeadStatus).map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">
                    Нотатки
                  </label>
                  <textarea
                    name="notes"
                    defaultValue={lead.notes || ""}
                    rows={4}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                >
                  Зберегти зміни
                </button>
              </form>
            ) : (
              <div className="p-8 space-y-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-black text-slate-900 leading-tight">
                      {lead.name}
                    </h1>
                    <p className="text-slate-500 font-medium">
                      {lead.company || "Приватна особа"}
                    </p>
                  </div>
                  <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-xs font-bold uppercase">
                    {lead.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-8 border-y border-slate-100 py-8">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1 tracking-widest">
                      Контактний Email
                    </p>
                    <p className="text-slate-700 font-medium">
                      {lead.email || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1 tracking-widest">
                      Потенційна сума
                    </p>
                    <p className="text-2xl font-black text-green-600">
                      ${lead.value?.toLocaleString() || "0"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">
                    Нотатки
                  </p>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl italic">
                    {lead.notes || "Нотаток поки що немає..."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <LeadCommentsSection leadId={id} initialComments={comments} />
        </div>
      </div>
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Видалити ліда?"
        message={`Ви збираєтесь видалити ${lead?.name}. Цю дію неможливо буде скасувати.`}
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        isLoading={isDeleting}
      />
    </div>
  );
}
