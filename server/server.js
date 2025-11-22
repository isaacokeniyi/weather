import express from "express";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const port = process.env.PORT;
const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get("/weather", async (req, res) => {
  const city = req.query.city;
  try {
    const data = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}&units=metric`
    ).json();

    if (data.cod !== 200) return res.status(404).json({ error: "City Not Found" });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch weather data" });
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});
