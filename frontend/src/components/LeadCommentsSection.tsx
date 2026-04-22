"use client";
import { useState } from "react";
import $api from "@/api/axios";
import { Comment } from "@/types/lead.types";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

interface Props {
  leadId: string;
  initialComments: Comment[];
}

export default function LeadCommentsSection({
  leadId,
  initialComments,
}: Props) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const maxLength = 500;

  const handleAddComment = async (e: React.SubmitEvent) => {
    e.preventDefault();

    const trimmedComment = newComment.trim();

    if (!trimmedComment) return;

    // Перевірка на 500 символів
    if (trimmedComment.length > maxLength) {
      toast.error(`Коментар занадто довгий (макс. ${maxLength} символів)`);
      return;
    }

    try {
      const res = await $api.post<Comment>(`/leads/${leadId}/comments`, {
        text: trimmedComment,
      });
      setComments((prev) => [res.data, ...prev]);
      setNewComment("");
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message);
      } else {
        toast.error("Помилка при додаванні коментаря");
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span>💬</span> Коментарі
      </h3>

      <form onSubmit={handleAddComment} className="mb-6">
        <div className="relative">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Напишіть щось..."
            className={`w-full p-3 bg-slate-50 border rounded-2xl text-sm focus:ring-2 outline-none transition-all min-h-100px ${
              newComment.length > maxLength
                ? "border-red-400 focus:ring-red-100"
                : "border-slate-200 focus:ring-indigo-500"
            }`}
          />
          {/* Лічильник символів */}
          <div
            className={`text-[10px] text-right mt-1 font-medium ${
              newComment.length > maxLength ? "text-red-500" : "text-slate-400"
            }`}
          >
            {newComment.length} / {maxLength}
          </div>
        </div>

        <button
          type="submit"
          disabled={!newComment.trim() || newComment.length > maxLength}
          className="mt-2 w-full bg-slate-900 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Додати коментар
        </button>
      </form>

      <div className="space-y-4 max-h-500px overflow-y-auto pr-2 custom-scrollbar">
        {comments.map((c) => (
          <div
            key={c.id}
            className="p-4 bg-slate-50 rounded-2xl border border-slate-100"
          >
            {/* break-words — критично важливий для довгих рядків */}
            <p className="text-sm text-slate-700 leading-relaxed wrap-break-word whitespace-pre-wrap">
              {c.text}
            </p>
            <p className="text-[10px] text-slate-400 mt-2 font-medium uppercase tracking-tight">
              {new Date(c.createdAt).toLocaleString()}
            </p>
          </div>
        ))}

        {comments.length === 0 && (
          <p className="text-center py-10 text-slate-400 text-sm italic">
            Ще немає коментарів
          </p>
        )}
      </div>
    </div>
  );
}
