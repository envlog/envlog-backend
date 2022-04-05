export const isVibrationSensor = (type: string) => {
	return (
		type === 'TimeDomainDataInfo' ||
		type === 'RMSSpeedStatus' ||
		type === 'AccPeakStatus' ||
		type === 'FreqData'
	);
};
