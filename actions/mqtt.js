import * as actionTypes from './actionTypes';


export const mqttMsg = (data) => {
    return {
        type: actionTypes.MQTT_MSG,
        data: data
    }
}

