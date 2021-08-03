import fetch from 'node-fetch'

export default class API {
    public static async query(url: string) {
        return await fetch(`https://api.warframestat.us/${url}`, {
            method: 'GET'
        }).then(res => res.json())
    }
}