# 📄 PDF Compression API

A TypeScript-based, Docker-powered API and CLI tool for compressing PDF files using Ghostscript with selectable compression profiles and automated cleanup.

[![Author](https://img.shields.io/badge/author-@marktaborosi-blue.svg)](https://github.com/marktaborosi)
[![License](https://img.shields.io/github/license/marktaborosi/pdf-compression-api?color=brightgreen)](https://github.com/marktaborosi/pdf-compression-api/blob/main/LICENSE)
[![Release](https://img.shields.io/github/v/release/marktaborosi/pdf-compression-api?style=flat-square)](https://github.com/marktaborosi/pdf-compression-api/releases)
[![Node Version](https://img.shields.io/badge/node-%3E=18.0.0-green.svg)](https://nodejs.org)
[![CI](https://github.com/marktaborosi/pdf-compression-api/actions/workflows/test.yml/badge.svg)](https://github.com/marktaborosi/pdf-compression-api/actions)
[![Coverage](https://coveralls.io/repos/github/marktaborosi/pdf-compression-api/badge.svg?branch=main)](https://coveralls.io/github/marktaborosi/pdf-compression-api?branch=main)

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
npm run run-compress -- ./original.pdf screen ./out/final.pdf
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

### 🔗 Example Requests

[...All the curl, PHP, Python, JS examples remain unchanged...]

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