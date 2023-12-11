import { QueryConfig } from 'pg';
import { Request, Response, NextFunction, response } from "express";
import { client } from "./database";
import { movies, MoviesResult } from './interfaces';

const checkId = async (req: Request, res: Response, next: NextFunction): Promise<Response | void>  =>{
  const { id } = req.params;

  const queryString: string = `SELECT * 
  FROM "movies" 
  WHERE "id" = $1`;

  const queryResult = await client.query(queryString, [id]);

  if (queryResult.rows.length === 0) {
    return res.status(404).json({ message: "Movie not found!" });
  }

  res.locals.queryResult = queryResult.rows[0];

  return next();
};

const verifyNameExists = async (req: Request, res: Response, next: NextFunction): Promise<Response | void>  =>{
  const { name } = req.body;
  
  const queryTemplate: string = `SELECT *
  FROM "movies"
  WHERE "name" = $1`;

  const queryConfig: QueryConfig = {
    text: queryTemplate,
    values: [name],
  };

  const queryResult: MoviesResult = await client.query(queryConfig);
  const foundMovies: movies[] = queryResult.rows;

  if (foundMovies.length > 0){
    const message: string = `Movie name already exists!`;
    return res.status(409).json({ message });
  }

  return next();
}

export { checkId, verifyNameExists };
