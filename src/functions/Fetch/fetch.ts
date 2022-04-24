import fetch from "node-fetch";
import { config } from "../../index.js";

const Fetch = async (url: string) => {
    const data = await (await fetch(url) as any).json()
    if (data['error'] || data["Error"]) return false;
    return data;
}

const postApi = (endpoint: string, body: any) => fetch(`${config.api_url}/${endpoint}`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' }
})

const fetchApi = (endpoint: string) => Fetch(`${config.api_url}/${endpoint}`);


export {  fetchApi, postApi }



