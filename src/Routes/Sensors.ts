import express, { Request, Response } from 'express';
import { body, validationResult, param, query } from 'express-validator';
import session from '../Connections/session';
import { requiresAuth, userIsAdmin } from '../Middlewares/auth';
import Sensor from '../Models/sensors.model';
import { loadSensorsCollection } from '../Utils/sensors_loader';
import { nanoid } from 'nanoid';
import {
	isBoolean,
	validIfExists,
	validNumberIfExists,
} from '../Middlewares/validation';
import { getLastInBuffer } from '../Utils/save_to_buffer';
import SensorData from '../Models/sensor_data.model';
import { BatteryData, SensorSchema } from '../types';

const sensorsRouter = express.Router();
sensorsRouter.use(session);

sensorsRouter.get(
	'/',
	requiresAuth,
	query('Enabled')
		.custom(isBoolean)
		.withMessage('Enabled deve essere true o false!'),
	query('Type').custom(validIfExists).withMessage('Tipo non valido!'),
	query('Name').custom(validIfExists).withMessage('Nome non valido!'),
	query('MCU_ID').custom(validIfExists).withMessage('MCU_ID non valido!'),
	query('Limit').custom(validNumberIfExists).withMessage('Limite non valido!'),
	async (
		req: Request<
			{},
			{},
			{},
			{
				Type: string | undefined;
				Name: string | undefined;
				MCU_ID: string | undefined;
				Enabled: string | undefined;
				Group: string | undefined;
				Limit: string | undefined;
			}
		>,
		res: Response
	) => {
		const errors = validationResult(req);
		if (!errors.isEmpty())
			return res
				.status(400)
				.json({ errors: errors.array().map(item => item.msg) });
		try {
			let { Limit, ...filters } = req.query;
			Limit ?? (Limit = '30');
			if (filters.Group === 'null') filters.Group = null!;
			const lowercaseFilters = Object.fromEntries(
				Object.entries(filters).map(([key, item]) => {
					return [
						key,
						['Enabled', 'Group', 'Name'].includes(key) && item
							? item.toLowerCase()
							: item,
					];
				})
			);
			const sensors = await Sensor.find({ $and: [lowercaseFilters] })
				.limit(Number(Limit))
				.sort({ Enabled: -1 });
			return res.status(200).json(sensors);
		} catch (error: any) {
			return res.status(500).json({ errors: [error] });
		}
	}
);

sensorsRouter.get(
	'/groups',
	requiresAuth,
	async (req: Request, res: Response) => {
		try {
			const groups = await Sensor.distinct('Group');
			return res.status(200).json(groups.filter(item => item));
		} catch (error: any) {
			return res.status(500).json({ errors: [error] });
		}
	}
);

sensorsRouter.get(
	'/groups/:Group',
	requiresAuth,
	param('Group')
		.exists()
		.withMessage('Fornire un gruppo!')
		.isLength({ min: 1 })
		.withMessage('Gruppo non valido!'),
	async (req: Request<{ Group: string }>, res: Response) => {
		try {
			let { Group } = req.params;
			Group = Group.toLowerCase();
			const sensors = await Sensor.find({
				Group: Group === 'null' ? null : Group,
			}).sort({ Enabled: -1 });
			return res.status(200).json(sensors);
		} catch (error: any) {
			return res.status(500).json({ errors: [error] });
		}
	}
);

sensorsRouter.get(
	'/:MCU_ID/:Type',
	requiresAuth,
	param('MCU_ID')
		.exists()
		.withMessage('Fornire un ID!')
		.isLength({ min: 1 })
		.withMessage('ID non valido!'),
	param('Type')
		.exists()
		.withMessage('Fornire un tipo!')
		.isLength({ min: 1 })
		.withMessage('Tipo non valido!'),
	async (req: Request<{ MCU_ID: string; Type: string }>, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty())
			return res
				.status(400)
				.json({ errors: errors.array().map(item => item.msg) });
		try {
			const { MCU_ID, Type } = req.params;
			const sensor = await Sensor.findOne({ $and: [{ MCU_ID }, { Type }] });
			if (sensor) {
				let batteryObject: BatteryData | undefined;
				let lastBatteryData: SensorSchema | undefined = getLastInBuffer(
					MCU_ID,
					'Battery'
				);
				if (!lastBatteryData)
					lastBatteryData = await SensorData.findOne({
						$and: [{ MCU_ID }, { Type: 'Battery' }],
					})
						.limit(1)
						.sort({ Received: -1 });
				if (lastBatteryData?.Data)
					batteryObject = await JSON.parse(lastBatteryData.Data);

				const velocityData = await Promise.all(
					[
						'RMSSpeedStatus',
						'AccPeakStatus',
						'FreqData',
						'TimeDomainDataInfo',
					].map(async item => {
						let lastData: SensorSchema | undefined = getLastInBuffer(
							MCU_ID,
							item
						);
						if (!lastData)
							lastData = await SensorData.findOne({
								$and: [{ MCU_ID }, { Type: item }],
							})
								.limit(1)
								.sort({ Received: -1 });
						if (lastData?.Data) return await JSON.parse(lastData.Data);

						return undefined;
					})
				);

				return res.status(200).json({
					sensor,
					BatteryLevel: batteryObject?.Level,
					BatteryVoltage: batteryObject?.Voltage,
					BatteryUnit: batteryObject?.Unit,
					RMSSpeedStatus: velocityData[0],
					AccPeakStatus: velocityData[1],
					FreqData: velocityData[2],
					TimeDomainDataInfo: velocityData[3],
				});
			}
			return res.status(404).json({ errors: ['Sensore non trovato!'] });
		} catch (error: any) {
			return res.status(500).json({ errors: [error] });
		}
	}
);

sensorsRouter.post(
	'/',
	requiresAuth,
	userIsAdmin,
	body('MCU_ID')
		.exists()
		.withMessage('Fornire un ID!')
		.isLength({ min: 1 })
		.withMessage('ID non valido!'),
	body('Type')
		.exists()
		.withMessage('Fornire un tipo!')
		.isLength({ min: 1 })
		.withMessage('Tipo non valido!'),
	body('Enabled')
		.custom(isBoolean)
		.withMessage('Enabled deve essere true o false!'),
	body('Group').custom(validIfExists).withMessage('Gruppo non valido!'),
	async (
		req: Request<
			{},
			{},
			{
				MCU_ID: string;
				Name: string | undefined;
				Type: string;
				Enabled: string | boolean | undefined;
				Group: string | undefined | null;
			}
		>,
		res: Response
	) => {
		const errors = validationResult(req);
		if (!errors.isEmpty())
			return res
				.status(400)
				.json({ errors: errors.array().map(item => item.msg) });
		try {
			let { MCU_ID, Name, Type, Enabled, Group } = req.body;
			if (!MCU_ID.startsWith('0x')) MCU_ID = `0x${MCU_ID}`;
			if (!Name) Name = `${Type}_${nanoid(7)}`;
			if (!Group) Group = null;
			Group = Group ? Group.toLowerCase() : Group;
			Name = Name.toLowerCase();
			typeof Enabled === 'string' && (Enabled = Enabled?.toLowerCase());
			const sensor = await Sensor.findOne({
				$or: [{ Name }, { $and: [{ MCU_ID }, { Type }] }],
			});
			if (sensor)
				return res.status(409).json({
					errors: [
						'Esiste già un sensore con questo nome o con la combinazione ID/Tipo!',
					],
					sensor,
				});
			const newSensor = new Sensor({
				MCU_ID,
				Name,
				Type,
				Enabled: Enabled !== undefined ? Enabled : true,
				Group,
			});
			await newSensor.save();
			await loadSensorsCollection();
			return res
				.status(201)
				.json({ msg: 'Sensore aggiunto!', sensor: newSensor });
		} catch (error: any) {
			return res.status(500).json({ errors: [error] });
		}
	}
);

sensorsRouter.put(
	'/:MCU_ID/',
	requiresAuth,
	userIsAdmin,
	param('MCU_ID')
		.exists()
		.withMessage('Fornire un ID!')
		.isLength({ min: 1 })
		.withMessage('ID non valido!'),
	body('Enabled')
		.custom(isBoolean)
		.withMessage('Enabled deve essere true o false!'),
	body('Group').custom(validIfExists).withMessage('Gruppo non valido!'),
	async (
		req: Request<
			{ MCU_ID: string },
			{},
			{
				Enabled: string | boolean | undefined;
				Group: string | undefined | null;
			}
		>,
		res: Response
	) => {
		const errors = validationResult(req);
		if (!errors.isEmpty())
			return res
				.status(400)
				.json({ errors: errors.array().map(item => item.msg) });
		try {
			const { MCU_ID } = req.params;
			let { Enabled, Group } = req.body;
			Group = Group?.toLowerCase();
			typeof Enabled === 'string' && Enabled?.toLowerCase();
			if (Group === 'null') Group = null;
			const sensor = await Sensor.findOne({ MCU_ID });
			if (!sensor)
				return res
					.status(404)
					.json({ errors: ['Nessun sensore trovato con questo ID!'] });
			const { modifiedCount } = await Sensor.updateMany(
				{ MCU_ID },
				{ Enabled, Group }
			);
			await loadSensorsCollection();
			return res
				.status(200)
				.json({
					msg: `${modifiedCount} ${
						modifiedCount === 1 ? 'sensore aggiornato' : 'sensori aggiornati'
					} con successo!`,
				});
		} catch (error: any) {
			return res.status(500).json({ errors: [error] });
		}
	}
);

sensorsRouter.put(
	'/:MCU_ID/:Type',
	requiresAuth,
	userIsAdmin,
	param('MCU_ID')
		.exists()
		.withMessage('Fornire un ID!')
		.isLength({ min: 1 })
		.withMessage('ID non valido!'),
	param('Type')
		.exists()
		.withMessage('Fornire un tipo!')
		.isLength({ min: 1 })
		.withMessage('Tipo non valido!'),
	body('Enabled')
		.custom(isBoolean)
		.withMessage('Enabled deve essere true o false!'),
	body('Name').custom(validIfExists).withMessage('Nome non valido!'),
	body('Group').custom(validIfExists).withMessage('Gruppo non valido!'),
	async (
		req: Request<
			{ MCU_ID: string; Type: string },
			{},
			{
				Name: string | undefined;
				Enabled: string | undefined;
				Group: string | undefined | null;
			}
		>,
		res: Response
	) => {
		const errors = validationResult(req);
		if (!errors.isEmpty())
			return res
				.status(400)
				.json({ errors: errors.array().map(item => item.msg) });
		try {
			const { MCU_ID, Type } = req.params;
			let { Name, Enabled, Group } = req.body;
			Name = Name?.toLowerCase();
			typeof Enabled === 'string' && Enabled?.toLowerCase();
			Group = Group?.toLowerCase();
			const sensor = await Sensor.findOne({ $and: [{ MCU_ID }, { Type }] });
			if (!sensor)
				return res.status(404).json({ errors: ['Sensore non trovato!'] });
			const sensorWithName = await Sensor.findOne({ Name });
			if (sensorWithName)
				return res
					.status(400)
					.json({ errors: ['Esiste già un sensore con questo nome!'] });
			if (Group === 'null') Group = null;
			await Sensor.updateOne(sensor, {
				Name: Name ? Name : sensor.Name,
				Enabled: Enabled ? Enabled : sensor.Enabled,
				Group: Group !== undefined ? Group : sensor.Group,
			});
			await sensor.save();
			await loadSensorsCollection();
			return res.status(200).json({
				msg: 'Dati sensore aggiornati con successo!',
				Name,
				Enabled,
				Group,
			});
		} catch (error: any) {
			return res.status(500).json({ errors: [error] });
		}
	}
);

sensorsRouter.delete(
	'/:MCU_ID/:Type',
	requiresAuth,
	userIsAdmin,
	param('MCU_ID')
		.exists()
		.withMessage('Fornire un ID!')
		.isLength({ min: 1 })
		.withMessage('ID non valido!'),
	param('Type')
		.exists()
		.withMessage('Fornire un tipo!')
		.isLength({ min: 1 })
		.withMessage('Tipo non valido!'),
	async (req: Request<{ MCU_ID: string; Type: string }>, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty())
			return res
				.status(400)
				.json({ errors: errors.array().map(item => item.msg) });
		try {
			const { MCU_ID, Type } = req.params;
			const sensor = await Sensor.findOne({ $and: [{ MCU_ID }, { Type }] });
			if (!sensor)
				return res.status(404).json({ errors: ['Sensore non trovato!'] });
			await Sensor.deleteOne(sensor);
			await loadSensorsCollection();
			return res.status(200).json({ msg: 'Sensore cancellato', sensor });
		} catch (error: any) {
			return res.status(500).json({ errors: [error] });
		}
	}
);

sensorsRouter.delete(
	'/:MCU_ID',
	requiresAuth,
	userIsAdmin,
	param('MCU_ID')
		.exists()
		.withMessage('Fornire un ID!')
		.isLength({ min: 1 })
		.withMessage('ID non valido!'),
	async (req: Request<{ MCU_ID: string }>, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty())
			return res
				.status(400)
				.json({ errors: errors.array().map(item => item.msg) });
		try {
			const { MCU_ID } = req.params;
			const sensors = await Sensor.find({ MCU_ID });
			if (!sensors.length)
				return res.status(404).json({ errors: ['ID sensore non trovato!'] });
			const { deletedCount } = await Sensor.deleteMany({ MCU_ID });
			await loadSensorsCollection();
			return res.status(200).json({
				msg: `${deletedCount} ${
					deletedCount === 1 ? 'sensore cancellato!' : 'sensori cancellati!'
				}`,
				sensors,
			});
		} catch (error: any) {
			return res.status(500).json({ errors: [error] });
		}
	}
);

export default sensorsRouter;
