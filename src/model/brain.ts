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
    addNeuron(name: string, SCount: number, ACount: number): Neuron {
        const n = new Neuron(name, SCount, ACount);
        this._neurons.push(n);
        return n;
    }

    get neurons(): NeuronsArray {return this._neurons} 
}

interface ILink {
    fatDebt: number;
    weight: number;
    neuron: INeuron;
}
export interface INeuron {
    _name: string;
    _inNeurons: Array <ILink>;
    _learnCount: Array<number>;
    _A: Array<Array<number>>;
}

export class Neuron implements INeuron {
    _name: string = "";
    _inNeurons: Array <ILink> = new Array<ILink>();
    _learnCount: Array<number> = new Array<number>();
    _A: Array<Array<number>> = new Array<Array<number>>();;

    constructor(name: string, SCount: number, ACount: number){
        this._name = name;
        for (let i = 0; i < ACount; i++) {
            const w = new Array<number>(SCount + 1);
            for (let j = 0; j <= SCount; j++) w[j] = 0;
            this._A.push(w);
        }
    }

    learn(aIndex: number, rightValue: number) {

    }
    get name(): string {return this._name}

    getLearnCount(k: number): number {return this._learnCount[k]}
}