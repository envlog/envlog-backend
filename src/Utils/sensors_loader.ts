import { SensorInterface } from '../types';
import Sensor from '../Models/sensors.model';

let sensorsCollection: SensorInterface[] | undefined;

const loadSensorsCollection = async () => {
	try {
		sensorsCollection = await Sensor.find();
	} catch (error) {
		console.log(`[DATABASE] Error loading sensors collection: ${error}.`);
	}
};

export { sensorsCollection, loadSensorsCollection };
