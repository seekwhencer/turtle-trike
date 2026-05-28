```bash
sudo apt update
sudo apt install iptables-persistent -y
```

```bash
sudo nano /etc/dhcpcd.conf
```

```bash
interface eth1
  static ip_address=192.168.50.1/24

#interface ap
#  static ip_address=192.168.50.1/24
#  nohook wpa_supplicant

```

```bash
sudo nano /etc/sysctl.conf
```

```bash
net.ipv4.ip_forward=1
```
```bash
sudo sysctl -p
```

```bash
sudo systemctl disable wpa_supplicant@wlan0
```

## mac finden und eintragen
```bash
ip link
```

```bash
sudo nano /etc/udev/rules.d/70-wifi-names.rules
```

```bash
SUBSYSTEM=="net", ACTION=="add", ATTR{address}=="dc:a6:32:1d:08:b3", NAME="ap"
SUBSYSTEM=="net", ACTION=="add", ATTR{address}=="00:c0:ca:a8:28:b6", NAME="uplink"
```



