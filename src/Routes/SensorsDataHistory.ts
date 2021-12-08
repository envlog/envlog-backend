import express, { Request, Response } from 'express';
import { validationResult, param, query } from 'express-validator';
import session from '../Connections/session';
import { requiresAuth } from '../Controllers/auth';
import { validNumberIfExists } from '../Controllers/validation';
import SensorData from '../Models/sensor_data.model';

const sensorsDataRouter = express.Router();
sensorsDataRouter.use(session);

sensorsDataRouter.get(
    '/:MCU_ID/:Type',
    requiresAuth,
    param('MCU_ID').exists().isLength({ min: 1 }).withMessage('ID non valido!'),
    param('Type').exists().isLength({ min: 1 }).withMessage('Tipo non valido!'), 
    query('Limit').custom(validNumberIfExists).withMessage('Limite non valido!'),
    async (req: Request<{ MCU_ID: string, Type: string }, {}, {}, { Limit: string | undefined }>, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array().map(item => item.msg) });
        try {
            const { MCU_ID, Type } = req.params;
            var { Limit } = req.query;
            if (!Limit) Limit = "10";
            const data = await SensorData.find({ $and: [{ MCU_ID }, { Type }] }).limit(Number(Limit)).sort({ Received: -1 });
            if (!data) return res.status(404).json({ errors: ["Sensore non trovato!"] });
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ errors: [error] });
        }
    }
)

export default sensorsDataRouter;