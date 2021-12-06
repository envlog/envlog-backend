import express, { Request, Response } from 'express';
import { body, validationResult, param, query } from 'express-validator';
import session from '../Connections/session';
import { requiresAuth, userIsAdmin } from '../Controllers/auth';
import Sensor from '../Models/sensors.model';
import { loadSensorsCollection } from '../Utils/sensors_loader';
import { nanoid } from 'nanoid';
import { isBoolean, validIfExists, validNumberIfExists } from '../Controllers/validation';

const sensorsRouter = express.Router();
sensorsRouter.use(session);

sensorsRouter.get(
    '/', 
    requiresAuth, 
    query('Enabled').custom(isBoolean).withMessage("Enabled deve essere true o false!"),
    query('Type').custom(validIfExists).withMessage("Tipo non valido!"),
    query('Name').custom(validIfExists).withMessage("Nome non valido!"),
    query('MCU_ID').custom(validIfExists).withMessage("MCU_ID non valido!"),
    query('Limit').custom(validNumberIfExists).withMessage('Limite non valido!'),
    async (req: Request<{}, {}, {}, { Type: string | undefined, Name: string | undefined, MCU_ID: string | undefined, Enabled: string | undefined, Group: string | undefined, Limit: string | undefined }>, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array().map(item => item.msg) });
        try {
            var { Limit, ...filters } = req.query;
            if (filters.Group === 'null') filters.Group = null!;
            const sensors = await Sensor.find({ $and: [filters] }).limit(Number(Limit));
            return res.status(200).json(sensors);
        } catch (error: any) {
            return res.status(500).json({ errors: [error] });
        }
    }
);

sensorsRouter.get(
    '/groups/:Group',
    requiresAuth,
    param('Group').exists().isLength({ min: 1 }).withMessage('Gruppo non valido!'),
    async (req: Request<{ Group: string }>, res: Response) => {
        try {
            var { Group } = req.params;
            const sensors = await Sensor.find({ Group });
            return res.status(200).json(sensors);
        } catch (error: any) {
            return res.status(500).json({ errors: [error] });
        }
    }
);

sensorsRouter.get(
    '/:MCU_ID/:Type', 
    requiresAuth,
    param('MCU_ID').exists().isLength({ min: 1 }).withMessage('ID non valido!'),
    param('Type').exists().isLength({ min: 1 }).withMessage('Tipo non valido!'), 
    async (req: Request<{ MCU_ID: string, Type: string }>, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array().map(item => item.msg) });
        try {
            const { MCU_ID, Type } = req.params;
            const sensor = await Sensor.findOne({ $and: [{ MCU_ID }, { Type }] });
            if (sensor) return res.status(200).json(sensor);
            return res.status(404).json({ errors: ["Sensore non trovato!"] });
        } catch (error: any) {
            return res.status(500).json({ errors: [error] });
        }
    }
);

sensorsRouter.post(
    '/', 
    requiresAuth, 
    userIsAdmin, 
    body('MCU_ID').exists().isLength({ min: 1 }).withMessage('ID non valido!'),
    body('Type').exists().isLength({ min: 1 }).withMessage('Tipo non valido!'),
    body('Enabled').custom(isBoolean).withMessage("Enabled deve essere true o false!"),
    body('Group').custom(validIfExists).withMessage("Gruppo non valido!"),
    async (req: Request<{}, {}, { MCU_ID: string, Name: string | undefined, Type: string, Enabled: string | undefined, Group: string | undefined | null }>, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array().map(item => item.msg) });
        try {
            var { MCU_ID, Name, Type, Enabled, Group } = req.body;
            if (!Name) Name = `${Type}_${nanoid(7)}`;
            if (!Group) Group = null;
            const sensor = await Sensor.findOne({ $or: [{ Name }, { $and: [{ MCU_ID }, { Type }] }] });
            if (sensor) return res.status(409).json({ errors: ["Esiste già un sensore con questo nome o con la combinazione ID/Tipo!"], sensor });
            const newSensor = new Sensor({ MCU_ID, Name, Type, Enabled: (Enabled ? Enabled : true), Group });
            await newSensor.save();
            await loadSensorsCollection();
            return res.status(201).json({ msg: "Sensore aggiunto!", sensor: newSensor });
        } catch (error: any) {
            return res.status(500).json({ errors: [error] });
        }
    }
);

sensorsRouter.put(
    '/:MCU_ID/',
    requiresAuth,
    userIsAdmin,
    param('MCU_ID').exists().isLength({ min: 1 }).withMessage('ID non valido!'),
    body('Enabled').custom(isBoolean).withMessage("Enabled deve essere true o false!"),
    body('Group').custom(validIfExists).withMessage("Gruppo non valido!"),
    async (req: Request<{ MCU_ID: string }, {}, { Enabled: boolean | undefined, Group: string | undefined | null }>, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array().map(item => item.msg) });
        try {
            const { MCU_ID } = req.params;
            var { Enabled, Group } = req.body;
            if (Group === 'null') Group = null;
            const sensor = await Sensor.findOne({ MCU_ID });
            if (!sensor) return res.status(404).json({ errors: ["Nessun sensore trovato con questo ID!"] });
            const { modifiedCount } = await Sensor.updateMany({ MCU_ID }, { Enabled, Group });
            await loadSensorsCollection();
            return res.status(200).json({ msg: `${modifiedCount} sensori aggiornati con successo!` });
        } catch (error: any) {
            return res.status(500).json({ errors: [error] });
        }
    }
);

sensorsRouter.put(
    '/:MCU_ID/:Type', 
    requiresAuth, 
    userIsAdmin, 
    param('MCU_ID').exists().isLength({ min: 1 }).withMessage('ID non valido!'),
    param('Type').exists().isLength({ min: 1 }).withMessage("Tipo non valido!"),
    body('Enabled').custom(isBoolean).withMessage("Enabled deve essere true o false!"),
    body('Name').custom(validIfExists).withMessage("Nome non valido!"),
    body('Group').custom(validIfExists).withMessage("Gruppo non valido!"),
    async (req: Request<{ MCU_ID: string, Type: string }, {}, { Name: string | undefined, Enabled: string | undefined, Group: string | undefined | null }>, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array().map(item => item.msg) });
        try {
            const { MCU_ID, Type } = req.params;
            var { Name, Enabled, Group } = req.body;
            const sensor = await Sensor.findOne({ $and: [{ MCU_ID }, { Type }] });
            if (!sensor) return res.status(404).json({ errors: ["Sensore non trovato!"] });
            const sensorWithName = await Sensor.findOne({ Name });
            if (sensorWithName) return res.status(400).json({ errors: ["Esiste già un sensore con questo nome!"] });
            if (Group === 'null') Group = null;
            await Sensor.updateOne(sensor, {
                Name: Name ? Name : sensor.Name,
                Enabled: Enabled ? Enabled : sensor.Enabled,
                Group: Group !== undefined ? Group : sensor.Group
            });
            await sensor.save();
            await loadSensorsCollection();
            return res.status(200).json({ msg: "Dati sensore aggiornati con successo!", Name, Enabled, Group });
        } catch (error: any) {
            return res.status(500).json({ errors: [error] });
        }
    }
);

sensorsRouter.delete(
    '/:MCU_ID/:Type', 
    requiresAuth, 
    userIsAdmin,
    param('MCU_ID').exists().isLength({ min: 1 }).withMessage('ID non valido!'),
    param('Type').exists().isLength({ min: 1 }).withMessage('Tipo non valido!'),  
    async (req: Request<{ MCU_ID: string, Type: string }>, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array().map(item => item.msg) });
        try {
            const { MCU_ID, Type } = req.params;
            const sensor = await Sensor.findOne({ $and: [{ MCU_ID }, { Type }] });
            if (!sensor) return res.status(404).json({ errors: ["Sensore non trovato!"] });
            await Sensor.deleteOne(sensor);
            await loadSensorsCollection();
            return res.status(200).json({ msg: "Sensore cancellato", sensor });
        } catch (error: any) {
            return res.status(500).json({ errors: [error] });
        }
    }
);

sensorsRouter.delete(
    '/:MCU_ID', 
    requiresAuth, 
    userIsAdmin,
    param('MCU_ID').exists().isLength({ min: 1 }).withMessage('ID non valido!'),
    async (req: Request<{ MCU_ID: string }>, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array().map(item => item.msg) });
        try {
            const { MCU_ID } = req.params;
            const sensors = await Sensor.find({ MCU_ID });
            if (!sensors.length) return res.status(404).json({ errors: ["ID sensore non trovato!"] });
            const { deletedCount } = await Sensor.deleteMany({ MCU_ID });
            await loadSensorsCollection();
            return res.status(200).json({ msg: `${deletedCount} sensori cancellati!`, sensors });
        } catch (error: any) {
            return res.status(500).json({ errors: [error] });
        }
    }
);

export default sensorsRouter;