import express from "express";
import cors from "cors";
import { router } from "./routes/api.js";
import { PORT } from "./config.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", router);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).json({ error: err.message ?? "Unexpected error" });
});

app.listen(PORT, () => {
  console.log(`AI Code Battle backend listening on http://localhost:${PORT}`);
});
