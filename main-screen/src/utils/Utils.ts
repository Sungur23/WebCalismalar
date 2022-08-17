
class Utils{

    static degsToRads = (deg : number) =>{
        return (deg * Math.PI) / 180.0;
    }

    static  getPositionHipotenus = (pos1 : any, pos2: any) => {
        return Math.sqrt(Math.pow((pos1[0] - pos2[0]), 2) + Math.pow((pos1[1] - pos2[1]), 2));
    }

    static getHalkaRenk = (id :number) => {

        if (id == 0)
            return '#133C40';
        else if (id == 1)
            return '#113539';
        else if (id == 2)
            return '#102F33';
        else if (id == 3)
            return '#0E272B';
        else
            return '#133C40';
    }

}

namespace Utils{
    export enum TRACK_TYPES{
        AS = "AS",
        BS = "BS"
    }
}

export default Utils
