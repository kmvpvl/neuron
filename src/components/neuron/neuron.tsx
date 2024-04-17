import './neuron.css';
import {Neuron, INeuron} from './../../model/brain'
import React from 'react';

export default class NeuronComponent extends React.Component<{}, INeuron> {
    neuron: Neuron = new Neuron();
    state: Readonly<INeuron> = this.neuron;
    onLoop(n: Neuron, nc: NeuronComponent) {
        debugger
        nc.setState(n);
    }
    render(): React.ReactNode {
        return <span className='neuron-container'>
            f:{this.neuron.fatLevel};
            lc: {this.neuron.lifeCycles};
        </span>
    }
}