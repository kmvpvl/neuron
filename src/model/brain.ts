import { NeuronError } from "../common/fetches";

const msEnqueueProcessingTimer:number = 10;
const msQueueProcessingTimer:number = 10;

//
type onBrainUpdateCallbackFunction = ()=>void;
type onNeuronUpdateCallbackFunction = ()=>void;
type NeuronsArray = Array<Neuron>;

type MessageID = string;
type MessageType = "learn" | "s-value" | "info" | "a-value";
type MessageAddress = {
    neuron?: {
        name_template: RegExp | string;
    };
    canvas?: {
        name_template: RegExp | string;
        ctx: CanvasRenderingContext2D;
    }
}

type MessageBody = any;
export interface IMessage {
    _id: MessageID;
    _type: MessageType;
    _from: MessageAddress;
    _to: Array<MessageAddress>;
    _body: MessageBody;
    _answerRequired?: boolean;
    _created: Date;
    _processed?: Date;
}

export class Message implements IMessage {
    _id: MessageID = crypto.randomUUID();
    _type: MessageType;
    _from: MessageAddress;
    _to: Array<MessageAddress>;
    _body: MessageBody;
    _answerRequired?: boolean;
    _created: Date = new Date();
    _processed?: Date;
    constructor(type: MessageType, from: MessageAddress, to: Array<MessageAddress>, body: MessageBody, answerRequired?: boolean) {
        this._type = type;
        this._from = from;
        this._to = to;
        this._body = body;
        this._answerRequired = answerRequired;
    }
    clone(): Message {
        const res:any = {};
        Object.assign(res, this);
        res._id = crypto.randomUUID();
        res._created = new Date();
        res._processed = undefined;
        return res;
    }
}

export interface IBrain {
    _name: string;
    _neurons: NeuronsArray;
    _enqueue: Array<Message>;
    _processingQueue: Array<Message>;
    _dequeue: Array<Message>;
}

export class Brain implements IBrain {
    _name: string = "";
    _neurons: Neuron[] = new Array(0);
    _enqueue: Array<Message> = new Array(0);
    _processingQueue: Array<Message> = new Array(0);
    _dequeue: Array<Message> = new Array(0);
    _onUpdate: onBrainUpdateCallbackFunction = ()=>{throw new NeuronError("abstract", `Brain onUpdate function has no implementation`)};
    _onUpdateQueue: onBrainUpdateCallbackFunction = ()=>{throw new NeuronError("abstract", `Brain onUpdateQueue function has no implementation`)};
    _processEnQueueIntervalHandler: NodeJS.Timer;
    _processQueueIntervalHandler: NodeJS.Timer;
    constructor(name: string){
        this._name = name;
        this._processQueueIntervalHandler = setInterval(this.processQueue.bind(this), msQueueProcessingTimer);
        this._processEnQueueIntervalHandler = setInterval(this.processEnQueue.bind(this), msEnqueueProcessingTimer);
    }
    addNeuron(name: string, SWCount: number, SHCount: number, ACount: number, layer?: number, ANames?: Array<string>, learnCount?:Array<number>, W?: Array<Array<number>>, SLinks?: Array<ILink>, ALinks?: Array<Array<ILink>>): Neuron {
        const n = new Neuron(this, name, SWCount, SHCount, ACount, layer, ANames, learnCount, W, SLinks, ALinks);
        this._neurons.push(n);
        this._onUpdate();
        return n;
    }
    doLearn(neuronName: string | undefined, rightValue: number, Aindex: number) {
        this.enqueue(new Message("learn", {}, [{neuron: {name_template: neuronName as string}}], {Aindex: Aindex, rightValue: rightValue}));
        this._onUpdate();
    }

    clear(){
        this._neurons.splice(0, this._neurons.length);
        this._enqueue.splice(0, this._enqueue.length);
        this._processingQueue.splice(0, this._processingQueue.length);
        this._dequeue.splice(0, this._dequeue.length);
        this._onUpdate();
    }
    get json() {
        return {
            name: this._name,
            neurons: this._neurons.map(v=>v.json)
        }
    }
    enqueue(msg: Message) {
        this._enqueue.push(msg);
        this._onUpdateQueue();
    }
    private processEnQueue() {
        while (this._enqueue.length > 0) {
            const msg = this._enqueue.shift();
            if (msg !== undefined) this._processingQueue.push(msg);
            this._onUpdateQueue();
        }
    }
    private processQueue() {
        while (this._processingQueue.length > 0) {
            const msg = this._processingQueue.shift() as Message;
            if (msg._to.length === 0) {
                this._neurons.forEach((v, i)=>v.processMessage(msg))
            } else {
                this._neurons.filter(v=>v._name===msg._to[0].neuron?.name_template).forEach((v, i)=>v.processMessage(msg));
            }
            if (msg !== undefined) {
                msg._processed = new Date();
                this._dequeue.push(msg);
            }
            this._onUpdateQueue();
        }
    }
}

interface ILink {
    image?: {
        x: number;
        y: number;
    };
    neuron?: {
        neuronName: string;
        Aindex?: number;
        Sindex?: number;
    }
}

/**
 * INeuron - neuron data
 */
export interface INeuron {
    _name: string;
    _SWCount: number;
    _SHCount: number;
    _ACount: number;
    _SLinks: Array <ILink>;
    _ALinks: Array<Array <ILink>>;
    _learnCount: Array<number>;
    _W: Array<Array<number>>;
    _SValuesCache: Array<number>;
    _AValuesCache: Array<number>;
    _ANames: Array<string>;
    _layer?: number;
}

/**
 * 
 */
export class Neuron implements INeuron {
    _name: string = ""; 
    _SWCount: number;
    _SHCount: number;
    _ACount: number;
    _SLinks: Array <ILink> = new Array<ILink>();
    _ALinks: Array<Array <ILink>> = new Array<Array<ILink>>();
    _SValuesCache: number[] = new Array<number>();
    _AValuesCache: number[] = new Array<number>();
    _learnCount: Array<number> = new Array<number>();
    _ANames: Array<string> = new Array<string>();
    _W: Array<Array<number>> = new Array<Array<number>>();
    _layer?: number = 0;
    _brain: Brain;
    _onUpdate: onNeuronUpdateCallbackFunction = ()=> {throw new NeuronError("abstract", `Neuron has no onUpdate implementation`)};

    constructor(brain: Brain, name: string, SWCount: number, SHCount: number, ACount: number, layer?: number, ANames?: Array<string>, learnCount?:Array<number>, W?: Array<Array<number>>, SLinks?: Array<ILink>, ALinks?: Array<Array<ILink>>){
        this._brain = brain;
        this._SWCount = SWCount;
        this._SHCount = SHCount;
        this._ACount = ACount;
        const SCount = SWCount * SHCount;
        this._name = name;
        this._layer = layer;
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
            this._ALinks.push(ALinks?ALinks[i]:[]);
            this._learnCount.push(learnCount?learnCount[i]:0);
            this._ANames.push(ANames?ANames[i]:`A${i}`);
        }
    }
    createLinkImageTile(tileX: number, tileY: number): void {
        const startX = this._SWCount * tileX;
        const startY = this._SHCount * tileY;
        this.createLinkImageDelta(startX, startY);
    }
    createLinkImageDelta(deltaX?: number, deltaY?: number): void {
        const startX = deltaX !== undefined?deltaX:0;
        const startY = deltaY !== undefined?deltaY:0;
        this._SLinks.forEach((v, i)=>{
            v.image = {x: startX + i % this._SWCount, y: startY + Math.floor(i / this._SWCount)}; 
        });
    }

    createSLinkNeuron(neuronSrc: Neuron, AindexSrc: number,  SindexDts: number): void {
        const il: ILink = {
            neuron: {
                neuronName: neuronSrc._name,
                Aindex: AindexSrc
            }
        }
        this._SLinks[SindexDts] = il;
    }

    createALinkNeuron(neuronSrc: Neuron, SindexSrc: number,  AindexDts: number): void {
        const il: ILink = {
            neuron: {
                neuronName: neuronSrc._name,
                Sindex: SindexSrc
            }
        }
        this._ALinks[AindexDts].push(il);
    }

    _learnAtom(Aindex: number, rightValue: number): number { // return percent of goal achive
        this._learnCount[Aindex]++;
        const curRes = this.calcA(Aindex);
        const v = [1, ...this._SValuesCache];
        const diff = rightValue - curRes;
        for (let i = 0; i < this._SHCount*this._SWCount + 1; i++){
            this._W[Aindex][i] = (this._W[Aindex][i] * this._learnCount[Aindex] + v[i] * diff/(this._SHCount*this._SWCount + 1))/this._learnCount[Aindex];
        }
        return diff;
    }
    
    learnSingle(Aindex: number, rightValue: number, uptoPercent: number = 0.1, learnCount?: number): number {
        // doing until percent goal achieved
        const maxM = learnCount === undefined?10000:learnCount;
        let m = 0; // counter is a fuse to infinite cycle
        while (m++ < maxM) {
            if (Math.abs(this._learnAtom(Aindex, rightValue)) < uptoPercent) break;
        } 
        return this._learnCount[Aindex];
    }

    learnNetAtom(Aindex: number, rightValue: number): number {
        const backupSvalues = this._SValuesCache;
        const SCount = this._SWCount*this._SHCount;
        this._SValuesCache = new Array<number>(SCount);
        for (let i = 0; i < SCount; i++){
            if (this._SLinks[i].image !== undefined) {
                // if link is with image then save value from image
                this._SValuesCache[i] = backupSvalues[i];
            } else if (this._SLinks[i].neuron !== undefined) {
                // if link is with another neuron send to him right value as apart of 1 and get this value to learn myself
                this._SValuesCache[i] = (rightValue - backupSvalues[i]);//(SCount + 1);
                this._brain.enqueue(new Message("learn", {neuron:{name_template: this._name}}, [{neuron:{name_template: this._SLinks[i].neuron?.neuronName as string}}], {rightValue: this._SValuesCache[i], Aindex:this._SLinks[i].neuron?.Aindex}));
            }
        }
        const ret = this._learnAtom(Aindex, rightValue);
        this._SValuesCache = backupSvalues;
        return ret;
    }

    calcA(x: number): number {
        const v = [1, ...this._SValuesCache];
        const w = this._W[x];
        const ret = v.reduce((part, v, i)=> part + v * w[i], 0.0);
        this._AValuesCache[x] = ret;
        if (this._ALinks[x].length > 0) {
            this._ALinks[x].forEach(v=> this._brain.enqueue(new Message("a-value", {neuron:{name_template: this._name}}, [{neuron: {name_template: v.neuron?.neuronName as string}}], {Sindex: v.neuron?.Sindex, value: ret})));
        }
        return ret;
    }

    processMessage(msg: Message) {
        switch (msg._type) {
            case "s-value":
                const ctx = msg._from.canvas?.ctx;
                const ret = this._SLinks.map((v)=> {
                    if (v.image !== undefined) {
                      const data = ctx?.getImageData(v.image.x, v.image.y, 1, 1);
                        return (data?data.data[3]:0) / 255;
                    } else return 0;
                })
                this._SValuesCache = ret;
            break;
            case "a-value":
                this._SValuesCache[msg._body.Sindex] = msg._body.value;
            break;
            case "learn":
                this.learnNetAtom(msg._body.Aindex, msg._body.rightValue);
            break;
        }
        this._AValuesCache.forEach((v, i)=>this.calcA(i));
        try {
            this._onUpdate();
        } catch(e: any) {
            console.log(e.message);
        }
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
            _SLinks: this._SLinks,
            _ALinks: this._ALinks,
            _layer: this._layer
        };
    }
}