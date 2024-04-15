export class User{

    constructor(public id: string, public name: string, private _token: string, public expiresDate: Date, public role: string){

    }

    get token(){
        if (!this.expiresDate || this.expiresDate < new Date()) return null;
        return this._token
    }

    // get expiresDate(){
    //     return this._expiresDate
    // }

prova(){
    console.log("prova")
}
}