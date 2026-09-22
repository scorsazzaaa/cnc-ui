import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [command, setCommand] = useState('');
  const [response, setResponse] = useState('');

  const sendCommand = async () => {
    try {
      const encryptedCommand = encrypt(command);
      const result = await axios.post('https://your-ngrok-url.ngrok.io/receive', encryptedCommand, {
        headers: { 'Content-Type': 'application/octet-stream' }
      });
      setResponse(decrypt(result.data));
    } catch (error) {
      console.error(error);
      setResponse("Error sending command.");
    }
  };

  const encrypt = (data) => {
    // Implement AES encryption here
    const iv = crypto.randomBytes(16).toString('hex');
    const cipher = crypto.createCipheriv('aes-256-cfb', Buffer.from('ThisIsAVerySecureKey1234567890'), Buffer.from(iv, 'hex'));
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv + encrypted;
  };

  const decrypt = (data) => {
    // Implement AES decryption here
    const iv = data.slice(0, 32);
    const encrypted = data.slice(32);
    const decipher = crypto.createDecipheriv('aes-256-cfb', Buffer.from('ThisIsAVerySecureKey1234567890'), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  };

  return (
    <div className="App">
      <h1>CNC Control Panel</h1>
      <input
        type="text"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        placeholder="Enter command..."
      />
      <button onClick={sendCommand}>Send Command</button>
      <pre>{response}</pre>
    </div>
  );
}

export default App;
