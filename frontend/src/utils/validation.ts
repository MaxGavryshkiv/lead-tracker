import { LeadFormValues } from "@/types/lead.types";

export const validateLeadForm = (
  data: LeadFormValues,
): Record<string, string> => {
  const errors: Record<string, string> = {};

  // 1. Ім'я (Required)
  if (!data.name || data.name.trim().length < 2) {
    errors.name = "Ім'я має бути не менше 2 символів";
  }

  // 2. Email (Optional, але якщо є — перевіряємо формат)
  if (data.email && data.email.trim().length > 0) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.email = "Невірний формат email";
    }
  }

  // 3. Сума (Число не може бути менше 0)
  if (data.value !== undefined && data.value < 0) {
    errors.value = "Сума не може бути від'ємною";
  }

  return errors;
};
