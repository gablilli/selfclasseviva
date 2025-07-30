import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    status: "API is working",
    timestamp: new Date().toISOString(),
    message: "Test endpoint is functional",
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    return NextResponse.json({
      status: "POST request received",
      timestamp: new Date().toISOString(),
      receivedData: body,
      message: "API can receive and parse JSON data",
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "Error parsing JSON",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 400 },
    )
  }
}
