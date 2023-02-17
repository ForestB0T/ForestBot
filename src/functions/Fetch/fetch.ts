import fetch from "node-fetch";
import { config } from "../../config.js";

const apiKey = process.env.apiKey

/**
 * Post requests
 * @param endpoint
 * @oaram body
 * @returns 
 */
const postApi = async (endpoint: string, body: any) => {
    try {
        const data = await (await fetch(`${config.api_url}/${endpoint}/${apiKey}`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        })).json()
    
        if (!data || data['error'] || data["Error"]) return false;
        return data;
    }
    catch (Err) {
        return false;
    }
}

/**
 * Fetch requests
 * @param endpoint
 * @returns 
 */
const fetchApi = async (endpoint: string) => {
    try {
        const data = await (await fetch(`${config.api_url}/${endpoint}`)).json()
        if (!data || data['error'] || data["Error"]) return false;
        return data;
    } 
    catch (Err) {
        return false;
    }
}

export { fetchApi, postApi }

