import {IBrain } from '../../model/brain';
import NeuronComponent from '../neuron/neuron';
import './brain.css';
import React from 'react';

export interface IBrainProps extends IBrain {
}
export interface IBrainState {

}

export default class BrainComponent extends React.Component <IBrainProps, IBrainState> {
    brain: IBrain = this.props;
    render(): React.ReactNode {
         return <div className='brain-container'>
            <span>Neurons count: {this.brain._neurons.length}</span>
            <span className='brain-neurons'>
                {this.brain._neurons.map((v, i)=><NeuronComponent {...v} key={`neuroncomp_${i}`}></NeuronComponent>)}
            </span>
        </div>
    }
}