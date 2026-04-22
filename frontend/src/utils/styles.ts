import { LeadStatus } from "@/types/lead.types";

export const getStatusStyle = (status: LeadStatus) => {
  const styles = {
    [LeadStatus.NEW]: "bg-blue-100 text-blue-700 border-blue-200",
    [LeadStatus.CONTACTED]: "bg-yellow-100 text-yellow-700 border-yellow-200",
    [LeadStatus.IN_PROGRESS]: "bg-purple-100 text-purple-700 border-purple-200",
    [LeadStatus.WON]: "bg-green-100 text-green-700 border-green-200",
    [LeadStatus.LOST]: "bg-red-100 text-red-700 border-red-200",
  };
  return styles[status] || "bg-gray-100 text-gray-700 border-gray-200";
};
