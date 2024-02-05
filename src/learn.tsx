import React from 'react';
import Sprite from './sprite';
import './learn.css';

interface ILearnState {
}
interface ILearnProps {

}
class Neuron {
    private sCount: number;
//    private S: number[];
    private A: number[][];
    private rCount: number;
//    private R: number[];
    private learnCount: number;
    constructor (sCount: number, rCount: number){
        this.sCount = sCount;
        this.rCount = rCount;
//        this.S = new Array<number>(this.sCount+1);
        this.A = new Array<number[]>(this.rCount);
        for (let i = 0; i < rCount; i++) this.A[i] = new Array(sCount+1).fill(0);
//        this.R = new Array<number>(this.rCount);
        this.learnCount = 0;
    }
    doLearn(sValues: number[], rNumber: number, rightValue: number) {
        this.learnCount++;
        // curRes - current result of A-function
        const v = [1, ...sValues];
        let curRes: number = this.R(sValues, rNumber);
        for (let i = 0; i < this.sCount+1; i++) curRes += v[i] * this.A[rNumber][i];
        const diff = rightValue - curRes;
        for (let i = 0; i < this.sCount+1; i++) this.A[rNumber][i] = (this.A[rNumber][i]*this.learnCount + v[i]*diff/(this.sCount+1))/this.learnCount;
    }
    R(sValues: number[], rNumber: number): number {
        const v = [1, ...sValues];
        let curRes: number = 0;
        for (let i = 0; i < this.sCount+1; i++) curRes += v[i] * this.A[rNumber][i];
        return curRes;
    }

    get _A() {
        return this.A;
    }
    get _learnCount() {
        return this.learnCount;
    }
}

export default class Learn extends React.Component<ILearnProps, ILearnState> {
    n: Neuron = new Neuron(9, 1);
    doLearn() {
        for (let j = 0; j < 512; j++) {
            const djstr = localStorage.getItem(j.toString());
            const dj = (djstr === null) || djstr === '0'?0:parseInt(djstr);
            const x: number[] = [];
            for (let l = 0; l < 9; l++) x.push((j >> l) & 1);
            if (dj!== 0) this.n.doLearn(x, 0, dj)
        }
        this.setState({});
    }

    doCalc(x: number[]): number {
        return this.n.R(x, 0);
    }

    render(): React.ReactNode {
        const onCh = (event: React.ChangeEvent<HTMLInputElement>)=> {
            const i: string = event.currentTarget.getAttribute('v') as string;
            const v: string = event.currentTarget.value;
            if (v !== '0') localStorage.setItem(i, v);
            else localStorage.removeItem(i);
        }
        const temp = new Array<number>();
        for (let i = 0; i < 512; i++) temp.push(i);
        return <div className='learn-container'>
            <div className='learn-w-values'>
                <span>iteration count={this.n._learnCount}</span>
                <span>{this.n._A[0].map((v, i)=><span key={i}>w({i}) = {v.toPrecision(2)}; </span>)}</span>
            </div>
            {temp.map((v, i)=>{
                const ls = localStorage.getItem(i.toString());
                let l: number = 0;
                if (ls!==null) l = parseInt(ls);
                return <span className='learn-cell' key={i}>
                <Sprite v={v}></Sprite>
                <span>
                <input type='radio' name={`dj${i}`} value="1" {...{v:i}} defaultChecked={l===1?true:undefined} onChange={(ev)=>onCh(ev)}/>
                <input type='radio' name={`dj${i}`} value="-1" {...{v:i}} defaultChecked={l===-1?true:undefined} onChange={(ev)=>onCh(ev)}/>
                <input type='radio' name={`dj${i}`} value="0" {...{v:i}} defaultChecked={l===0?true:undefined} onChange={(ev)=>onCh(ev)}/>
                </span>
            </span>})}
        </div>;
    }
}
