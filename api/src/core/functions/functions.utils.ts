import { randomBytes } from "crypto";

// Función para generar un codigo de sala unico
export function generateCodeRoom(lentgh: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    const randomArray = randomBytes(length);

    for(let i = 0; i < length; i++){
        result += chars[randomArray[i] % chars.length];
    }
    return result;
}