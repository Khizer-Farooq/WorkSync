import { NextResponse } from "next/server";

export async function GET() {
  const now = new Date();

  return NextResponse.json({
    success: true,
    message: "Timezone fetched successfully",
    data: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      currentTime: now.toISOString(),
      localTime: now.toLocaleString(),
      offsetMinutes: now.getTimezoneOffset(),
    },
  });
}