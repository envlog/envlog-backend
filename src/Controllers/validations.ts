import { CustomValidator } from "express-validator";

export const isBoolean: CustomValidator = (param: string | undefined) => {
    if (param !== undefined && (param != "true" && param != "false"))
        throw "Il valore deve essere true o false!";

    return true;
}

export const validIfExists = (param: string | undefined) => {
    if (param !== undefined && param === "") 
        throw "Il valore non è valido!";
    
    return true;
}