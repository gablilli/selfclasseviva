import { type NextRequest, NextResponse } from "next/server"

const CLASSEVIVA_HEADERS = {
  "User-Agent": "CVVS/std/4.1.7 Android/10",
  "Z-Dev-Apikey": "Tg1NWEwNGIgIC0K",
  "Content-Type": "application/json",
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const path = searchParams.get("path")
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")

    if (!path) {
      return NextResponse.json({ error: "Missing path parameter" }, { status: 400 })
    }

    if (!token) {
      return NextResponse.json({ error: "Missing authorization token" }, { status: 401 })
    }

    const url = `https://web.spaggiari.eu/rest/v1/${path}`
    console.log("📡 Making request to:", url)

    const headers = {
      ...CLASSEVIVA_HEADERS,
      "Z-Auth-Token": token,
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
    })

    const responseText = await response.text()
    console.log("📥 API Response:", response.status, responseText.substring(0, 200))

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "API request failed",
          status: response.status,
          details: responseText,
        },
        { status: response.status },
      )
    }

    // Handle avatar requests (binary data)
    if (path.includes("avatar")) {
      const blob = await fetch(url, { headers }).then((r) => r.blob())
      return new NextResponse(blob, {
        headers: {
          "Content-Type": response.headers.get("Content-Type") || "image/jpeg",
        },
      })
    }

    try {
      const data = JSON.parse(responseText)
      return NextResponse.json(data)
    } catch (parseError) {
      return NextResponse.json(
        {
          error: "Invalid JSON response",
          rawResponse: responseText.substring(0, 500),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("API proxy error:", error)
    return NextResponse.json(
      {
        error: "Server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
