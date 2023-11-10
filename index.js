import express from "express";
import aseo_macul from "./aseo_macul.js";
import { query, validationResult } from "express-validator";

const app = express();

app.use(express.json());
app.disable("x-powered-by");

// Route
app.get(
  "/extractor",
  query("id").notEmpty(),
  async (req, res) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
      const data = req.query.id;
      const rol = data.substring(0,data.indexOf('-'))
      const dv= data.substring(data.indexOf('-')+1,data.length)

      const total = await aseo_macul(rol, dv);
      res.status(200).json(total);
    } else {
      return res.status(400).send({ id: "Error en rol" });
    }
  }
);

// PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server hosted in http://localhost:${PORT}`);
});
