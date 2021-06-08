import { setCookie } from "../session";

// function is used to get area details based on lat and long
export const getAreaData = (lat, lng) => {
    let geocoder = new google.maps.Geocoder();
    let latlng = new google.maps.LatLng(lat, lng);

    let currentArea = ''; let subLocIndex = -1; let mainLocIndex = -1; let currentCity = '';

    return new Promise(async (resolve, reject) => {
        await geocoder.geocode({ latLng: latlng }, (results, status) => {
            if (status == google.maps.GeocoderStatus.OK) {

                // to find out sub locality
                results.map((location, index) => {
                    // check if the currentArea is not selected from google result
                    if (currentCity.length < 1) {
                        subLocIndex = location.types.findIndex((typeOfLocation) => typeOfLocation === "sublocality");

                        // check if the sub locality (area) is available in google result
                        if (subLocIndex > -1) {
                            currentArea = location.formatted_address.split(',')[0];
                        }

                        // check if the state or region is available in google result, (in case area not detected)
                        if (currentArea.length < 1) {
                            subLocIndex = location.types.findIndex((typeOfLocation) => typeOfLocation === "administrative_area_level_1");
                            if (subLocIndex > -1) {
                                currentArea = location.formatted_address.split(',')[0];
                            }
                        }

                    }
                })

                // to find out main locality - city, country
                results.map((location, index) => {

                    // check if the city is not selected from google result
                    if (currentCity.length < 1) {
                        mainLocIndex = location.types.findIndex((typeOfLocation) => typeOfLocation === "locality");

                        // check if the locality (city) is available in google result
                        if (mainLocIndex > -1) {
                            currentCity = location.formatted_address.split(',')[0];
                        }

                        // check if the country is available in google result, (in case city not detected)
                        if (currentCity.length < 1) {
                            mainLocIndex = location.types.findIndex((typeOfLocation) => typeOfLocation === "country");
                            if (mainLocIndex > -1) {
                                currentCity = location.formatted_address.split(',')[0];
                            }
                        }
                    }
                })

                setCookie("areaReg", currentArea.trim().toLowerCase());
                setCookie("cityReg", currentCity.trim().toLowerCase());

                return resolve({
                    area: currentArea.toLowerCase(),
                    city: currentCity.toLowerCase()
                });
            }
        });
    })
};
