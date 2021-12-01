import express, { Request, Response } from 'express';
import { body, validationResult, param } from 'express-validator';
import session from '../Connections/session';
import { requiresAuth, isAdmin } from '../Controllers/auth';
import Sensor from '../Models/sensors.model';
import { isBoolean } from '../Utils/isBoolean';
import { loadSensorsCollection } from '../Utils/sensors_loader';

const sensorsRouter = express.Router();
sensorsRouter.use(session);

sensorsRouter.get(
    '/', 
    requiresAuth, 
    async (req: Request<{}, {}, {}, { Type: string | undefined, Name: string | undefined, MCU_ID: string | undefined, Enabled: string | undefined }>, res: Response) => {
        try {
            const { ...filters } = req.query;
            if (filters['Enabled'] && !isBoolean(filters['Enabled']))
                return res.status(400).json({ errors: ["Enabled deve essere un valore booleano!"] });
            const sensors = await Sensor.find({ $and: [filters] });
            return res.status(200).json(sensors);
        } catch (error: any) {
            return res.status(500).json({ errors: [error] });
        }
    }
)

sensorsRouter.get(
    '/:MCU_ID/:Type', 
    requiresAuth,
    param('MCU_ID').exists().isLength({ min: 1 }).withMessage('ID non trovato!'),
    param('Type').exists().isLength({ min: 1 }).withMessage('Tipo non trovato!'), 
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
})

sensorsRouter.post(
    '/', 
    requiresAuth, 
    isAdmin, 
    body('MCU_ID').exists().isLength({ min: 1 }).withMessage('ID non trovato!'),
    body('Name').exists().isLength({ min: 1 }).withMessage('Nome non trovato!'),
    body('Type').exists().isLength({ min: 1 }).withMessage('Tipo non trovato!'),
    async (req: Request<{}, {}, { MCU_ID: string, Name: string, Type: string, Enabled: string | undefined }>, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array().map(item => item.msg) });
        try {
            const { MCU_ID, Name, Type, Enabled } = req.body;
            if (Enabled && !isBoolean(Enabled))
                return res.status(400).json({ errors: ["Enabled deve essere un valore booleano!"] });
            const sensor = await Sensor.findOne({ $or: [{ Name }, { $and: [{ MCU_ID }, { Type }] }] });
            if (sensor) return res.status(409).json({ errors: ["Esiste già un sensore con questo nome o con la combinazione ID/Tipo!"] });
            const newSensor = new Sensor({ MCU_ID, Name, Type, Enabled: (Enabled ? Enabled : true) });
            await newSensor.save();
            await loadSensorsCollection();
            return res.status(201).json({ msg: "Sensore aggiunto!", sensor: newSensor });
        } catch (error: any) {
            return res.status(500).json({ errors: [error] });
        }
    }
)

sensorsRouter.put(
    '/:MCU_ID/',
    requiresAuth,
    isAdmin,
    param('MCU_ID').exists().isLength({ min: 1 }).withMessage('ID non trovato!'),
    body('Enabled').exists().isBoolean().withMessage("Enabled non valido!"),
    async (req: Request<{ MCU_ID: string }, {}, { Enabled: boolean }>, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array().map(item => item.msg) });
        try {
            const { MCU_ID } = req.params;
            const { Enabled } = req.body;
            const sensor = await Sensor.findOne({ MCU_ID });
            if (!sensor) return res.status(404).json({ errors: ["Nessun sensore trovato con questo ID!"] });
            const { modifiedCount } = await Sensor.updateMany({ MCU_ID }, { Enabled });
            await loadSensorsCollection();
            return res.status(200).json({ msg: `${modifiedCount} sensori aggiornati con successo!` });
        } catch (error: any) {
            return res.status(500).json({ errors: [error] });
        }
    }
)

sensorsRouter.put(
    '/:MCU_ID/:Type', 
    requiresAuth, 
    isAdmin, 
    param('MCU_ID').exists().isLength({ min: 1 }).withMessage('ID non trovato!'),
    param('Type').exists().isLength({ min: 1 }).withMessage("Tipo non trovato!"),
    async (req: Request<{ MCU_ID: string, Type: string }, {}, { Name: string | undefined, Enabled: string | undefined }>, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array().map(item => item.msg) });
        try {
            const { MCU_ID, Type } = req.params;
            const { Name, Enabled } = req.body;
            if (Enabled && !isBoolean(Enabled))
                return res.status(400).json({ errors: ["Enabled deve essere un valore booleano!"] });
            if (Name && !Name.length)
                return res.status(400).json({ errors: ["Nome non valido!"] });
            const sensor = await Sensor.findOne({ $and: [{ MCU_ID }, { Type }] });
            if (!sensor) return res.status(404).json({ errors: ["Sensore non trovato!"] });
            const sensorWithName = await Sensor.findOne({ Name });
            if (sensorWithName) return res.status(400).json({ errors: ["Esiste già un sensore con questo nome!"] });
            await Sensor.updateOne(sensor, {
                Name: Name ? Name : sensor.Name,
                Enabled: Enabled ? Enabled : sensor.Enabled 
            });
            await sensor.save();
            await loadSensorsCollection();
            return res.status(200).json({ msg: "Dati sensore aggiornati con successo!", Name, Enabled });
        } catch (error: any) {
            return res.status(500).json({ errors: [error] });
        }
    }
)

sensorsRouter.delete(
    '/:MCU_ID/:Type', 
    requiresAuth, 
    isAdmin,
    param('MCU_ID').exists().isLength({ min: 1 }).withMessage('ID non trovato!'),
    param('Type').exists().isLength({ min: 1 }).withMessage('Tipo non trovato!'),  
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
)

sensorsRouter.delete(
    '/:MCU_ID', 
    requiresAuth, 
    isAdmin,
    param('MCU_ID').exists().isLength({ min: 1 }).withMessage('ID non trovato!'),
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
)

export default sensorsRouter;