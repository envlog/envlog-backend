export interface DataObject {
    DevAddr: string,
    Type: string,
    MCU_ID: string
}

export interface BatteryData extends DataObject {
    Level: string,
    Voltage: number,
    Unit: string
}

export interface EnvironmentalData extends DataObject {
    Value: string,
    Unit: "C" | "F"
}

export interface TimeDomainData extends DataObject {
    Data: {
        X_AccPeak: number,
        X_RMS_Speed: number,
        Y_AccPeak: number,
        Y_RMS_Speed: number,
        Z_AccPeak: number,
        Z_RMS_Speed: number
    }
}

export interface RMSSpeedData extends DataObject {
    Data: [
        { X_Status: string, X_Value: number, X_Unit: string },
        { Y_Status: string, Y_Value: number, Y_Unit: string },
        { Z_Status: string, Z_Value: number, Z_Unit: string }
    ]
}

export interface AccPeakData extends DataObject {
    Data: [
        { X_Status: string, X_AccPeak: number, X_AccPeakUnit: string },
        { Y_Status: string, Y_AccPeak: number, Y_AccPeakUnit: string },
        { Z_Status: string, Z_AccPeak: number, Z_AccPeakUnit: string }
    ]
}

export interface FreqData extends DataObject {
    Data: [
        { X_Status: string, X_Max_Value: number, X_Max_Freq: number, X_Max_FreqUnit: string },
        { Y_Status: string, Y_Max_Value: number, Y_Max_Freq: number, Y_Max_FreqUnit: string },
        { Z_Status: string, Z_Max_Value: number, Z_Max_Freq: number, Z_Max_FreqUnit: string },
    ]
}

export interface SensorDataBuffer {
    counter: number,
    buffer: { MCU_ID: string, Type: string, Received: string, Data?: string }[]
};

export interface Sensors {
    [key: string]: SensorDataBuffer,
}

export interface SensorSchema {
    Type: string,
    MCU_ID: string,
    Data?: string,
    Received: string
}

export type MQTTPayload = Omit<SensorSchema, 'Received' | 'Data'> & 
                        { DevAddr: string, Unit: string | undefined } & 
                        { [key: string]: string };

export type SensorInterface = Omit<Required<SensorSchema>, 'Data' | 'Received'> & { Name: string, Enabled: boolean, Group: string | null };

export type SocketObject = Omit<SensorSchema, 'Received' | 'Data'> & { Value?: string, Unit?: string };

export type Optional<T, K extends keyof T> = Pick<Required<T>, K> & Partial<T>;


