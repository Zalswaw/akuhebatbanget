
const FIREBASE_HOST = "iot-project.firebaseio.com"

namespace esp8266 {

    let firebaseUploadSuccess = false

    //% subcategory="Firebase"
    //% block="Firebase upload success"
    export function isFirebaseUploadSuccess(): boolean {
        return firebaseUploadSuccess
    }

    //% subcategory="Firebase"
    //% block="Send to Firebase|Path %path|Data %data"
    export function sendToFirebase(path: string, data: string) {

        firebaseUploadSuccess = false

        if (!isWifiConnected()) return

        // Connect SSL
        if (!sendCommand(
            "AT+CIPSTART=\"SSL\",\"" + FIREBASE_HOST + "\",443",
            "OK",
            10000
        )) return

        // JSON body
        let body = data

        // HTTP Request
        let request = "PUT /" + path + ".json HTTP/1.1\r\n"
        request += "Host: " + FIREBASE_HOST + "\r\n"
        request += "Content-Type: application/json\r\n"
        request += "Content-Length: " + body.length + "\r\n\r\n"
        request += body

        // Send
        sendCommand("AT+CIPSEND=" + request.length)
        sendCommand(request)

        // Check send
        if (getResponse("SEND OK", 2000) == "") {
            sendCommand("AT+CIPCLOSE", "OK", 1000)
            return
        }

        // Check Firebase response
        let res = getResponse("200 OK", 3000)

        if (res == "") {
            sendCommand("AT+CIPCLOSE", "OK", 1000)
            return
        }

        sendCommand("AT+CIPCLOSE", "OK", 1000)

        firebaseUploadSuccess = true
    }
}
