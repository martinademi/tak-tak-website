import { post, get } from "../lib/request";

export const authenticateGuest = async () => {
  try {
    const res = await post("/guest/signIn", {
      deviceId: "web",
      deviceType: 3,
      appVersion: "web"
    });
    return res.data;
  } catch (error) {
    const err = {
      error: true,
      ...error.response
    }
  
    return err;
  }
};


export const getLocationZone = async (lat, long, storeType = 0) => {
  try {
    const res = await get(`/storeByStoreType/${storeType}/${lat}/${long}`, {
      latitude: lat,
      longitude: long,
      storeType: 0
    });
    return res.data;
  } catch (error) {
    const err = {
      error: true,
      ...error.response
    }
  
    return err;
  }

  // try {
  //   const res = await post("/business/zones", {
  //     latitude: lat,
  //     longitude:long,
  //     storeType: 0
  //   });
  //   return res.data;
  // } catch (error) {
  //   const err = {
  //     error : true,
  //     ...error.response
  //   }
  
  //   return err;
  // }
}

