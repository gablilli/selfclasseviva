import { type NextRequest, NextResponse } from "next/server"

const CLASSEVIVA_HEADERS = {
  "User-Agent": "CVVS/std/4.1.7 Android/10",
  "Z-Dev-Apikey": "Tg1NWEwNGIgIC0K",
  "Content-Type": "application/json",
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { uid, pass } = body

    console.log("🔐 Login attempt for user:", uid)

    if (!uid || !pass) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 })
    }

    // Check for demo credentials first
    if (uid === "demo" || uid === "student") {
      console.log("🎭 Demo credentials detected, redirecting to mock API")
      return NextResponse.json(
        {
          error: "Demo mode",
          message: "Use demo credentials in the frontend",
          isDemoRequest: true,
        },
        { status: 200 },
      )
    }

    const loginPayload = {
      ident: null,
      pass: pass,
      uid: uid,
    }

    console.log("🚀 Attempting ClasseViva API login...")

    // Direct API call like your Python script
    const response = await fetch("https://web.spaggiari.eu/rest/v1/auth/login", {
      method: "POST",
      headers: CLASSEVIVA_HEADERS,
      body: JSON.stringify(loginPayload),
    })

    const responseText = await response.text()
    console.log("📥 ClasseViva API Response:", {
      status: response.status,
      body: responseText.substring(0, 500),
    })

    if (!response.ok) {
      console.error("❌ Login failed:", response.status, responseText)

      // Check if it's a WAF block
      if (
        responseText.includes("Access Denied") ||
        responseText.includes("Permission") ||
        responseText.includes("HTML")
      ) {
        return NextResponse.json(
          {
            error: "API Access Blocked",
            message: "ClasseViva API is blocking requests from this server environment.",
            details: "The API may have geographic or IP restrictions.",
            isBlocked: true,
          },
          { status: 403 },
        )
      }

      return NextResponse.json(
        {
          error: "Login failed",
          details: "Invalid credentials or server error",
          status: response.status,
        },
        { status: response.status },
      )
    }

    try {
      const data = JSON.parse(responseText)
      console.log("✅ Login successful!")

      // Extract the ident like in your Python script (remove quotes)
      const cleanIdent = data.ident ? data.ident.slice(1, -1) : data.ident

      return NextResponse.json({
        token: data.token,
        release: data.release,
        expire: data.expire,
        ident: {
          id: Number.parseInt(cleanIdent) || 0,
          firstName: data.firstName || "User",
          lastName: data.lastName || "",
          usrType: data.usrType || "S",
          usrId: Number.parseInt(cleanIdent) || 0,
        },
      })
    } catch (parseError) {
      console.error("❌ Failed to parse response as JSON:", parseError)
      return NextResponse.json(
        {
          error: "Invalid response format",
          details: "Server returned non-JSON response",
          rawResponse: responseText.substring(0, 200),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("💥 Login API error:", error)
    return NextResponse.json(
      {
        error: "Server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
