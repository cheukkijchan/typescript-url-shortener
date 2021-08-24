import 'reflect-metadata';
import { createConnection, getConnection, getManager } from 'typeorm';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { nanoid } from 'nanoid';
import 'dotenv';
import { Url } from './entity/Url';

interface Error {
  status?: number;
  message?: string;
  stack?: string;
}

const main = async () => {
  // express and typeorm
  const app = express();
  await createConnection();
  const em = getManager();

  // // clear slug
  // await getConnection()
  //   .createQueryBuilder()
  //   .delete()
  //   .from(Url)
  //   .where('slug = :slug', { slug: 'google' })
  //   .execute();

  // Middleware
  app.enable('trust proxy');
  app.use(helmet());
  app.use(morgan('dev') as ReturnType<typeof morgan>);
  app.use(express.json());

  const options: cors.CorsOptions = {
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'X-Access-Token',
    ],
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: '*',
    preflightContinue: false,
  };

  app.use(cors(options) as any);

  // Api endpoints
  app.get('/', (req, res) => {
    res.json({
      message: 'Url Shortener',
    });
  });

  // redirect to url
  app.get('/:id', async (req, res) => {
    const { id: slug } = req.params;
    try {
      const url = await em.findOne(Url, { slug });
      console.log(url);
      if (url) {
        return res.redirect(url.url);
      }
      return res.status(404).json({
        message: 'Path not found',
      });
    } catch (error) {
      return res.status(404).json({
        message: 'Path not found',
      });
    }
  });

  app.post('/url', async (req, res, next) => {
    // create a url
    let { slug, url } = req.body;
    if (!slug) {
      slug = nanoid(5);
    }
    console.log(slug, url);
    console.log('got the req');
    url = url.trim();
    slug = slug.trim().toLowerCase();
    // check if slug exist
    const slugAlreadyExist = await em.findOne(Url, { slug });
    if (!slugAlreadyExist) {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Url)
        .values({
          slug,
          url,
        })
        .returning('*')
        .execute();
      console.log(result);
      res.json({ slug, url });
    } else {
      return res.json({
        message: 'slug already exist',
      });
    }
    return;
  });

  app.get('/url/:id', (req, res) => {
    // get a short url by id
  });

  app.use(
    (
      error: Error,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      if (error.status) {
        res.status(error.status);
      } else {
        res.status(500);
      }
      res.json({
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
      });
      next();
    }
  );

  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
  });
};

main().catch((error) => {
  console.log(error);
});
