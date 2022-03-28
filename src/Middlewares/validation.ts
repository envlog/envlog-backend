import { CustomValidator } from 'express-validator';

export const isBoolean: CustomValidator = (param: string | boolean | undefined) => {
	console.log(param)
	if (typeof param === 'string' && param !== undefined && param.toLowerCase() != 'true' && param.toLowerCase() != 'false')
		throw 'Il valore deve essere true o false!';

	return true;
};

export const validIfExists = (param: string | undefined) => {
	if (param !== undefined && param === '') throw 'Il valore non è valido!';

	return true;
};

export const validNumberIfExists = (param: string | undefined) => {
	if (param !== undefined && isNaN(parseInt(param)))
		throw 'Il valore non è valido!';

	return true;
};
