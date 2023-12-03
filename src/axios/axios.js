import origin from "axios";
import { BASEURL, DOMAIN } from "../api/urls";

const axios = origin.create({
  baseURL: DOMAIN,
});

export const fetchData = async () => {
  const res = await axios.get(BASEURL);
  return res;
};
