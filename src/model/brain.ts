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
    addNeuron(name: string, SWCount: number, SHCount: number, ACount: number, ANames?: Array<string>, learnCount?:Array<number>, W?: Array<Array<number>>, SLinks?: Array<ILink>, canvas?: HTMLCanvasElement | null): Neuron {
        const n = new Neuron(name, SWCount, SHCount, ACount, ANames, learnCount, W, SLinks, canvas);
        this._neurons.push(n);
        return n;
    }
    clear(){
        this._neurons.splice(0, this._neurons.length);
    }
    get neurons(): NeuronsArray {return this._neurons} 
    get json() {
        return {
            name: this._name,
            neurons: this.neurons.map(v=>v.json)
        }
    }
}

interface ILink {
    image?: {
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
    _ANames: Array<string>;
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
    _ANames: Array<string> = new Array<string>();
    _W: Array<Array<number>> = new Array<Array<number>>();
    _canvas?: HTMLCanvasElement | null;
    static NeuronFromInterface(n: INeuron): Neuron {
        const nn = new Neuron(n._name, n._SWCount, n._SHCount, n._ACount);
        Object.assign(nn, n);
        return nn;
    }
    constructor(name: string, SWCount: number, SHCount: number, ACount: number, ANames?: Array<string>, learnCount?:Array<number>, W?: Array<Array<number>>, SLinks?: Array<ILink>, canvas?: HTMLCanvasElement | null){
        this._SWCount = SWCount;
        this._SHCount = SHCount;
        this._ACount = ACount;
        const SCount = SWCount * SHCount;
        this._name = name;
        this._canvas = canvas;
        for (let j = 0; j < SCount; j++) {
            this._SLinks.push(SLinks?SLinks[j]:{});
            this._SValuesCache.push(0);
        }
        if (W !== undefined) {
            this._W = W
        }
        for (let i = 0; i < ACount; i++) {
            if (W === undefined) {
                const w = new Array<number>(SCount + 1);
                for (let j = 0; j <= SCount; j++) w[j] = 0.0;
                this._W.push(w);
            }
            this._AValuesCache.push(0);
            this._learnCount.push(learnCount?learnCount[i]:0);
            this._ANames.push(ANames?ANames[i]:`S${i}`);
        }
    }
    createLinkImage(imd: HTMLCanvasElement, tileX: number, tileY: number): void {
        this._canvas = imd;
        const startX = this._SWCount * tileX;
        const startY = this._SHCount * tileY;
        this._SLinks.forEach((v, i)=>{
            v.image = {x: startX + i % this._SWCount, y: startY + Math.floor(i / this._SWCount)}; 
        });
        this.getSValues();
    }
    getSValues():Array<number> {
        const ctx = this._canvas?.getContext("2d");
        const ret = this._SLinks.map((v)=> {
            if (v.image !== undefined) {
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

    _learnAtom(Aindex: number, rightValue: number): number { // return percent of goal achive
        this._learnCount[Aindex]++;
        this.getSValues();
        const curRes = this.calcA(Aindex);
        const v = [1, ...this._SValuesCache];
        const diff = rightValue - curRes;
        for (let i = 0; i < this._SHCount*this._SWCount + 1; i++){
            this._W[Aindex][i] = (this._W[Aindex][i] * this._learnCount[Aindex] + v[i] * diff/(this._SHCount*this._SWCount + 1))/this._learnCount[Aindex];
        }
        return diff/rightValue;
    }
    
    learn(Aindex: number, rightValue: number, uptoPercent: number = 0.1, learnCount?: number): number {
        if (learnCount === undefined) {
            // doing until percent goal achieved
            const maxM = 10000;
            let m = 0; // counter is a fuse to infinite cycle
            while (m++ < maxM) {
                if (Math.abs(this._learnAtom(Aindex, rightValue)) <uptoPercent) break;
            } 
        }
        return this._learnCount[Aindex];
    }
    get name(): string {return this._name}

    getLearnCount(k: number): number {return this._learnCount[k]}

    calcA(x: number): number {
        const v = [1, ...this._SValuesCache];
        const w = this._W[x];
        const ret = v.reduce((part, v, i)=> part + v * w[i], 0.0);
        this._AValuesCache[x] = ret;
        return ret;
    }
    
    get json(): object {
        return {
            _name: this._name,
            _ACount: this._ACount,
            _SWCount: this._SWCount,
            _SHCount: this._SHCount,
            _ANames: this._ANames,
            _learnCount: this._learnCount,
            _W: this._W,
            _SLinks: this._SLinks
        };
    }
}