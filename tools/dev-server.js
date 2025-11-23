// tools/dev-server.js
const express = require('express');
const path = require('path');
const qrcode = require('qrcode-terminal');
const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

function startDevServer(directory, port = 3000, showQR = false) {
  const app = express();
  
  // Serve static files
  app.use(express.static(directory));
  
  // Fallback to index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(directory, 'index.html'));
  });
  
  app.listen(port, '0.0.0.0', () => {
    const localIP = getLocalIP();
    const localUrl = `http://localhost:${port}`;
    const networkUrl = `http://${localIP}:${port}`;
    
    console.log('\n🚀 Dev server running!\n');
    console.log(`   Local:   ${localUrl}`);
    console.log(`   Network: ${networkUrl}\n`);
    
    if (showQR) {
      console.log('📱 Scan this QR code with your phone:\n');
      qrcode.generate(networkUrl, { small: true });
      console.log('');
    }
    
    console.log('Press Ctrl+C to stop\n');
  });
}

module.exports = { startDevServer };
