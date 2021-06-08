import axios from "axios";
export const getGeoInfo = async () => {
  try {
    let response = await axios.get("https://ipapi.co/json/");
  
    let data = response.data;
    return data;
  } catch (e) {
    
  }
};
