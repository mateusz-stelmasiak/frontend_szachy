const API = {
    IP: '192.168.1.6',
    PORT: '33334',
}

//no backtick at the end
export const API_URL='http://'+API.IP+':'+API.PORT;

export function createAPIRequestOptions(method,payload){
    return {
        method: method,
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    };

}
