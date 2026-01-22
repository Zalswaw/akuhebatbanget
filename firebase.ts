let serverHost = ""

namespace esp8266 {

    let uploadSuccess = false

    //============================
    // SET SERVER IP / DOMAIN
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
    // STATUS
    //============================

    //% subcategory="Server"
    //% block="Upload success"
    export function isUploadSuccess(): boolean {
        return uploadSuccess
    }

    //============================
    // SEND DATA TO PHP SERVER
    //============================

    //% subcategory="Server"
    //% block="Send to Server Path %path Data %data"
    export function sendToServer(path: string, data: string) {

        uploadSuccess = false

        // Cek WiFi
        if (!isWifiConnected()) return

        // Cek Server
        if (serverHost == "") return


        // Connect HTTP (PORT 80)
        if (!sendCommand(
            "AT+CIPSTART=\"TCP\",\"" + serverHost + "\",80",
            "OK",
            5000
        )) return


        // Encode data (biar aman di URL)
        let safeData = formatUrl(data)

        // URL ke PHP
        let url = "/iot.php?path=" + path + "&data=" + safeData


        // HTTP GET
        let request = "GET " + url + " HTTP/1.1\r\n"
        request += "Host: " + serverHost + "\r\n"
        request += "Connection: close\r\n\r\n"


        // Send
        sendCommand("AT+CIPSEND=" + request.length)
        sendCommand(request)


        // Cek kirim
        if (getResponse("SEND OK", 3000) == "") {
            sendCommand("AT+CIPCLOSE", "OK", 1000)
            return
        }


        // Cek respon server
        if (getResponse("200 OK", 5000) == "") {
            sendCommand("AT+CIPCLOSE", "OK", 1000)
            return
        }


        sendCommand("AT+CIPCLOSE", "OK", 1000)

        uploadSuccess = true
    }
}
