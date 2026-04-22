"use client";
import { useState } from "react";
import $api from "@/api/axios";
import { LeadStatus, Lead, LeadFormValues } from "@/types/lead.types";
import { validateLeadForm } from "@/utils/validation";
import axios from "axios";

interface CreateLeadModalProps {
  onClose: () => void;
  onSuccess: (newLead: Lead) => void;
}

export default function CreateLeadModal({
  onClose,
  onSuccess,
}: CreateLeadModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const formValues: LeadFormValues = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      company: formData.get("company") as string,
      value: formData.get("value") ? Number(formData.get("value")) : 0,
      status: formData.get("status") as string,
      notes: formData.get("notes") as string,
    };

    const errors = validateLeadForm(formValues);

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return; // Зупиняємо, якщо є помилки
    }

    try {
      const payload = { ...formValues };

      if (!payload.email || payload.email.trim() === "") {
        delete payload.email;
      }

      const res = await $api.post<Lead>("/leads", payload);
      onSuccess(res.data);
      onClose();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Помилка при створенні");
      } else {
        setError("Щось пішло не так");
      }
    } finally {
      setLoading(false);
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

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800">
            Додати нового ліда
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
              {error}
            </div>
          )}

          {/* Поле: Ім'я */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase ml-1">
              Ім’я клієнта *
            </label>
            <input
              name="name"
              className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none transition-all ${
                fieldErrors.name
                  ? "border-red-500 ring-1 ring-red-100"
                  : "border-slate-200 focus:ring-2 focus:ring-indigo-500"
              }`}
              onChange={() => clearFieldError("name")}
              placeholder="Олександр Іванов"
            />
            {fieldErrors.name && (
              <p className="text-xs text-red-500 ml-1 font-medium">
                {fieldErrors.name}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Поле: Email (Optional) */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase ml-1">
                Email
              </label>
              <input
                name="email"
                type="text" // text замість email для повної кастомної валідації
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none transition-all ${
                  fieldErrors.email
                    ? "border-red-500 ring-1 ring-red-100"
                    : "border-slate-200 focus:ring-2 focus:ring-indigo-500"
                }`}
                onChange={() => clearFieldError("email")}
                placeholder="alex@example.com"
              />
              {fieldErrors.email && (
                <p className="text-xs text-red-500 ml-1 font-medium">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase ml-1">
                Компанія
              </label>
              <input
                name="company"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Tech Solutions"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Поле: Сума */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase ml-1">
                Сума ($)
              </label>
              <input
                name="value"
                type="number"
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none transition-all ${
                  fieldErrors.value
                    ? "border-red-500 ring-1 ring-red-100"
                    : "border-slate-200 focus:ring-2 focus:ring-indigo-500"
                }`}
                onChange={() => clearFieldError("value")}
                placeholder="5000"
              />
              {fieldErrors.value && (
                <p className="text-xs text-red-500 ml-1 font-medium">
                  {fieldErrors.value}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase ml-1">
                Статус
              </label>
              <select
                name="status"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
              >
                {Object.values(LeadStatus).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Кнопки */}
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50"
            >
              Скасувати
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-50 shadow-lg shadow-indigo-100 transition-all"
            >
              {loading ? "Збереження..." : "Створити ліда"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
