import { type NextRequest, NextResponse } from "next/server"

const CLASSEVIVA_HEADERS = {
  "User-Agent": "CVVS/std/4.1.7 Android/10",
  "Z-Dev-Apikey": "Tg1NWEwNGIgIC0K",
  "Content-Type": "application/json",
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    let { uid, pass } = body

    console.log("🔐 Login attempt for user:", uid)
    console.log("🌐 Server environment:", {
      nodeEnv: process.env.NODE_ENV,
      host: request.headers.get("host"),
      userAgent: request.headers.get("user-agent"),
      forwarded: request.headers.get("x-forwarded-for"),
    })

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

    // Check for environment variables (for self-hosted setups)
    if (process.env.CLASSEVIVA_USERNAME && process.env.CLASSEVIVA_PASSWORD) {
      console.log("🔧 Using environment variables for authentication")
      if (uid === process.env.CLASSEVIVA_USERNAME && pass === process.env.CLASSEVIVA_PASSWORD) {
        // Use the credentials from environment
        uid = process.env.CLASSEVIVA_USERNAME
        pass = process.env.CLASSEVIVA_PASSWORD
      }
    }

    const loginPayload = {
      ident: null,
      pass: pass,
      uid: uid,
    }

    console.log("🚀 Attempting ClasseViva API login...")
    console.log("📡 Request payload:", { uid, pass: "***" })

    // Self-hosted environments often work better with the API
    const response = await fetch("https://web.spaggiari.eu/rest/v1/auth/login", {
      method: "POST",
      headers: CLASSEVIVA_HEADERS,
      body: JSON.stringify(loginPayload),
    })

    const responseText = await response.text()
    console.log("📥 ClasseViva API Response:", {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseText.substring(0, 500),
    })

    // Check if it's the WAF blocking us
    if (
      responseText.includes("Access Denied") ||
      responseText.includes("Permission") ||
      responseText.includes("HTML") ||
      responseText.includes("Reference")
    ) {
      console.error("🚫 WAF/Security system blocking request")
      console.log("💡 Self-hosting tip: Try running on localhost or different server location")

      return NextResponse.json(
        {
          error: "API Access Blocked",
          message: "ClasseViva API is blocking requests from this server environment.",
          details: "This is common with hosted environments. Self-hosting often resolves this issue.",
          suggestions: [
            "✅ Self-host on your local machine or VPS",
            "✅ Try running on localhost first",
            "✅ Use a VPS in a different geographic location",
            "✅ Check if your Node.js script works from the same server",
            "🎭 Use demo mode to test all features",
          ],
          isBlocked: true,
          selfHostingRecommended: true,
        },
        { status: 403 },
      )
    }

    if (!response.ok) {
      console.error("❌ Login failed:", response.status, responseText)
      return NextResponse.json(
        {
          error: "Login failed",
          details: responseText.includes("Access Denied")
            ? "API access blocked"
            : "Invalid credentials or server error",
          status: response.status,
          selfHostingMayHelp: true,
        },
        { status: response.status },
      )
    }

    try {
      const data = JSON.parse(responseText)
      console.log("✅ Login successful!")

      // Extract the ident like in the script (remove quotes)
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
        selfHostingMayHelp: true,
      },
      { status: 500 },
    )
  }
}
