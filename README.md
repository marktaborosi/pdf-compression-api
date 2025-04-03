# 📄 PDF Compression API

A TypeScript-based, Docker-powered API and CLI tool for compressing PDF files using Ghostscript with selectable compression profiles and automated cleanup.

[![Author](https://img.shields.io/badge/author-@marktaborosi-blue.svg)](https://github.com/marktaborosi)
[![License](https://img.shields.io/github/license/marktaborosi/pdf-compression-api?color=brightgreen)](https://github.com/marktaborosi/pdf-compression-api/blob/main/LICENSE)
[![Release](https://img.shields.io/github/v/release/marktaborosi/pdf-compression-api?style=flat-square)](https://github.com/marktaborosi/pdf-compression-api/releases)
[![Node Version](https://img.shields.io/badge/node-%3E=18.0.0-green.svg)](https://nodejs.org)
[![CI](https://github.com/marktaborosi/pdf-compression-api/actions/workflows/test.yml/badge.svg)](https://github.com/marktaborosi/pdf-compression-api/actions)

---

## 🚀 Features

- Compress PDFs using Ghostscript with selectable profiles:
  - `screen`, `ebook`, `printer`, `prepress`
- Upload and download compressed PDF via REST API
- Run compression locally using a CLI script
- File cleanup automation using cron (defaults to 5 days)
- Written in **TypeScript** with strong typings
- Fully Dockerized for easy deployment
- Integrated **Jest + Supertest** testing with coverage

---

## 🔧 Configuration

Create a `.env` file based on the provided `.env.example`:

```env
# Container name
CONTAINER_NAME=compress-pdf

# Port the server should run on
PORT=3000

# Number of days to keep uploaded files before deletion
CLEANUP_FILE_AGE_DAYS=5
```

---

## 📥 Installation & Usage

This project is designed to run inside a Docker container because it depends on [Ghostscript](https://ghostscript.com/).

You do **not** need to install Ghostscript on your host machine.

```bash
docker compose up --build
```

Then access the API at:

```
http://localhost:3000
```

If you'd prefer to run it **without Docker**, you must have Ghostscript installed manually:
- [Install Ghostscript](https://ghostscript.com/download.html)
- Run: `npm install && npm run dev`

---

## 🚀 CLI PDF Compression Script

You can compress a PDF file locally using the built-in CLI script:

### ✅ With custom output file:

```bash
npm run compress -- ./original.pdf screen ./out/final.pdf
```

The script will:
- Check if the Docker container is already running
- Start or build the container if needed
- Wait for the API to become available (`/health`)
- Upload your file and save the compressed version

---

## 🧾 Compression Profiles

| Profile     | Description                     | Target Use         | Image DPI | Compression Level |
|-------------|----------------------------------|---------------------|-----------|--------------------|
| `screen`    | Lowest quality & size            | Web viewing         | ~72 DPI   | 🟥 Maximum          |
| `ebook`     | Medium quality                   | E-books             | ~150 DPI  | 🟧 High             |
| `printer`   | High quality for printing        | Office print        | ~300 DPI  | 🟨 Medium           |
| `prepress`  | Highest quality with color info  | Professional print  | ~300 DPI+ | 🟩 Low              |

---

## 📤 API Usage

### `POST /compress?profile=ebook`

- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Field**: `pdf` (your PDF file)

Returns the compressed PDF file for download.

---

# 🔗 Example Requests

Below are examples for calling the compression API in various common programming environments.

---

### ✅ cURL (Command Line)

```bash
curl -F "pdf=@example.pdf" "http://localhost:3000/compress?profile=screen" --output compressed.pdf
```

---

### ✅ PHP (cURL)

```php
<?php
$ch = curl_init();
$data = ['pdf' => new CURLFile('example.pdf', 'application/pdf')];
curl_setopt_array($ch, [
    CURLOPT_URL => 'http://localhost:3000/compress?profile=ebook',
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POSTFIELDS => $data,
]);
$response = curl_exec($ch);
file_put_contents('compressed.pdf', $response);
curl_close($ch);
?>
```

---

### ✅ Python (requests)

```python
import requests

files = {'pdf': open('example.pdf', 'rb')}
response = requests.post('http://localhost:3000/compress?profile=printer', files=files)

with open('compressed.pdf', 'wb') as f:
    f.write(response.content)
```

---

### ✅ Node.js (Axios)

```js
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const form = new FormData();
form.append('pdf', fs.createReadStream('example.pdf'));

axios.post('http://localhost:3000/compress?profile=prepress', form, {
  headers: form.getHeaders(),
  responseType: 'stream'
}).then(res => {
  res.data.pipe(fs.createWriteStream('compressed.pdf'));
});
```

---

### ✅ JavaScript (Browser - Fetch API)

```js
const formData = new FormData();
formData.append('pdf', fileInput.files[0]); // fileInput is a file input element

fetch('http://localhost:3000/compress?profile=ebook', {
  method: 'POST',
  body: formData,
})
  .then(res => res.blob())
  .then(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'compressed.pdf';
    a.click();
  });
```

---

### ✅ Go (net/http)

```go
package main

import (
  "bytes"
  "io"
  "mime/multipart"
  "net/http"
  "os"
)

func main() {
  file, _ := os.Open("example.pdf")
  defer file.Close()

  var b bytes.Buffer
  writer := multipart.NewWriter(&b)
  part, _ := writer.CreateFormFile("pdf", "example.pdf")
  io.Copy(part, file)
  writer.Close()

  req, _ := http.NewRequest("POST", "http://localhost:3000/compress?profile=ebook", &b)
  req.Header.Set("Content-Type", writer.FormDataContentType())

  resp, _ := http.DefaultClient.Do(req)
  defer resp.Body.Close()

  out, _ := os.Create("compressed.pdf")
  io.Copy(out, resp.Body)
}
```


---

## 🧼 Auto-Cleanup

A cron job deletes files in `/uploads` older than `CLEANUP_FILE_AGE_DAYS`. You can configure this in `.env`.

---

## 🧪 Running Tests + Coverage

This project uses [Jest](https://jestjs.io) and [Supertest](https://github.com/ladjs/supertest) for API testing.

### ✅ Run tests with coverage in Docker:

```bash
docker compose run --rm ghostscript npx jest --coverage
```

### ✅ Check coverage locally:

After running the above command, open:

```
coverage/lcov-report/index.html
```

---

## 👤 Author

**Mark Taborosi**  
📧 mark.taborosi@gmail.com

---

## 📜 License

MIT