namespace esp8266 {

    let uploadSuccess = false
    let serverHost = ""

    //============================
    // SET SERVER IP / DOMAIN
    //============================

    //% subcategory="Firebase"
    //% block="Set Firebase Host %host"
    export function setServerHost(host: string) {
        serverHost = host
            .replace("http://", "")
            .replace("https://", "")
            .replace("/", "")
    }

    //============================
    // STATUS
    //============================

    //% subcategory="Firebase"
    //% block="Upload success"
    export function isUploadSuccess(): boolean {
        return uploadSuccess
    }

    //============================
    // SEND DATA TO FIREBASE
    //============================

    //% subcategory="Firebase"
    //% block="Send to Firebase Path %path Data %data"
    export function sendToServer(path: string, data: string) {

        uploadSuccess = false

        if (!isWifiConnected()) return
        if (serverHost == "") return

        if (!sendCommand(
            "AT+CIPSTART=\"TCP\",\"" + serverHost + "\",80",
            "OK",
            5000
        )) return

        let safeData = formatUrl(data)
        let url = "/iot.php?path=" + path + "&data=" + safeData

        let request = "GET " + url + " HTTP/1.1\r\n"
        request += "Host: " + serverHost + "\r\n"
        request += "Connection: close\r\n\r\n"

        sendCommand("AT+CIPSEND=" + request.length)
        sendCommand(request)

        if (getResponse("SEND OK", 3000) == "") {
            sendCommand("AT+CIPCLOSE", "OK", 1000)
            return
        }

        if (getResponse("200 OK", 5000) == "") {
            sendCommand("AT+CIPCLOSE", "OK", 1000)
            return
        }

        sendCommand("AT+CIPCLOSE", "OK", 1000)
        uploadSuccess = true
    }
}
