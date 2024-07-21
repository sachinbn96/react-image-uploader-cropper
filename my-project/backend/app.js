import fs from "node:fs/promises";

import bodyParser from "body-parser";
import express from "express";
import multer from "multer";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/getmetadata", async (req, res) => {
  const metaData = await fs.readFile("./data/metadata.json", "utf8");
  res.json(JSON.parse(metaData));
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const Data = multer({ storage: storage });

app.post("/upload", Data.any("files"), (req, res) => {
  if (res.status(200)) {
    res.json({ message: "Successfully uploaded files" });
    res.end();
  }
});

app.post("/meta", async (req, res) => {
  const metaData = req.body.metaData;

  if (metaData.length === 0) {
    return res.status(400).json({ message: "Missing data." });
  }
  await fs.writeFile("./data/metadata.json", JSON.stringify(metaData));
  res.status(201).json({ message: "Metadata created!" });
});

app.use((req, res) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  res.status(404).json({ message: "Not found" });
});

app.listen(3000);
