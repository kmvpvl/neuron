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
    _W: Array<Array<number>>;
    _SValuesCache: Array<number>;
    _AValuesCache: Array<number>;
}

export class Neuron implements INeuron {
    _name: string = "";
    _SWCount: number;
    _SHCount: number;
    _ACount: number;
    _SLinks: Array <ILink> = new Array<ILink>();
    _SValuesCache: number[] = new Array<number>();
    _AValuesCache: number[] = new Array<number>();
    _learnCount: Array<number> = new Array<number>();
    _W: Array<Array<number>> = new Array<Array<number>>();;
    static NeuronFromInterface(n: INeuron): Neuron {
        const nn = new Neuron(n._name, n._SWCount, n._SHCount, n._ACount);
        Object.assign(nn, n);
        return nn;
    }
    constructor(name: string, SWCount: number, SHCount: number, ACount: number){
        this._SWCount = SWCount;
        this._SHCount = SHCount;
        this._ACount = ACount;
        const SCount = SWCount * SHCount;
        this._name = name;
        for (let j = 0; j < SCount; j++) {
            this._SLinks.push({});
            this._SValuesCache.push(0);
        }
        for (let i = 0; i < ACount; i++) {
            const w = new Array<number>(SCount + 1);
            for (let j = 0; j <= SCount; j++) w[j] = 0.0;
            this._W.push(w);
            this._AValuesCache.push(0);
        }
    }
    createLinkImage(imd: HTMLCanvasElement, tileX: number, tileY: number): void {
        const startX = this._SWCount * tileX;
        const startY = this._SHCount * tileY;
        this._SLinks.forEach((v, i)=>{
            v.image = {canvas: imd, x: startX + i % this._SWCount, y: startY + Math.floor(i / this._SWCount)}; 
        });
        this.getSValues();
    }
    getSValues():Array<number> {
        const ret = this._SLinks.map((v)=> {
            if (v.image !== undefined) {
                const ctx = v.image.canvas.getContext("2d");
                const data = ctx?.getImageData(v.image.x, v.image.y, 1, 1);
                return (data?data.data[3]:0) / 255;
            } else return 0;
        })
        this._SValuesCache = ret;
        this._AValuesCache.forEach((v, i)=>this.calcA(i));
        return ret;
    }
    createLinkNeuron(n: INeuron, Aindex: number ): void {

    }

    learn(Aindex: number, rightValue: number): number {
        return this._learnCount[Aindex];
    }
    get name(): string {return this._name}

    getLearnCount(k: number): number {return this._learnCount[k]}

    calcA(x: number): number {
        const v = [1, ...this._SValuesCache];
        const w = this._W[x];
        //debugger
        const ret = v.reduce((part, v, i)=> part + v * w[i], 0.0);
        this._AValuesCache[x] = ret;
        return ret;
    }
}