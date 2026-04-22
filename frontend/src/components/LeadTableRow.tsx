import { Lead } from "@/types/lead.types";
import { getStatusStyle } from "@/utils/styles";

interface Props {
  lead: Lead;
  onClick: () => void;
}

export const LeadTableRow = ({ lead, onClick }: Props) => (
  <tr
    onClick={onClick}
    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
  >
    <td className="px-6 py-4">
      <div className="flex flex-col">
        <span className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
          {lead.name}
        </span>
        <span className="text-xs text-slate-400">{lead.email}</span>
      </div>
    </td>
    <td className="px-6 py-4 text-slate-600">{lead.company || "—"}</td>
    <td className="px-6 py-4">
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(lead.status)}`}
      >
        {lead.status}
      </span>
    </td>
    <td className="px-6 py-4 text-right font-mono font-medium text-slate-700">
      ${lead.value?.toLocaleString() || "0"}
    </td>
  </tr>
);
