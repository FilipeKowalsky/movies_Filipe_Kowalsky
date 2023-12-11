import { client } from "./database";
import { Request, Response } from "express";
import { createMovies, movies, MoviesResult } from "./interfaces";
import { QueryConfig } from "pg";
import format from "pg-format";

const insertQuery = async (req: Request, res: Response): Promise<Response> => {
  const payload: createMovies = req.body

  const queryString: string = `
  INSERT INTO "movies" ("name", "category", "duration", "price")
  VALUES ($1, $2, $3, $4)
  RETURNING *;
  `

  const queryConfig: QueryConfig = {
    text: queryString,
    values: Object.values(payload),
  }

  const queryResult: MoviesResult = await client.query(queryConfig)
  const product: movies = queryResult.rows[0]

  return res.status(201).json(product)
}

const getMovies = async (req: Request, res: Response): Promise<Response> => {
  const { category } = req.query;

  if(category){
    const queryString: string = `SELECT *
    FROM "movies"
    WHERE "category" = $1;
    `

    const queryConfig: QueryConfig = {
      text: queryString,
      values: [ category ]
    }

    const queryResult: MoviesResult = await client.query(queryConfig)

    if(queryResult.rows.length > 0){
      return res.status(200).json(queryResult.rows)
    }
  }
  const queryString: string = `SELECT *
  FROM "movies"
  `
  const queryResult: MoviesResult = await client.query(queryString)
  return res.status(200).json(queryResult.rows)
}

const getMoviesId = async (req: Request, res: Response): Promise<Response> => {
  const id = res.locals.queryResult
  
  return res.status(200).json(id)
}

const updateMovies = async (req: Request, res: Response): Promise<Response> => {
  const { body, params} = req;

  const updateColumns: string[] = Object.keys(body)
  const updateValues: string[] = Object.values(body)
  
  const queryTemplate: string = `
    UPDATE "movies"
    SET (%I) = ROW(%L)
    WHERE id = $1
    RETURNING *;
  `;

  const queryFormat: string = format(
    queryTemplate,
    updateColumns,
    updateValues
  )

  const queryConfig: QueryConfig ={
    text: queryFormat,
    values: [params.id],
  };

  const queryResult: MoviesResult = await client.query(queryConfig)
  const updatedMovies: movies = queryResult.rows[0]

  return res.status(200).json(updatedMovies)
}

const deleteMoviesId = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params

  const queryString: string = `DELETE
    FROM "movies"
    WHERE "id" = $1;
    `;

  await client.query(queryString, [id]);

  return res.status(204).send();
}


export { insertQuery, getMovies, getMoviesId, updateMovies, deleteMoviesId };