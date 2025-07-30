interface LoginCredentials {
  uid: string
  pass: string
}

interface LoginResponse {
  token: string
  release: string
  expire: string
  ident: {
    id: number
    firstName: string
    lastName: string
    usrType: string
    usrId: number
  }
}

class DirectClasseVivaAPI {
  private baseUrl = "https://web.spaggiari.eu/rest/v1"

  async loginDirect(credentials: LoginCredentials): Promise<LoginResponse> {
    const headers = {
      "User-Agent": "CVVS/std/4.1.7 Android/10",
      "Z-Dev-Apikey": "Tg1NWEwNGIgIC0K",
    }

    // Try URL-encoded format (most likely to work)
    const params = new URLSearchParams()
    params.append("uid", credentials.uid)
    params.append("pass", credentials.pass)

    console.log("Attempting direct browser login...")

    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
      mode: "cors", // This will fail if CORS is not allowed
    })

    const responseText = await response.text()
    console.log("Direct login response:", response.status, responseText.substring(0, 200))

    if (!response.ok) {
      throw new Error(`Direct login failed: ${response.status} - ${responseText.substring(0, 100)}`)
    }

    return JSON.parse(responseText)
  }
}

export const directClasseVivaAPI = new DirectClasseVivaAPI()
