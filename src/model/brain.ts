// Link costs
//
//
//
//


export interface IBrain {
    exchFreq: number;
    neurons: Array<Neuron>;
    linkCost: number;
}

export class Brain implements IBrain {
    exchFreq: number = 1;
    neurons: Neuron[] = new Array<Neuron>();
    linkCost: number = 0.1;
    cycle: number = 0;
    loopHandler?: NodeJS.Timer;
    start(cb: (b: Brain)=> void): void {
        this.loopHandler = setInterval(this.loop, this.exchFreq * 1000, cb, this);
    }
    pause(): void {
        clearInterval(this.loopHandler);
    }
    loop(cb: (b: Brain)=> void, b: Brain): void {
        b.cycle += 1;
        b.neurons.forEach((v)=>{
            v.loop(v)
        });
        cb(b);
    }
    addNeuron(): Neuron {
        const n = new Neuron();
        this.neurons.push(n);
        return n;
    }
}

interface ILink {
    fatDebt: number;
    weight: number;
    neuron: INeuron;
}
export interface INeuron {
    inNeurons: Array <ILink>;
    fatLevel: number;
    lifeCycles: number;
}

export class Neuron implements INeuron {
    inNeurons: Array <ILink> = new Array<ILink>();
    fatLevel: number = 1;
    lifeCycles: number = 0;
    loop(n: Neuron){
        n.lifeCycles += 1;
        //debugger
    }

}