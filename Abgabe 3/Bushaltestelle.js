/**
 * @class
 */
class Bushaltestelle {
    /**
     * @param {string} haltestellenname - Name der Haltestelle 
     * @param {array} koordinaten - Koordinaten der Haltestelle
     * @param {string} linie - Buslinie, die die Haltestelle anfährt
     * @param {string} abfahrt - Abfahrten der Haltestelle in den nächsten 5 Minuten
     */
    constructor(haltestellenname,koordinaten,linie,abfahrt)
    {
        this.haltestellenname = haltestellenname;
        this.koordinaten = koordinaten;
        this.linie = linie;
        this.abfahrten = abfahrt;
        
    }

     

}