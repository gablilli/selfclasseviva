import { type NextRequest, NextResponse } from "next/server"

const CLASSEVIVA_HEADERS = {
  "User-Agent": "CVVS/std/4.1.7 Android/10",
  "Z-Dev-Apikey": "Tg1NWEwNGIgIC0K",
  "Content-Type": "application/json",
}

export async function GET(request: NextRequest) {
  return handleRequest(request, "GET")
}

export async function POST(request: NextRequest) {
  return handleRequest(request, "POST")
}

async function handleRequest(request: NextRequest, method: string) {
  try {
    const url = new URL(request.url)
    const path = url.searchParams.get("path")
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    console.log(`${method} request to path:`, path)

    if (!token) {
      console.error("Missing authorization token")
      return NextResponse.json({ error: "Missing authorization token" }, { status: 401 })
    }

    if (!path) {
      return NextResponse.json({ error: "Missing path parameter" }, { status: 400 })
    }

    const headers = {
      ...CLASSEVIVA_HEADERS,
      "Z-Auth-Token": token,
    }

    let body: string | undefined
    if (method === "POST") {
      body = await request.text()
    }

    console.log(`Proxying ${method} request to: https://web.spaggiari.eu/rest/v1/${path}`)

    const response = await fetch(`https://web.spaggiari.eu/rest/v1/${path}`, {
      method,
      headers,
      body,
    })

    const responseText = await response.text()
    console.log(`Response for ${path}:`, response.status, responseText.substring(0, 200))

    if (!response.ok) {
      return NextResponse.json(
        { error: "API request failed", details: responseText, status: response.status },
        { status: response.status },
      )
    }

    // Handle different response types
    const contentType = response.headers.get("Content-Type") || ""

    if (contentType.includes("application/json")) {
      try {
        const data = JSON.parse(responseText)
        return NextResponse.json(data)
      } catch {
        return NextResponse.json({ error: "Invalid JSON response", details: responseText })
      }
    } else if (contentType.includes("image/")) {
      // Handle image responses (like avatar)
      const imageResponse = await fetch(`https://web.spaggiari.eu/rest/v1/${path}`, {
        method,
        headers,
        body,
      })

      if (imageResponse.ok) {
        const blob = await imageResponse.blob()
        return new NextResponse(blob, {
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=3600",
          },
        })
      }
    }

    // Return as text for other content types
    return new NextResponse(responseText, {
      status: response.status,
      headers: { "Content-Type": contentType },
    })
  } catch (error) {
    console.error("Proxy API error:", error)
    return NextResponse.json(
      {
        error: "Server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
