# Aegisum Explorer

A full-featured, modern blockchain explorer for the Aegisum cryptocurrency.

[Aegisum Explorer](https://explorer.aegisum.com)

---

## 🌟 Features

- Real-time blockchain data sync  
- Block and transaction views  
- Wallet address history and balances  
- Rich list of top holders  
- Mempool viewer  
- Mining/network statistics  
- Mobile-friendly UI  
- Dark/light theme toggle  

---

## ⚙️ Prerequisites

- **Ubuntu 20.04+**  
- **Node.js 18+ (LTS)**  
- **MongoDB 7.0+**  
- **Aegisum Daemon (`aegisumd`) running with RPC enabled**  

---

## 🛠️ Installation Guide

### 1. Install Node.js using NVM

```bash
sudo apt update
sudo apt install curl
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
source ~/.profile
nvm install --lts
```

### 2. Install MongoDB 7.0

- Install one line at a time
```bash
sudo apt-get install gnupg curl
```
```bash
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
```
```bash
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
```
```bash
sudo apt-get update
```
```bash
sudo apt-get install -y mongodb-org
```

### 3. Clone the Repository
```bash
git clone https://github.com/clyntor/explorer.aegisum.com.git
```

### 4. Install Project Dependencies
```bash
cd explorer.aegisum.com
```
```bash
npm install --legacy-peer-deps
```

### 5. Configure Environment Variables
```bash
nano .env
```
- Paste the following in .env:
  (Replace your_rpc_username and your_rpc_password with your actual daemon credentials.)
  ```bash
  # MongoDB Configuration
  MONGODB_URI=mongodb://localhost:27017/explorerdb
  MONGODB_DB=explorerdb

  # Aegisum RPC Configuration
  RPC_HOST=localhost
  RPC_PORT=39940
  RPC_USER=your_rpc_username
  RPC_PASS=your_rpc_password

  # Sync interval in milliseconds
  SYNC_INTERVAL=60000
  ```

### 6. Sync Blockchain Data
```bash
npm install -g pm2
```
```bash
pm2 start scripts/sync-blockchain.js --name aegisum-sync
```
- Check logs / monitor initial sync:
```bash
pm2 logs aegisum-sync
```

### 7. Build and Run the Explorer
```bash
npm run build
```
```bash
pm2 start npm --name aegisum-explorer -- start
```
```bash
pm2 startup
```
- Follow the terminal instructions (copy/paste one-time command shown), then:
```bash
pm2 save
```

## 🌐 Accessing the Explorer

Visit:
```bash
http://your_server_ip:3000
```

## 🌍 Optional: Nginx Reverse Proxy

### 1. Install Nginx
```bash
sudo apt install nginx
```

### 2. Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/aegisum-explorer
```
- Paste this config:
```bash
server {
    listen 80;
    server_name explorer.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

- Enable the site:
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/aegisum-explorer /etc/nginx/sites-enabled/
```

- Test config
```bash
sudo nginx -t
```

- If all is okay, restart Nginx:
```bash
sudo systemctl restart nginx
```

## 🔐 Optional: Enable HTTPS with Let's Encrypt

### 1. Install Certbot
```bash
sudo apt install certbot python3-certbot-nginx
```

### 2. Ensure your domain points to your server DNS with A record.
- See [here](https://www.123-reg.co.uk/support/domains/how-do-i-point-my-domain-name-to-an-ip-address/) if you need more information on how to do this.

### 3. Request SSL certs
```bash
sudo certbot --nginx -d explorer.yourdomain.com
```

## 🔄 Updating the Explorer
```bash
cd explorer.aegisum.com
git pull
npm install --legacy-peer-deps
npm run build
pm2 restart all
```

## 📄 License

This project is under the MIT License. See the [LICENSE](https://github.com/clyntor/explorer.aegisum.com/blob/main/LICENSE) file for details.

## Support

For support inquiries open an issue on GitHub or contact the Aegisum team through [mail](mailto:clynt@aegisum.com) or [discord](discord.gg/aegs).
