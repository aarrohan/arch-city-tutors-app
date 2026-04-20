const CT = "America/Chicago";

/** Format a UTC ISO timestamp as a time string in Central Time */
export function formatTimeCT(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: CT,
  });
}

/** Format a UTC ISO timestamp as a date string in Central Time */
export function formatDateCT(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: CT,
  });
}

/** Parse a schedule availability date + time (already in CT) into a Date object.
 *  date format: "MM-DD-YYYY"  |  time format: "H:MM AM/PM"
 *  Manually computes UTC to avoid Hermes' limited Date string parsing. */
export function parseScheduleDateTimeCT(date: string, time: string): Date | null {
  try {
    // Parse date — "MM-DD-YYYY"
    const dateParts = date.split("-").map(Number);
    if (dateParts.length !== 3) return null;
    const [month, day, year] = dateParts;

    // Parse time — "H:MM AM/PM"
    const timeMatch = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!timeMatch) return null;
    let hours = parseInt(timeMatch[1], 10);
    const minutes = parseInt(timeMatch[2], 10);
    const isPM = timeMatch[3].toUpperCase() === "PM";
    if (isPM && hours !== 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;

    // CT offset: CDT = UTC-5 (Mar–Nov), CST = UTC-6 (Nov–Mar)
    const isDST = month >= 3 && month <= 11;
    const offsetHours = isDST ? 5 : 6;

    const utcMs = Date.UTC(year, month - 1, day, hours + offsetHours, minutes);
    const result = new Date(utcMs);
    return isNaN(result.getTime()) ? null : result;
  } catch {
    return null;
  }
}

/** Format a grade value with ordinal suffix (e.g. "3" → "3rd", "Kindergarten" → "Kindergarten") */
export function formatGrade(grade: string): string {
  if (isNaN(Number(grade))) return grade;
  const suffix =
    grade === "1" ? "st" : grade === "2" ? "nd" : grade === "3" ? "rd" : "th";
  return `${grade}${suffix}`;
}

/** Format a name as "First L." or "First L. Grade" to protect privacy */
export function formatName(firstName: string, lastName: string, grade?: string | null): string {
  const lastInitial = lastName ? `${lastName[0]}.` : "";
  const base = `${firstName} ${lastInitial}`.trim();
  return grade ? `${base} ${grade}` : base;
}

export function getRgbValues(rgbString: string): string {
  const match = rgbString.match(/\d+, \d+, \d+/);

  if (match) {
    return match[0];
  }

  return "";
}

export function formatSeconds(secs: number) {
  const minutes = Math.floor(secs / 60);
  const seconds = secs % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
}
