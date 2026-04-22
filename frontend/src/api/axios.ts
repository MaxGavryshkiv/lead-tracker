import axios from "axios";
import { API_URL } from "@/config/api.config";

const $api = axios.create({
  baseURL: API_URL,
});

export default $api;
