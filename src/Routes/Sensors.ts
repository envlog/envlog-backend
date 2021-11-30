import express, { Request, Response } from 'express';
import { body, validationResult, param } from 'express-validator';
import session from '../Connections/session';
import { requiresAuth, isAdmin } from '../Controllers/auth';
import Sensor from '../Models/sensors.model';
import { loadSensorsCollection } from '../Utils/sensors_loader';

const sensorsRouter = express.Router();
sensorsRouter.use(session);

sensorsRouter.get('/', requiresAuth, async (req, res) => {
    try {
        const sensors = await Sensor.find();
        return res.status(200).json(sensors);
    } catch (error: any) {
        return res.status(500).json({ errors: error });
    }
})

sensorsRouter.get(
    '/:id/:type', 
    requiresAuth,
    param('id').exists().withMessage('ID non trovato!'),
    param('type').exists().withMessage('Tipo non trovato!'), 
    async (req: Request<{ id: string, type: string }>, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        try {
            const { id, type } = req.params;
            const sensor = await Sensor.findOne({ $and: [{ MCU_ID: id }, { Type: type }] });
            if (sensor) return res.status(200).json(sensor);
            return res.status(404).json({ errors: { msg: "Sensore non trovato!" } });
        } catch (error: any) {
            return res.status(500).json({ errors: error });
        }
})

sensorsRouter.post(
    '/', 
    requiresAuth, 
    isAdmin, 
    body('id').exists().withMessage('ID non trovato!'),
    body('name').exists().withMessage('Nome non trovato!'),
    body('type').exists().withMessage('Tipo non trovato!'),
    async (req: Request<{}, {}, { id: string, name: string, type: string, enabled: boolean | undefined }>, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        try {
            const { id, name, type, enabled } = req.body;
            const sensor = await Sensor.findOne({ $or: [{ Name: name }, { $and: [{ MCU_ID: id }, { Type: type }] }] });
            if (sensor) return res.status(409).json({ errors: { msg: "Esiste già un sensore con questo nome o con la combinazione ID/Tipo!" } });
            const newSensor = new Sensor({ MCU_ID: id, Name: name, Type: type, Enabled: (enabled != undefined ? enabled : true) });
            await newSensor.save();
            await loadSensorsCollection();
            return res.status(201).json({ msg: "Sensore aggiunto!", sensor: newSensor });
        } catch (error: any) {
            return res.status(500).json({ errors: error });
        }
    }
)

sensorsRouter.put(
    '/:id/:type', 
    requiresAuth, 
    isAdmin, 
    param('id').exists().withMessage('ID non trovato!'),
    param('type').exists().withMessage('Tipo non trovato!'), 
    async (req: Request<{ id: string, type: string }, {}, { name: string | undefined, enabled: boolean | undefined }>, res: Response) => {
        try {
            const { id, type } = req.params;
            const { name, enabled } = req.body;
            const sensor = await Sensor.findOne({ $and: [{ MCU_ID: id }, { Type: type }] });
            if (!sensor) return res.status(404).json({ errors: { msg: "Sensore non trovato!" } });
            const sensorWithName = await Sensor.findOne({ Name: name });
            if (sensorWithName) return res.status(400).json({ errors: { msg: "Esiste già un sensore con questo nome!" } });
            await Sensor.updateOne(sensor, {
                Name: name ? name : sensor.Name,
                Enabled: enabled != undefined ? enabled : sensor.Enabled
            });
            await sensor.save();
            await loadSensorsCollection();
            return res.status(200).json({ msg: "Dati sensore aggiornati con successo!", name, enabled });
        } catch (error: any) {
            return res.status(500).json({ errors: error });
        }
    }
)

sensorsRouter.delete(
    '/:id/:type', 
    requiresAuth, 
    isAdmin,
    param('id').exists().withMessage('ID non trovato!'),
    param('type').exists().withMessage('Tipo non trovato!'),  
    async (req: Request<{ id: string, type: string }>, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        try {
            const { id, type } = req.params;
            const sensor = await Sensor.findOne({ $and: [{ MCU_ID: id }, { Type: type }] });
            if (!sensor) return res.status(404).json({ errors: { msg: "Sensore non trovato!" } });
            await Sensor.deleteOne(sensor);
            await loadSensorsCollection();
            return res.status(200).json({ msg: "Sensore cancellato", sensor });
        } catch (error: any) {
            return res.status(500).json({ errors: error });
        }
    }
)

sensorsRouter.delete(
    '/:id', 
    requiresAuth, 
    isAdmin,
    param('id').exists().withMessage('ID non trovato!'),
    async (req: Request<{ id: string}>, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        try {
            const { id } = req.params;
            const sensors = await Sensor.find({ MCU_ID: id });
            if (!sensors) return res.status(404).json({ errors: { msg: "ID sensore non trovato!" } });
            await Sensor.deleteMany({ MCU_ID: id });
            await loadSensorsCollection();
            return res.status(200).json({ msg: "Sensori cancellati!", sensors });
        } catch (error: any) {
            return res.status(500).json({ errors: error });
        }
    }
)

export default sensorsRouter;