export abstract class DomainException {
    readonly name: string;
    abstract readonly domainName: string;
    abstract readonly statusCode: number;

    constructor(public readonly message: string){
        this.name = this.constructor.name
    }
}