export function wrap(degree: number) {
    return (degree + 360) % 360;
}

export const camelToText = (value: string): string => {
    const result = value.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
}

export function undef<T>(): T | undefined {
    return undefined;
}

export function def<T>(value: T): T {
    return value;
}

export const nopLamda = (...noop: any) => {
};

export type Out<T> = { value?: T }
export type OutValue<T> = { value: T }

export function out<T>(defaultValue: undefined): Out<T>
export function out<T>(defaultValue: T): OutValue<T>
export function out<T>(defaultValue: T): Out<T> | OutValue<T> {
    return {value: defaultValue}
}

export function randomValue(min: number, max: number) {
    const diff = max - min;
    return simpleRandom() * diff + min;
}

const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false
};
export const dateFormatter = (value: any): string => {
    return new Intl.DateTimeFormat(undefined, options).format(value);
};

export const timeFormatter = (value: any): string => {
    return new Intl.DateTimeFormat(undefined, {
            hour: "numeric", minute: "numeric", second: "numeric"
        }
    ).format(value)
};

export function ddmmyyyyhhmmss(date: Date) {
    return `${`00${date.getMonth() + 1}`.slice(-2)}.${`00${date.getDate()}`.slice(
        -2,
    )}.${date.getFullYear()} ${`00${date.getHours()}`.slice(-2)}:${`00${date.getMinutes()}`.slice(
        -2,
    )}:${`00${date.getSeconds()}`.slice(-2)}`;
}

export async function delay(ms: number) {
    await new Promise((resolve) => setTimeout(resolve, ms));
}

export function simpleRandom() {
    return Math.random(); // NOSONAR
}

export function asyncBlock(asyncFn: () => Promise<void>) {
    asyncFn();
}

export type Await<T> = T extends PromiseLike<infer U> ? U : T

export function qualifiedMember<T>(name: keyof T) {
    return name
}


export function hash(value: any): number {
    if (value === undefined || value === null) return 31
    if (typeof value === "string") return hashString(value)
    if (typeof value === "number") return value
    if (typeof value === "boolean") return value ? 31 : 31 * 31
    if (Array.isArray(value)) return value.reduce((prevValue, child) => prevValue * hash(child), 31)
    if (typeof value === "object") {
        return Object.entries(value).reduce((prevValue, [key, property]) => prevValue * hashString(key) * hash(property), 31)
    }
    return hashString(JSON.stringify(value))
}

export function hashPrimitive(primitive: string | number): number {
    if (typeof primitive === "string") return hashString(primitive)
    return primitive
}

export function hashString(str: string): number {
    var hash = 31, i, chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

export function simpleUuidv4(): string {
    /* eslint-disable */
    const foo: any = [1e7]
    return (foo + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c: any) => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16))
}

export function toFixed(value: number | undefined, fractionDigits: number = 0) {
    return value !== undefined && value !== null && !isNaN(value) ? value.toFixed(fractionDigits) : "";
}

export function toFixedOrEmpty(value: number | string, fractionDigits: number = 0) {
    if (value === '') return ''
    const num = Number(value)
    return num !== undefined && num !== null && !isNaN(num) ? num.toFixed(fractionDigits) : "";
}

export function primitive(str: any) {
    if (str === "true") return true
    if (str === "false") return false
    let rtr = Number(str)
    if (!isNaN(rtr)) return rtr
    return typeof str === 'string' ? str : str + ""
}

export function pad(str: string | number, width: number, ch?: string) {
    ch = ch || '0';
    str = str + '';
    return str.length >= width ? str : new Array(width - str.length + 1).join(ch) + str;
}

export function rgb(r: number, g: number, b: number) {
    // tslint:disable-next-line:no-bitwise
    return (r << 16) + (g << 8) + b;
}

export function replaceAll(str: string, ...findReplace: string[]) {
    if (findReplace.length % 2 !== 0) throw Error("replaceAll: every find string should have replace after it.")
    for (let index = 0; index < findReplace.length; index += 2) {
        str = str.replace(new RegExp(findReplace[index], 'g'), findReplace[index + 1])
    }
    return str
}

export function safeDateTime(date: Date) {
    return replaceAll(date.toISOString(), " ", "_", ":", "-")
}

export async function waitFor(ms: number, untilTrue: () => boolean) {
    for (let i = 0; i < ms / 100 && untilTrue() === false; i++) {
        await delay(100)
    }
}

export function distBearing(deg1: number, deg2: number) {
    const phi = Math.abs(deg2 - deg1) % 360;       // This is either the distance or 360 - distance
    return phi > 180 ? 360 - phi : phi;
}

export function closestBearing(center: number, deg1: number, deg2: number) {
    if (distBearing(center, deg1) <= distBearing(center, deg2)) return wrap(deg1);
    else return wrap(deg2);
}

class Utils {

    static degsToRads = (deg: number) => {
        return (deg * Math.PI) / 180.0;
    }

    static getPositionHipotenus = (pos1: number[], pos2: number[]) => {
        return Math.sqrt(Math.pow((pos1[0] - pos2[0]), 2) + Math.pow((pos1[1] - pos2[1]), 2));
    }

    static getHalkaRenk = (id: number) => {

        if (id == 0)
            return '#04042a';
        else if (id == 1)
            return '#04042a';
        else if (id == 2)
            return '#04042a';
        else if (id == 3)
            return '#04042a';
        else
            return '#04042a';
    }

}

namespace Utils {
    export enum TRACK_TYPES {
        AS = "AS",
        BS = "BS"
    }
}

export default Utils
