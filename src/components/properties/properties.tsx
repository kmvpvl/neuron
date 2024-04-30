import React from "react";
import "./properties.css"

export type PropsTypes = "" | "neuron" | "brain"; 

export interface IPropertiesProps {
    type: PropsTypes;
    onNeuronUpdated: ()=>void;
}

export interface IPropertiesState {

}


export default class Properties extends React.Component <IPropertiesProps, IPropertiesState> {
    neuronnameRef: React.RefObject<HTMLInputElement> = React.createRef();
    acountRef: React.RefObject<HTMLInputElement> = React.createRef();
    scountRef: React.RefObject<HTMLInputElement> = React.createRef();
    renderType() : React.ReactNode {
        switch(this.props.type) {
            case "": return <span>No properties</span>;
            case "neuron": return <span>
                <span>Neuron properties</span><br/>
                Name<input type="text" ref={this.neuronnameRef}></input><br/>
                A-count<input type="number" ref={this.acountRef}></input><br/>
                S-count<input type="number" ref={this.scountRef}></input><br/>
                <button onClick={this.props.onNeuronUpdated}>Apply</button>
            </span>
        }
    }
    render(): React.ReactNode {
        return <span className="properties-container">
            <span>Properties</span>
            {this.renderType()}
        </span>
    }
}