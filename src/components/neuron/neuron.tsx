import './neuron.css';
import {INeuron} from './../../model/brain'
import React from 'react';

export interface INeuronState {

}

export default class NeuronComponent extends React.Component<INeuron, INeuronState> {
    neuron: INeuron = this.props;

    render(): React.ReactNode {
        const width = 50;
        const circle_padding = 5;
        const circle_diameter = 10;
        const s_count = this.neuron._A[0].length - 1;
        const a_count = this.neuron._A.length;
        const a_height = circle_diameter * a_count + circle_padding * (a_count - 1)+1;
        const s_height = circle_diameter * s_count + circle_padding * (s_count - 1)+1;
        const height = Math.max(a_height,s_height);
        const a = new Array<number>(a_count);
        for (let i = 0; i < a_count; i++) a[i] = i * (circle_diameter + circle_padding) + circle_diameter/2 + (height - a_height)/2;
        let a_l = a.map((v, i)=><circle cx={width - circle_diameter/2 - 1} cy={v} r={circle_diameter/2} key={`neuron_${this.neuron._name}_a_${i}`}></circle>)
        const s = new Array<number>(s_count);
        for (let i = 0; i < s_count; i++) s[i] = i * (circle_diameter + circle_padding) + circle_diameter/2  + (height - s_height)/2;
        let s_l = s.map((v, i)=><circle cx={circle_diameter/2} cy={v} r={circle_diameter/2} key={`neuron_${this.neuron._name}_s_${i}`}></circle>)
        return <span className='neuron-container'>
            <span className='neuron-title'>{this.neuron._name}</span>
            <svg version="1.1" width={width} height={height} xmlns="http://www.w3.org/2000/svg">
            {a_l}
            {s_l}
            </svg>
        </span>
    }
}