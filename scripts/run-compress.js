const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const args = process.argv.slice(2);
const [inputPath, profile, customOutputPath] = args;

const validProfiles = ["screen", "ebook", "printer", "prepress"];
const PORT = process.env.PORT || 3000;
const CONTAINER_NAME = process.env.CONTAINER_NAME || "compress-pdf";

if (!inputPath || !profile || !validProfiles.includes(profile)) {
    console.error("❌ Usage: npm run run-compress -- ./path/to/file.pdf [screen|ebook|printer|prepress] [optional/output.pdf]");
    process.exit(1);
}

function isContainerRunning(name) {
    const output = execSync(`docker ps --filter "name=${name}" --format "{{.Names}}"`).toString().trim();
    try {
        const output = execSync(`docker ps --filter "name=${name}" --format "{{.Names}}"`).toString().trim();
        return output.includes(name);
    } catch {
        return false;
    }
}

function isContainerDefined(name) {
    try {
        const output = execSync(`docker ps -a --filter "name=${name}" --format "{{.Names}}"`).toString().trim();
        return output.includes(name);
    } catch {
        return false;
    }
}

async function waitForServerReady(port, retries = 30, delay = 500) {
    const url = `http://localhost:${port}/health`;

    for (let i = 0; i < retries; i++) {
        try {
            await axios.get(url);
            console.log("✅ API is ready.");
            return;
        } catch {
            await new Promise(res => setTimeout(res, delay));
        }
    }

    throw new Error("🚫 Server did not become ready in time.");
}

(async () => {
    const uploadsDir = path.join(__dirname, "../uploads");
    const inputFileName = path.basename(inputPath);
    const destPath = path.join(uploadsDir, inputFileName);

    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
    }

    fs.copyFileSync(inputPath, destPath);

    if (isContainerRunning(CONTAINER_NAME)) {
        console.log("🟢 Docker container is already running.");
    } else if (isContainerDefined(CONTAINER_NAME)) {
        console.log("🔁 Starting existing container...");
        execSync("docker compose start", { stdio: "inherit" });
    } else {
        console.log("🚀 Building and starting container...");
        execSync("docker compose up -d --build", { stdio: "inherit" });
    }

    console.log("⏳ Waiting for API to be ready...");
    try {
        await waitForServerReady(PORT);
    } catch (err) {
        console.error(err.message);
        fs.unlinkSync(destPath);
        process.exit(1);
    }

    console.log(`📤 Uploading '${inputFileName}' with profile '${profile}'...`);

    const form = new FormData();
    form.append("pdf", fs.createReadStream(destPath));

    try {
        const response = await axios.post(
            `http://localhost:${PORT}/compress?profile=${profile}`,
            form,
            {
                headers: form.getHeaders(),
                responseType: "stream",
            }
        );

        const outputPath = customOutputPath
            ? path.resolve(customOutputPath)
            : path.join(process.cwd(), `compressed-${inputFileName}`);

        const writer = fs.createWriteStream(outputPath);
        response.data.pipe(writer);

        writer.on("finish", () => {
            console.log(`✅ Done! Saved as ${outputPath}`);
            fs.unlinkSync(destPath); // cleanup
        });
    } catch (err) {
        console.error("❌ Compression failed:", err.message);
        fs.unlinkSync(destPath);
    }
})();