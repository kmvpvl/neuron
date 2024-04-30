import {IBrain } from '../../model/brain';
import Neuron from '../neuron/neuron';
import './brain.css';
import React from 'react';
export interface IBrainState {

}

export default class BrainComponent extends React.Component <IBrain, IBrainState> {
    brain: IBrain = this.props;
    render(): React.ReactNode {
         return <div className='brain-container'>
            <span>Neurons count: {this.brain._neurons.length}</span>
            <span className='brain-neurons'>
                {this.brain._neurons.map((v, i)=><Neuron {...v} key={i}></Neuron>)}
            </span>
        </div>
    }
}