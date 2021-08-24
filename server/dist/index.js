"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const nanoid_1 = require("nanoid");
require("dotenv");
const Url_1 = require("./entity/Url");
const main = () => __awaiter(this, void 0, void 0, function* () {
    const app = express_1.default();
    yield typeorm_1.createConnection();
    const em = typeorm_1.getManager();
    app.enable('trust proxy');
    app.use(helmet_1.default());
    app.use(morgan_1.default('dev'));
    app.use(express_1.default.json());
    const options = {
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
    app.use(cors_1.default(options));
    app.get('/', (req, res) => {
        res.json({
            message: 'Url Shortener',
        });
    });
    app.get('/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { id: slug } = req.params;
        try {
            const url = yield em.findOne(Url_1.Url, { slug });
            console.log(url);
            if (url) {
                return res.redirect(url.url);
            }
            return res.status(404).json({
                message: 'Path not found',
            });
        }
        catch (error) {
            return res.status(404).json({
                message: 'Path not found',
            });
        }
    }));
    app.post('/url', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        let { slug, url } = req.body;
        if (!slug) {
            slug = nanoid_1.nanoid(5);
        }
        console.log(slug, url);
        console.log('got the req');
        url = url.trim();
        slug = slug.trim().toLowerCase();
        const slugAlreadyExist = yield em.findOne(Url_1.Url, { slug });
        if (!slugAlreadyExist) {
            const result = yield typeorm_1.getConnection()
                .createQueryBuilder()
                .insert()
                .into(Url_1.Url)
                .values({
                slug,
                url,
            })
                .returning('*')
                .execute();
            console.log(result);
            res.json({ slug, url });
        }
        else {
            return res.json({
                message: 'slug already exist',
            });
        }
        return;
    }));
    app.get('/url/:id', (req, res) => {
    });
    app.use((error, req, res, next) => {
        if (error.status) {
            res.status(error.status);
        }
        else {
            res.status(500);
        }
        res.json({
            message: error.message,
            stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
        });
        next();
    });
    const port = process.env.PORT || 4000;
    app.listen(port, () => {
        console.log(`Listening at http://localhost:${port}`);
    });
});
main().catch((error) => {
    console.log(error);
});
//# sourceMappingURL=index.js.map