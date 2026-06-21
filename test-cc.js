const API_KEY = process.argv[2];

fetch('https://api.cloudconvert.com/v2/users/me', {
  headers: {
    'Authorization': `Bearer ${API_KEY}`
  }
}).then(res => res.json()).then(data => {
  console.log("User Info:", data);
}).catch(err => {
  console.error(err);
});

fetch('https://api.cloudconvert.com/v2/jobs', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    tasks: {
      "import-it": { operation: "import/url", url: "https://example.com/file.docx" }
    }
  })
}).then(res => res.json()).then(data => {
  console.log("Job Create Test:", data);
}).catch(err => {
  console.error(err);
});
