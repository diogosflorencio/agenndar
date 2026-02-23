"use server";

import { getSupabaseClient } from "@/lib/supabase/client";
import { revalidatePath } from "next/cache";

const ACTIVE_STATUSES = ["agendado", "pendente", "compareceu"] as const;

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function parseDate(dateStr: string): { dayOfWeek: number; date: string } {
  const d = new Date(dateStr + "T12:00:00");
  return { dayOfWeek: d.getDay(), date: dateStr };
}

export async function getAvailableSlots(
  userId: string,
  collaboratorId: string | null,
  dateStr: string,
  serviceDuration: number
): Promise<{ slots: string[]; error?: string }> {
  const supabase = getSupabaseClient();
  if (!supabase) return { slots: [], error: "Serviço indisponível" };

  const { dayOfWeek, date } = parseDate(dateStr);

  // 1) Janela do dia: override ou availability
  const { data: override } = await supabase
    .from("availability_overrides")
    .select("is_available, start_time, end_time")
    .eq("user_id", userId)
    .eq("date", date)
    .maybeSingle();

  let startMin: number;
  let endMin: number;

  if (override) {
    if (!override.is_available) return { slots: [] };
    startMin = timeToMinutes(override.start_time ?? "09:00");
    endMin = timeToMinutes(override.end_time ?? "18:00");
  } else {
    const { data: av } = await supabase
      .from("availability")
      .select("is_available, start_time, end_time")
      .eq("user_id", userId)
      .eq("day_of_week", dayOfWeek)
      .maybeSingle();
    if (!av || !av.is_available) return { slots: [] };
    startMin = timeToMinutes(av.start_time);
    endMin = timeToMinutes(av.end_time);
  }

  // 2) Pausas (padrão por dia da semana ou override por data)
  const { data: breaksByDay } = await supabase
    .from("break_periods")
    .select("start_time, end_time")
    .eq("user_id", userId)
    .eq("day_of_week", dayOfWeek)
    .is("date", null);
  const { data: breaksByDate } = await supabase
    .from("break_periods")
    .select("start_time, end_time")
    .eq("user_id", userId)
    .eq("date", date)
    .is("day_of_week", null);
  const breaks = [...(breaksByDay ?? []), ...(breaksByDate ?? [])];

  const breakRanges = breaks.map((b) => ({
    start: timeToMinutes(b.start_time),
    end: timeToMinutes(b.end_time),
  }));

  // 3) Buffer do user (opcional)
  const { data: settings } = await supabase
    .from("user_settings")
    .select("buffer_minutes")
    .eq("user_id", userId)
    .maybeSingle();
  const bufferMinutes = settings?.buffer_minutes ?? 0;

  // 4) Agendamentos existentes (com duração do serviço + buffer)
  let q = supabase
    .from("schedules")
    .select("scheduled_time, buffer_minutes, service_id")
    .eq("user_id", userId)
    .eq("scheduled_date", date)
    .in("status", ACTIVE_STATUSES);
  if (collaboratorId) {
    q = q.eq("collaborator_id", collaboratorId);
  }
  const { data: schedulesData } = await q;

  const serviceIds = [
    ...new Set((schedulesData ?? []).map((s: { service_id: string }) => s.service_id)),
  ];
  const { data: servicesData } =
    serviceIds.length > 0
      ? await supabase
          .from("services")
          .select("id, duration_minutes")
          .in("id", serviceIds)
      : { data: [] as { id: string; duration_minutes: number }[] };
  const durationByService: Record<string, number> = {};
  (servicesData ?? []).forEach((s: { id: string; duration_minutes: number }) => {
    durationByService[s.id] = s.duration_minutes;
  });

  const blockedRanges: { start: number; end: number }[] = (
    schedulesData ?? []
  ).map(
    (b: {
      scheduled_time: string;
      buffer_minutes: number | null;
      service_id: string;
    }) => {
      const start = timeToMinutes(b.scheduled_time);
      const dur = durationByService[b.service_id] ?? 30;
      const buf = b.buffer_minutes ?? bufferMinutes;
      return { start, end: start + dur + buf };
    }
  );

  function isInBreak(min: number): boolean {
    return breakRanges.some((r) => min >= r.start && min < r.end);
  }

  function overlapsBlocked(slotStart: number, slotEnd: number): boolean {
    return blockedRanges.some(
      (r) => slotStart < r.end && slotEnd > r.start
    );
  }

  const slots: string[] = [];
  const step = 30;
  for (let min = startMin; min + serviceDuration <= endMin; min += step) {
    const slotEnd = min + serviceDuration;
    if (isInBreak(min) || isInBreak(slotEnd - 1)) continue;
    if (overlapsBlocked(min, slotEnd)) continue;
    slots.push(minutesToTime(min));
  }

  return { slots };
}

export type CreateAppointmentResult =
  | { success: true }
  | { success: false; error: "slot_taken" | "invalid" };

export async function createAppointmentAction(
  clientId: string,
  userId: string,
  serviceId: string,
  collaboratorId: string | null,
  scheduledDate: string,
  scheduledTime: string,
  serviceDuration: number
): Promise<CreateAppointmentResult> {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, error: "invalid" };

  const dateStr = scheduledDate;
  const { slots } = await getAvailableSlots(
    userId,
    collaboratorId,
    dateStr,
    serviceDuration
  );
  if (!slots.includes(scheduledTime)) {
    return { success: false, error: "slot_taken" };
  }

  const { error } = await supabase.from("schedules").insert({
    user_id: userId,
    client_id: clientId,
    service_id: serviceId,
    collaborator_id: collaboratorId || null,
    scheduled_date: dateStr,
    scheduled_time: scheduledTime,
    status: "agendado",
  });

  if (error) {
    if (error.code === "23505" || error.message?.includes("conflict"))
      return { success: false, error: "slot_taken" };
    return { success: false, error: "invalid" };
  }

  revalidatePath("/[slug]", "page");
  return { success: true };
}
