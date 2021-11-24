import MQTT from 'async-mqtt';

const topics = ['Temperature/+', 'RMSSpeedStatus/+', 'AccPeakStatus/+', 'FreqData/+', 'Battery/+'];

const mqttClient = MQTT.connect("mqtt://test.mosquitto.org/");

mqttClient.on('connect', async () => await mqttClient.subscribe(topics));

export default mqttClient;