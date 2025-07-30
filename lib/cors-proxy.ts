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

class CORSProxyAPI {
  // Using a public CORS proxy as fallback
  private proxyUrls = [
    "https://api.allorigins.win/raw?url=",
    "https://corsproxy.io/?",
    "https://cors-anywhere.herokuapp.com/",
  ]

  async loginWithProxy(credentials: LoginCredentials): Promise<LoginResponse> {
    const baseUrl = "https://web.spaggiari.eu/rest/v1/auth/login"

    const params = new URLSearchParams()
    params.append("uid", credentials.uid)
    params.append("pass", credentials.pass)

    for (const proxyUrl of this.proxyUrls) {
      try {
        console.log(`Trying proxy: ${proxyUrl}`)

        const response = await fetch(`${proxyUrl}${encodeURIComponent(baseUrl)}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Requested-With": "XMLHttpRequest",
          },
          body: params.toString(),
        })

        const responseText = await response.text()
        console.log(`Proxy ${proxyUrl} response:`, response.status, responseText.substring(0, 200))

        if (response.ok && !responseText.includes("Access Denied")) {
          try {
            const data = JSON.parse(responseText)
            console.log(`Proxy login successful with ${proxyUrl}`)
            return data
          } catch {
            console.log(`Proxy ${proxyUrl} returned non-JSON response`)
          }
        }
      } catch (error) {
        console.log(`Proxy ${proxyUrl} failed:`, error)
      }
    }

    throw new Error("All proxy methods failed")
  }
}

export const corsProxyAPI = new CORSProxyAPI()
