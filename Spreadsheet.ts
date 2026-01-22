let spreadsheetUrl = ""

namespace esp8266 {

    let uploadSuccess = false

    //============================
    // SET SPREADSHEET URL
    //============================

    //% subcategory="Spreadsheet"
    //% block="Set Spreadsheet URL %url"
    export function setSpreadsheetUrl(url: string) {
        spreadsheetUrl = url
    }

    //============================
    // STATUS
    //============================

    //% subcategory="Spreadsheet"
    //% block="Upload success"
    export function isUploadSuccess(): boolean {
        return uploadSuccess
    }

    //============================
    // SEND DATA TO SPREADSHEET
    //============================

    //% subcategory="Spreadsheet"
    //% block="Send to Spreadsheet Sheet %sheet Data %data"
    export function sendToSpreadsheet(sheet: string, data: string) {
        uploadSuccess = false

        if (!isWifiConnected()) return
        if (spreadsheetUrl == "") return

        // Encode data biar aman di URL
        let safeData = encodeURIComponent(data)

        // URL Web App Google Script
        let url = spreadsheetUrl + "?sheet=" + sheet + "&data=" + safeData

        // HTTP GET request
        if (!sendCommand("AT+CIPSTART=\"TCP\",\"" + extractHost(spreadsheetUrl) + "\",80", "OK", 5000)) return

        let request = "GET " + extractPath(spreadsheetUrl) + "?sheet=" + sheet + "&data=" + safeData + " HTTP/1.1\r\n"
        request += "Host: " + extractHost(spreadsheetUrl) + "\r\n"
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

    //============================
    // HELPER FUNCTIONS
    //============================
    function extractHost(url: string): string {
        let h = url.replace("https://", "").replace("http://", "")
        if (h.indexOf("/") != -1) h = h.substr(0, h.indexOf("/"))
        return h
    }

    function extractPath(url: string): string {
        let h = url.replace("https://", "").replace("http://", "")
        if (h.indexOf("/") != -1) return h.substr(h.indexOf("/"))
        return "/"
    }
}
