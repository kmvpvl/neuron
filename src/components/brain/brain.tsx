import { Brain, IBrain } from '../../model/brain';
import NeuronComponent from '../neuron/neuron';
import Neuron from '../neuron/neuron';
import './brain.css';
import React from 'react';

export default class BrainComponent extends React.Component <{}, IBrain> {
    brain: Brain = new Brain();
    state: Readonly<Brain> = this.brain;
    ncs: Array<React.RefObject<NeuronComponent>> = []; 
    onLoop(b: Brain, bc: BrainComponent): void {
        bc.setState(b);
        bc.ncs.forEach((v, i)=>v.current?.onLoop(v.current.neuron, v.current));
    }
    isStarted(): boolean {
        return this.brain.loopHandler !== undefined;
    }
    render(): React.ReactNode {
         return <div className='brain-container'>
            <span className='brain-toolbar'>
                <span>Exchange freq: <input type="number" onChange={()=>{
                    this.setState(this.brain);
                }} defaultValue={this.brain.exchFreq}></input></span>
                <span>
                    <span>{this.brain.cycle}</span>
                    <button onClick={(event)=>{
                        if (this.isStarted()) {
                            this.brain.pause();
                        } else {
                            this.brain.start(this.onLoop, this);
                        }
                        this.setState(this.brain);
                    }}>{this.isStarted()?'Pause':'Start'}</button>
                    <button onClick={(event)=>{
                        this.ncs.push(React.createRef());
                        this.brain.addNeuron();
                        this.setState(this.brain);
                    }}>Add neuron</button>
                </span>
            </span>
            <span className='brain-neurons'>
                {this.brain.neurons.map((v, i)=><Neuron key={i} ref={this.ncs[i]}></Neuron>)}
            </span>
        </div>
    }
}