import React from 'react';
import Sprite from './sprite';
import './learn.css';

interface ILearnState {
}
interface ILearnProps {

}


export default class Learn extends React.Component<ILearnProps, ILearnState> {
    threshold: number = 0.01;
    learningRate: number = 0.5;
    weights: number[][] = [[0/* bias */, 
    0, 0, 0, 
    0, 0, 0, 
    0, 0, 0 
    ]];

    D: number[] = [];

    doLearn() {
        //step 1 init
        //step 2
        let t = this.weights.length - 1;
        do {
            const wt1: number[] = [];
            for (let l = 0; l < 10; l++) wt1[l] = this.weights[t][l];
            for (let j = 0; j < 512; j++) {
                const djstr = localStorage.getItem(j.toString());
                const dj = djstr === null?0:parseInt(djstr);
                const x = [1];
                for (let l = 0; l < 9; l++) x.push((j >> l) & 1);
                const yjt = this.weights[t].reduce((prev, w, i)=>prev+w*x[i]);
                for (let l = 0; l < 10; l++) wt1[l] += this.learningRate * (dj - yjt) * x[l] / 512;
            }
            //  
            this.weights.push(wt1);
            t++;
        } while(t < 40);
        this.setState({});
    }

    doCalc(x: number[]): number {
        let ret = 0;
        for (let i = 0; i < 10; i++) {
            ret += x[i]* this.weights[this.weights.length-1][i];
        }
        return ret;
    }

    render(): React.ReactNode {
        const temp = new Array<number>();
        for (let i = 0; i < 512; i++) temp.push(i);
        return <div className='learn-container'>
            <div className='learn-w-values'>
                <span>iteration count={this.weights.length}</span>
                <span>{this.weights[this.weights.length-1].map((v, i)=><span key={i}>w({i}) = {v.toPrecision(2)}; </span>)}</span>
            </div>
            {temp.map((v, i)=>{
                const ls = localStorage.getItem(i.toString());
                const l = ls === '1'?true:false;
                return <span className='learn-cell' key={i}>
                <Sprite v={v}></Sprite>
                <input type='checkbox' {...{v: i}} onChange={(event)=> {
                    localStorage.setItem(event.currentTarget.getAttribute('v') as string, event.currentTarget.checked?'1':'0');
                    this.setState({});
                }} checked={l}></input>
            </span>})}
        </div>;
    }
}
