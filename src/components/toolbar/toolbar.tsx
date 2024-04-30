import React from "react";
import "./toolbar.css"
export interface IToolbarProps {
    brainName: string;
    onAddNeuron: ()=>void
}

export interface IToolbarState {

}

export default class Toolbar extends React.Component<IToolbarProps, IToolbarState> {
    render(): React.ReactNode {
        return <span className="toolbar-container">
            <div>{this.props.brainName}</div>
            <button onClick={this.props.onAddNeuron}>Add neuron</button>
            <button>Block neuron</button>
            <button>Remove neuron</button>
            <button>Add link</button>
            <button>Remove link</button>
            <button>Add source</button>
            <button>Learn</button>
            <button>Recalc</button>
        </span>
    }
}