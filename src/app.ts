import express, { Application } from "express";
import { insertQuery, getMovies, getMoviesId, updateMovies, deleteMoviesId } from "./logics";
import { startDatabase } from "./database";
import { checkId, verifyNameExists } from "./middlewares";

const app: Application = express();
app.use(express.json());

app.post("/movies", verifyNameExists, insertQuery);
app.get("/movies", getMovies);
app.get("/movies/:id", checkId, getMoviesId);
app.patch("/movies/:id", checkId, verifyNameExists, updateMovies);
app.delete("/movies/:id", checkId, deleteMoviesId);

app.listen(3000, async () => {
  await startDatabase();
  console.log(`Application is running on port 3000`);
});
