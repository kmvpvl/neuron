// Link costs
//
//
//
//
type NeuronsArray = Array<Neuron>;

export interface IBrain {
    _name: string;
    _neurons: NeuronsArray;
}

export class Brain implements IBrain {
    _name: string = "";
    _neurons: Neuron[] = new Array(0);
    addNeuron(name: string, SWCount: number, SHCount: number, ACount: number): Neuron {
        const n = new Neuron(name, SWCount, SHCount, ACount);
        this._neurons.push(n);
        return n;
    }

    get neurons(): NeuronsArray {return this._neurons} 
}

interface ILink {
    image?: {
        canvas: HTMLCanvasElement;
        x: number;
        y: number;
    };
    neuron?: {
        neuron: INeuron;
        Aindex: number;
    }
}
export interface INeuron {
    _name: string;
    _SWCount: number;
    _SHCount: number;
    _ACount: number;
    _SLinks: Array <ILink>;
    _learnCount: Array<number>;
    _A: Array<Array<number>>;
}

export class Neuron implements INeuron {
    _name: string = "";
    _SWCount: number;
    _SHCount: number;
    _ACount: number;
    _SLinks: Array <ILink> = new Array<ILink>();
    _learnCount: Array<number> = new Array<number>();
    _A: Array<Array<number>> = new Array<Array<number>>();;

    constructor(name: string, SWCount: number, SHCount: number, ACount: number){
        this._SWCount = SWCount;
        this._SHCount = SHCount;
        this._ACount = ACount;
        const SCount = SWCount * SHCount;
        this._name = name;
        for (let j = 0; j < SCount; j++) this._SLinks.push({});
        for (let i = 0; i < ACount; i++) {
            const w = new Array<number>(SCount + 1);
            for (let j = 0; j <= SCount; j++) w[j] = 0;
            this._A.push(w);
        }
    }
    createLinkImage(imd: HTMLCanvasElement, tileX: number, tileY: number): void {
        /*const startX = this._SLinks.length * tileX;
        const startY = 
        imd.width
*/
    }
    createLinkNeuron(n: INeuron, Aindex: number ): void {

    }

    learn(Aindex: number, rightValue: number) {

    }
    get name(): string {return this._name}

    getLearnCount(k: number): number {return this._learnCount[k]}
}