let firebaseHost = ""
let firebaseAuth = ""

namespace esp8266 {

    let firebaseUploadSuccess = false

    //% subcategory="Firebase"
    //% block="Set Firebase Host %host"
    export function setFirebaseHost(host: string) {
        firebaseHost = host
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

        if (!isWifiConnected()) return

        if (!sendCommand(
            "AT+CIPSTART=\"SSL\",\"" + firebaseHost + "\",443",
            "OK",
            10000
        )) return

        let body = data

        let request = "PUT /" + path + ".json"

        if (firebaseAuth != "") {
            request += "?auth=" + firebaseAuth
        }

        request += " HTTP/1.1\r\n"

        request += "Host: " + firebaseHost + "\r\n"
        request += "Content-Type: application/json\r\n"
        request += "Content-Length: " + body.length + "\r\n\r\n"
        request += body

        sendCommand("AT+CIPSEND=" + request.length)
        sendCommand(request)

        if (getResponse("SEND OK", 2000) == "") return

        if (getResponse("200 OK", 3000) == "") return

        sendCommand("AT+CIPCLOSE", "OK", 1000)

        firebaseUploadSuccess = true
    }
}
