import MQTT from 'async-mqtt';
const topics = ['Temperature/+', 'RMSSpeedStatus/+', 'AccPeakStatus/+', 'FreqData/+', 'Battery/+', 'TimeDomainDataInfo/+', 
                'Pressure/+', 'Infrared/+', 'Brightness/+', 'Anemometer/+'];

const mqttClient = MQTT.connect(process.env.MQTT_BROKER);

mqttClient.on('connect', async () => {
    
    console.log(`[MQTT] Connected to ${process.env.MQTT_BROKER}.`);
    await mqttClient.subscribe(topics);
    console.log(`[MQTT] Subscribed to [${topics.join(', ')}].`);
});

export default mqttClient;
