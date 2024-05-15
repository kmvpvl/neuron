import './neuron.css';
import {Neuron} from './../../model/brain'
import React from 'react';

export interface INeuronElementProps {
    value: number;
    name: string;
}
export interface INeuronElementState {
    showValue: boolean;
    showName: boolean;
}
export class INeuronElement extends React.Component<INeuronElementProps, INeuronElementState> {
    state: INeuronElementState = {
        showValue: false,
        showName: true
    }
    render(): React.ReactNode {
        return <span className='neuron-element-container'>
            <span className='neuron-element-icon'>
                <span className="neuron-element-icon-value" style={{width:`${this.props.value * 100}%`, height:`${this.props.value * 100}%`}}></span>
            </span>
            <span className='neuron-element-value'>{this.state.showValue?this.props.value.toFixed(2):''}</span>
            <span className='neuron-element-name'>{this.state.showName?this.props.name:''}</span>
        </span>
    }
}
export interface INeuronProps {
    neuron: Neuron
}

export interface INeuronState {
    selected: boolean;
    aSelected?: number;
    sSelected?: number;
    showAValue: boolean
    showSValue: boolean;
}

export default class NeuronComponent extends React.Component<INeuronProps, INeuronState> {
    neuron: Neuron = this.props.neuron;
    state: INeuronState = {
        selected: false,
        showAValue: true,
        showSValue: true
    };
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

    return <span className={`neuron-container ${this.state.selected?"neuron-selected":""}`}>
            <span className='neuron-title' key={`neuron_title_${this.props.neuron._name}`} onClick={this.ToggleSelected.bind(this)}>{this.neuron._name}</span>
            <span className='neuron-s-elements-container' style={{gridTemplateColumns: `repeat(${this.neuron._SWCount}, auto)`}}>
                {this.neuron._SValuesCache.map((v, i)=><INeuronElement value={v} name='' key={i}></INeuronElement>)}
            </span>
            <span className='neuron-a-elements-container'>
                {this.neuron._AValuesCache.map((v, i)=><INeuronElement value={v} name={this.neuron._ANames[i]} key={i}></INeuronElement>)}
            </span>
        </span>
    }
}