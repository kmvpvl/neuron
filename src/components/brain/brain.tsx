import {Brain } from '../../model/brain';
import NeuronComponent from '../neuron/neuron';
import './brain.css';
import React from 'react';

export interface IBrainProps {
    brain: Brain;
}
export interface IBrainState {

}

export default class BrainComponent extends React.Component <IBrainProps, IBrainState> {
    _brain: Brain = this.props.brain;
    constructor(props: any) {
        super(props);
        this._brain._onUpdate = this.onUpdate.bind(this);
        this._brain._onUpdateQueue = this.onQueueUpdate.bind(this);
    }
    onQueueUpdate() {
        this.setState({});
    }
    onUpdate() {
        this.setState({});
    }
    render(): React.ReactNode {
         return <div className='brain-container'>
            <span>Neurons count: {this._brain._neurons.length}</span>
            <span className='brain-queues'>
                <span>Enqueue</span>
                <span className='brain-queue-container'>
                    {this._brain._enqueue.map((v, i)=><span className='brain-queue-message' key={i}>{v._type}</span>)}
                </span>
                <span>Processing</span>
                <span className='brain-queue-container'>
                    {this._brain._processingQueue.map((v, i)=><span className='brain-queue-message' key={i}>{v._type}</span>)}
                </span>
                <span>Dequeue</span>
                <span className='brain-queue-container'>
                    {this._brain._dequeue.map((v, i)=><span className='brain-queue-message' key={i}>{v._type}</span>)}
                </span>
            </span>
            <span className='brain-net'>
            <span className='brain-neurons s-layer'>
                {this._brain._neurons.filter(v=>/-S-/i.test(v._name)).map((v, i)=><NeuronComponent neuron={v} key={`neuroncomp_${i}`}></NeuronComponent>)}
            </span>
            <span className='brain-neurons h-layer'>
                {this._brain._neurons.filter(v=>/-H-/i.test(v._name)).map((v, i)=><NeuronComponent neuron={v} key={`neuroncomp_${i}`}></NeuronComponent>)}
            </span>
            <span className='brain-neurons r-layer'>
                {this._brain._neurons.filter(v=>/-R-/i.test(v._name)).map((v, i)=><NeuronComponent neuron={v} key={`neuroncomp_${i}`}></NeuronComponent>)}
            </span>
            </span>
        </div>
    }
}