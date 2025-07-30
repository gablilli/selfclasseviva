import { type NextRequest, NextResponse } from "next/server"

const CLASSEVIVA_HEADERS = {
  "User-Agent": "CVVS/std/4.1.7 Android/10",
  "Z-Dev-Apikey": "Tg1NWEwNGIgIC0K",
  "Content-Type": "application/json",
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("❌ Failed to parse request body:", parseError)
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    const { uid, pass } = body

    console.log("🔐 Login attempt for user:", uid)
    console.log("📡 Request body received:", { uid: uid || "missing", pass: pass ? "***" : "missing" })

    // Validate required fields
    if (!uid || !pass) {
      console.error("❌ Missing credentials:", { uid: !!uid, pass: !!pass })
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

    // Create the payload exactly like your Python script
    const loginPayload = {
      ident: null,
      pass: pass,
      uid: uid,
    }

    console.log("🚀 Attempting ClasseViva API login...")
    console.log("📡 Sending payload:", { ...loginPayload, pass: "***" })

    // Make the API call exactly like your Python script
    const response = await fetch("https://web.spaggiari.eu/rest/v1/auth/login", {
      method: "POST",
      headers: CLASSEVIVA_HEADERS,
      body: JSON.stringify(loginPayload),
    })

    console.log("📥 ClasseViva API Response Status:", response.status)
    console.log("📥 ClasseViva API Response Headers:", Object.fromEntries(response.headers.entries()))

    const responseText = await response.text()
    console.log("📥 ClasseViva API Response Body:", responseText.substring(0, 500))

    // Handle non-200 responses
    if (!response.ok) {
      console.error("❌ ClasseViva API returned error:", response.status)

      // Check if it's a WAF block or access denied
      if (
        responseText.includes("Access Denied") ||
        responseText.includes("Permission") ||
        responseText.includes("HTML") ||
        responseText.includes("Reference") ||
        responseText.includes("<!DOCTYPE")
      ) {
        console.error("🚫 WAF/Security system blocking request")
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

      // Handle other HTTP errors
      return NextResponse.json(
        {
          error: "Login failed",
          details: `HTTP ${response.status}: ${responseText.substring(0, 200)}`,
          status: response.status,
        },
        { status: response.status },
      )
    }

    // Parse successful response
    try {
      const data = JSON.parse(responseText)
      console.log("✅ Login successful!")
      console.log("📄 Parsed response keys:", Object.keys(data))

      // Extract the ident like in your Python script (remove quotes if present)
      let cleanIdent = data.ident
      if (typeof cleanIdent === "string" && cleanIdent.startsWith('"') && cleanIdent.endsWith('"')) {
        cleanIdent = cleanIdent.slice(1, -1)
      }

      const loginResponse = {
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
      }

      console.log("📤 Sending login response:", { ...loginResponse, token: "***" })
      return NextResponse.json(loginResponse)
    } catch (parseError) {
      console.error("❌ Failed to parse ClasseViva response as JSON:", parseError)
      console.error("📄 Raw response:", responseText)
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
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
