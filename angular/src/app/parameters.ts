export const baseURL = "http://localhost:8000/";

export function GetApiurl(path: string) {
    return baseURL + path;
}