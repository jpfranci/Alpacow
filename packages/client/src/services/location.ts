import axios from "axios";
import { Location } from "../redux/slices/locationSlice";

const baseUrl = "/api/location";

// TODO add return types once backend types are done
const getLoc = async () => {
  const response = await axios.get(`${baseUrl}`);
  return response;
};

const setLoc = async (location: Location) => {
  const response = await axios.put(`${baseUrl}`, location);
  return response;
};

const locationService = {
  getLoc,
  setLoc
};

export default locationService;