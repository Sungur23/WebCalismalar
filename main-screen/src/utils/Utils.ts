export function wrap(degree: number) {
    return (degree + 360) % 360;
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
