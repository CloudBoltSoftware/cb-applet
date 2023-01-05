// write an express server that serves any file in the src or dist folders in this directory with the mimetype application/javascript
// the server should listen on port 3000

import express from "express";
const app = express();
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// add headers to all responses
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Cache-Control", "no-cache");
  next();
});

app.get("/src/*", (req, res) => {
  res.type("application/javascript");
  res.sendFile(path.join(__dirname, req.path));
});

app.get("/dist/*", (req, res) => {
  res.type("application/javascript");
  res.sendFile(path.join(__dirname, req.path));
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
