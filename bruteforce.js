const pubKey = 'project_public_caf494ef88e83faceb1b1a714819a47e_m2MVJ2fadb9c673ce0871ccc0c7eaf24578e4';

async function run() {
  const authRes = await fetch("https://api.ilovepdf.com/v1/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ public_key: pubKey }),
  });
  const authData = await authRes.json();
  const token = authData.token;

  const tools = ['pdfdoc', 'pdfdocx', 'pdf_docx', 'pdf-docx', 'pdf_word', 'pdf-word', 'pdfoffice', 'pdf2word', 'pdf2docx', 'wordpdf', 'docxpdf', 'solid'];
  
  for (const tool of tools) {
    const res = await fetch(`https://api.ilovepdf.com/v1/start/${tool}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.server) {
      console.log(`[SUCCESS] Found tool: ${tool}`);
    } else {
      console.log(`[FAILED] Tool: ${tool}`);
    }
  }
}
run();
