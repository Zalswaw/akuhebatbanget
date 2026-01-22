# ESP8266 AT Mode Extension for Microsoft MakeCode by Muhamad Rizal AKmal

## Initialization (Selecting UART Pins and Baudrate)

Initialize the ESP8266 module (Tx = P16, Rx = P15, Baudrate = 115200).

```blocks
esp8266.init(SerialPin.P16, SerialPin.P15, BaudRate.BaudRate115200)
```

Show happy face if successful.<br>
Show sad face if failed.

```blocks
if (esp8266.isESP8266Initialized()) {
    basic.showIcon(IconNames.Happy)
} else {
    basic.showIcon(IconNames.Sad)
}
```

## WiFi

Connect to WiFi router.

```blocks
esp8266.connectWiFi("my_ssid", "my_password")
```

Show happy face if connected successfully.<br>
Show sad face if failed.

```blocks
if (esp8266.isWifiConnected()) {
    basic.showIcon(IconNames.Happy)
} else {
    basic.showIcon(IconNames.Sad)
}
```

## Internet Time

Initialize internet time to timezone +8.<br>
Show sad face if failed.

```blocks
esp8266.initInternetTime(8)
if (!(esp8266.isInternetTimeInitialized())) {
    basic.showIcon(IconNames.Sad)
}
```

Update the internet time and show the time.<br>
Show sad face if failed.

```blocks
esp8266.updateInternetTime()
if (!(esp8266.isInternetTimeUpdated())) {
    basic.showIcon(IconNames.Sad)
} else {
    basic.showString(esp8266.getHour() + ":" + esp8266.getMinute() + ":" + esp8266.getSecond())
}
```

## License

MIT

## Supported targets

* for PXT/microbit
