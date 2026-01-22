let firebaseHost = ""
let firebaseAuth = ""

namespace esp8266 {

    let firebaseUploadSuccess = false

    //% subcategory="Firebase"
    //% block="Set Firebase Host %host"
    export function setFirebaseHost(host: string) {

        // Hapus https:// dan /
        firebaseHost = host
            .replace("https://", "")
            .replace("http://", "")
            .replace("/", "")
    }

    //% subcategory="Firebase"
    //% block="Set Firebase Token %token"
    export function setFirebaseToken(token: string) {
        firebaseAuth = token
    }

    //% subcategory="Firebase"
    //% block="Firebase upload success"
    export function isFirebaseUploadSuccess(): boolean {
        return firebaseUploadSuccess
    }

    //% subcategory="Firebase"
    //% block="Send to Firebase Path %path Data %data"
    export function sendToFirebase(path: string, data: string) {

        firebaseUploadSuccess = false

        // Cek WiFi
        if (!isWifiConnected()) return

        // Cek Host
        if (firebaseHost == "") return


        // Connect SSL
        if (!sendCommand(
            "AT+CIPSTART=\"SSL\",\"" + firebaseHost + "\",443",
            "OK",
            10000
        )) return


        let body = data

        // Request
        let request = "PUT /" + path + ".json"

        if (firebaseAuth != "") {
            request += "?auth=" + firebaseAuth
        }

        request += " HTTP/1.1\r\n"

        request += "Host: " + firebaseHost + "\r\n"
        request += "Content-Type: application/json\r\n"
        request += "Connection: close\r\n"
        request += "Content-Length: " + body.length + "\r\n\r\n"
        request += body


        // Send
        sendCommand("AT+CIPSEND=" + request.length)
        sendCommand(request)


        // Cek kirim
        if (getResponse("SEND OK", 3000) == "") {
            sendCommand("AT+CIPCLOSE", "OK", 1000)
            return
        }

        // Cek respon Firebase
        if (getResponse("200 OK", 5000) == "") {
            sendCommand("AT+CIPCLOSE", "OK", 1000)
            return
        }

        sendCommand("AT+CIPCLOSE", "OK", 1000)

        firebaseUploadSuccess = true
    }
}
