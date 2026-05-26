```bash
sudo apt update
sudo apt install iptables-persistent -y
```

```bash
sudo nano /etc/dhcpcd.conf
```

```bash
interface wlan1
static ip_address=192.168.50.1/24
nohook wpa_supplicant

interface eth0
static ip_address=192.168.60.1/24
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
sudo iptables -t nat -A POSTROUTING -o wlan0 -j MASQUERADE

sudo iptables -A FORWARD -i wlan1 -o wlan0 -j ACCEPT
sudo iptables -A FORWARD -i wlan0 -o wlan1 -m state --state RELATED,ESTABLISHED -j ACCEPT

sudo iptables -A FORWARD -i eth0 -o wlan0 -j ACCEPT
sudo iptables -A FORWARD -i wlan0 -o eth0 -m state --state RELATED,ESTABLISHED -j ACCEPT

sudo netfilter-persistent save
```




