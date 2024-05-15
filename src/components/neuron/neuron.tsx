import './neuron.css';
import {Neuron} from './../../model/brain'
import React from 'react';

export interface INeuronProps {
    neuron: Neuron
}

export interface INeuronState {
    selected: boolean;
    aSelected?: number;
    sSelected?: number;
}

export default class NeuronComponent extends React.Component<INeuronProps, INeuronState> {
    neuron: Neuron = this.props.neuron;
    state: INeuronState = {
        selected: false
    };
/*    constructor(props: any) {
        super(props);
        this.neuron._onUpdate = this.onUpdate.bind(this)
    }*/
    componentDidMount(): void {
        this.neuron._onUpdate = this.onUpdate.bind(this)
    }
    ToggleSelected(){
        this.setState({selected: !this.state.selected});
    }
    ToggleSSelected(Sindex: number) {
        const st: INeuronState = this.state;
        st.sSelected = Sindex;
        this.setState(st);
    }
    onUpdate() {
        this.setState(this.state);
    }
    render(): React.ReactNode {

        const ndata = this.neuron._SValuesCache;
        const width = 50;
        const circle_padding = 2;
        const circle_diameter = 10;
        const s_count = this.neuron._SWCount * this.neuron._SHCount;
        const a_count = this.neuron._W.length;
        const a_height = circle_diameter * a_count + circle_padding * (a_count - 1)+1;
        const s_height = circle_diameter * s_count + circle_padding * (s_count - 1)+1;
        const height = Math.max(a_height,s_height);
        const a = new Array<number>(a_count);
        const maxA = Math.max(...this.props.neuron._AValuesCache);
        for (let i = 0; i < a_count; i++) a[i] = i * (circle_diameter + circle_padding) + circle_diameter/2 + (height - a_height)/2;
        let a_l = a.map((v, i)=>
            <g key={`neuron_${this.neuron._name}_a_${i}`}>
            <circle className={i===this.state.sSelected?"a-s-element-selected":""} onClick={this.ToggleSSelected.bind(this, i)} cx={width - circle_diameter/2 - 1} cy={v} r={circle_diameter/2}  stroke={maxA <= this.neuron._AValuesCache[i]?"green":"silver"} fill='white'></circle>
            <circle cx={width - circle_diameter/2 - 1} cy={v} r={circle_diameter/2 * this.neuron._AValuesCache[i]} fill={maxA <= this.neuron._AValuesCache[i]?"green":"silver"}></circle>
            <text x={width + circle_padding} y={v+circle_diameter/2} fontSize={circle_diameter}>{Math.round(this.neuron._AValuesCache[i]*100)/100} '{this.neuron._ANames[i]}'</text>
            </g>
        )
        const s = new Array<number>(s_count);
        for (let i = 0; i < s_count; i++) s[i] = i * (circle_diameter + circle_padding) + circle_diameter/2  + (height - s_height)/2;
        let s_l = s.map((v, i)=>
            <g key={`neuron_${this.neuron._name}_s_${i}`}>
            <circle cx={circle_diameter/2} cy={v} r={circle_diameter/2} stroke='silver' fill='white'></circle>
            <circle cx={circle_diameter/2} cy={v} r={circle_diameter/2 * ndata[i]}></circle>
            <text x={circle_diameter+circle_padding} y={v+circle_diameter/2} fontSize={circle_diameter}>{Math.round(this.neuron._SValuesCache[i]* 100)/100}</text>
            </g>
        )
    return <span className={`neuron-container ${this.state.selected?"neuron-selected":""}`}>
            <span className='neuron-title' key={`neuron_title_${this.props.neuron._name}`} onClick={this.ToggleSelected.bind(this)}>{this.neuron._name}</span>
            <svg version="1.1" width={width * 2} height={height} xmlns="http://www.w3.org/2000/svg">
            {a_l}
            {s_l}
            </svg>
        </span>
    }
}