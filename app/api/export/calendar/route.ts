import { type NextRequest, NextResponse } from "next/server"

const CLASSEVIVA_HEADERS = {
  "User-Agent": "CVVS/std/4.1.7 Android/10",
  "Z-Dev-Apikey": "Tg1NWEwNGIgIC0K",
  "Content-Type": "application/json",
}

export async function POST(request: NextRequest) {
  try {
    const { token, studentId, months = 3 } = await request.json()

    if (!token || !studentId) {
      return NextResponse.json({ error: "Missing token or studentId" }, { status: 400 })
    }

    // Calculate date range (like the script)
    const now = new Date()
    const startDate = new Date(now)
    startDate.setMonth(now.getMonth() - months)
    const endDate = new Date(now)
    endDate.setMonth(now.getMonth() + months)

    const formatDate = (date: Date) => date.toISOString().slice(0, 10).replace(/-/g, "")

    const start = formatDate(startDate)
    const end = formatDate(endDate)

    console.log(`Fetching agenda from ${start} to ${end}`)

    // Fetch agenda data
    const response = await fetch(`https://web.spaggiari.eu/rest/v1/students/${studentId}/agenda/all/${start}/${end}`, {
      method: "GET",
      headers: {
        ...CLASSEVIVA_HEADERS,
        "Z-Auth-Token": token,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({ error: "Failed to fetch agenda", details: errorText }, { status: response.status })
    }

    const data = await response.json()
    const agenda = data.agenda || []

    console.log(`Found ${agenda.length} agenda items`)

    // Convert to ICS format
    const icsEvents = agenda.map((event: any) => {
      const start = new Date(event.evtDatetimeBegin)
      const end = new Date(event.evtDatetimeEnd)

      return {
        title: event.subjectDesc || event.authorName || "ClasseViva Event",
        description: `${event.evtText || ""}\n\nTeacher: ${event.authorName}\nClass: ${event.classDesc}\n\nSynced from ClasseViva on ${new Date().toLocaleString("it-IT", { timeZone: "Europe/Rome" })}`,
        start: [start.getFullYear(), start.getMonth() + 1, start.getDate(), start.getHours(), start.getMinutes()],
        duration: { minutes: Math.round((end.getTime() - start.getTime()) / 60000) },
        organizer: {
          name: event.authorName,
          email: `${event.authorName?.toLowerCase().replace(/ /g, ".")}@classeviva.spaggiari.eu`,
        },
        location: event.classDesc,
        categories: [event.subjectDesc || "ClasseViva"],
      }
    })

    // Generate ICS content
    const icsHeader = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//SysRegister//ClasseViva Calendar//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "X-WR-CALNAME:ClasseViva Agenda",
      "X-WR-CALDESC:Agenda exported from ClasseViva",
    ].join("\r\n")

    const icsFooter = "END:VCALENDAR"

    const icsBody = icsEvents
      .map((event, index) => {
        const uid = `classeviva-${Date.now()}-${index}@sysregister.app`
        const dtstart = `${event.start[0]}${event.start[1].toString().padStart(2, "0")}${event.start[2].toString().padStart(2, "0")}T${event.start[3].toString().padStart(2, "0")}${event.start[4].toString().padStart(2, "0")}00`
        const dtend = new Date(
          new Date(event.start[0], event.start[1] - 1, event.start[2], event.start[3], event.start[4]).getTime() +
            event.duration.minutes * 60000,
        )
        const dtendStr = `${dtend.getFullYear()}${(dtend.getMonth() + 1).toString().padStart(2, "0")}${dtend.getDate().toString().padStart(2, "0")}T${dtend.getHours().toString().padStart(2, "0")}${dtend.getMinutes().toString().padStart(2, "0")}00`

        return [
          "BEGIN:VEVENT",
          `UID:${uid}`,
          `DTSTART:${dtstart}`,
          `DTEND:${dtendStr}`,
          `SUMMARY:${event.title}`,
          `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}`,
          `ORGANIZER;CN=${event.organizer.name}:MAILTO:${event.organizer.email}`,
          `LOCATION:${event.location || ""}`,
          `CATEGORIES:${event.categories.join(",")}`,
          `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
          "END:VEVENT",
        ].join("\r\n")
      })
      .join("\r\n")

    const icsContent = [icsHeader, icsBody, icsFooter].join("\r\n")

    return new NextResponse(icsContent, {
      headers: {
        "Content-Type": "text/calendar",
        "Content-Disposition": 'attachment; filename="classeviva-agenda.ics"',
      },
    })
  } catch (error) {
    console.error("Calendar export error:", error)
    return NextResponse.json(
      {
        error: "Export failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
