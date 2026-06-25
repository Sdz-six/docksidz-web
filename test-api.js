const fs = require('fs');

async function testApi() {
  try {
    const pubKey = 'project_public_caf494ef88e83faceb1b1a714819a47e_m2MVJ2fadb9c673ce0871ccc0c7eaf24578e4';
    const authRes = await fetch("https://api.ilovepdf.com/v1/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ public_key: pubKey }),
    });
    const authData = await authRes.json();
    console.log("Auth:", authData);
    
    if (!authData.token) return;

    const toolsToTest = ['pdfword', 'pdftoword', 'pdf_to_word', 'extract', 'pdfa'];
    
    for (const tool of toolsToTest) {
      console.log(`Testing tool: ${tool}`);
      const startRes = await fetch(`https://api.ilovepdf.com/v1/start/${tool}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${authData.token}` },
      });
      const startData = await startRes.json();
      console.log(`Result for ${tool}:`, startData);
    }
  } catch (e) {
    console.error(e);
  }
}
testApi();
