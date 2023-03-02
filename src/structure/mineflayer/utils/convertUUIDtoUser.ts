import fetch from "node-fetch";

export default async function convertUUIDtoUsername(uuid: string) {
    try {
        const res = await fetch(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`)
        if (!res.ok) return false;
        const data = await res.json() as any;
        return data.username;
    } catch (err) {
        return false;
    }
}