let serverHost = ""
let serverPath = "/iot.php"

namespace esp8266 {

    let uploadSuccess = false

    //============================
    // SET SERVER HOST / DOMAIN
    //============================

    //% subcategory="Server"
    //% block="Set Server Host %host"
    export function setServerHost(host: string) {

        serverHost = host
            .replace("http://", "")
            .replace("https://", "")
            .replace("/", "")
    }

    //============================
    // SET SERVER PATH (PHP FILE)
    //============================

    //% subcategory="Server"
    //% block="Set Server Path %path"
    export function setServerPath(path: string) {

        if (!path.startsWith("/")) {
            path = "/" + path
        }

        serverPath = path
    }

    //============================
    // STATUS UPLOAD
    //============================

    //% subcategory="Server"
    //% block="Upload success"
    export function isUploadSuccess(): boolean {
        return uploadSuccess
    }

    //============================
    // SEND DATA TO SERVER
    //============================

    //% subcategory="Server"
    //% block="Send to Server Path %path Data %data"
    export function sendToServer(path: string, data: string) {

        uploadSuccess = false

        // Check WiFi
        if (!isWifiConnected()) return

        // Check Host
        if (serverHost == "") return


        // Connect TCP (HTTP PORT 80)
        if (!sendCommand(
            "AT+CIPSTART=\"TCP\",\"" + serverHost + "\",80",
            "OK",
            5000
        )) return


        // Encode data
        let safeData = formatUrl(data)

        // Build URL
        let url = serverPath + "?path=" + path + "&data=" + safeData


        // HTTP GET Request
        let request = "GET " + url + " HTTP/1.1\r\n"
        request += "Host: " + serverHost + "\r\n"
        request += "Connection: close\r\n\r\n"


        // Send Length
        sendCommand("AT+CIPSEND=" + request.length)

        // Send Request
        sendCommand(request)


        // Check Send OK
        if (getResponse("SEND OK", 3000) == "") {
            sendCommand("AT+CIPCLOSE", "OK", 1000)
            return
        }


        // Check HTTP 200
        if (getResponse("200 OK", 5000) == "") {
            sendCommand("AT+CIPCLOSE", "OK", 1000)
            return
        }


        // Close Connection
        sendCommand("AT+CIPCLOSE", "OK", 1000)

        uploadSuccess = true
    }
}
