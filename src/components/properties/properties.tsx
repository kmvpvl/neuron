import React from "react";
import "./properties.css"

export type PropsTypes = "" | "neuron" | "brain" | "cascade" | "A-element" | "S-element" | "source" | "learn"; 

export interface IPropertiesProps {
    onApplyNeuronUpdate: ()=>void;
    onApplyCascadeCreate: ()=>void;
    onLearn: ()=>void;
}

export interface IPropertiesState {
    type: PropsTypes;
}


export default class Properties extends React.Component <IPropertiesProps, IPropertiesState> {
    state: IPropertiesState = {
        type: ""
    };
    neuronnameRef: React.RefObject<HTMLInputElement> = React.createRef();
    acountRef: React.RefObject<HTMLInputElement> = React.createRef();
    swcountRef: React.RefObject<HTMLInputElement> = React.createRef();
    shcountRef: React.RefObject<HTMLInputElement> = React.createRef();
    AindexRef: React.RefObject<HTMLInputElement> = React.createRef();
    rightValueRef: React.RefObject<HTMLInputElement> = React.createRef();

    cascadeNameRef: React.RefObject<HTMLInputElement> = React.createRef();
    hiddenLayersCountRef: React.RefObject<HTMLInputElement> = React.createRef();
    
    renderType() : React.ReactNode {
        switch(this.state.type) {
            case "": return <span>No properties</span>;
            case "neuron": return <span>
                <span>Neuron properties</span><br/>
                Name<input type="text" ref={this.neuronnameRef}></input><br/>
                A-count<input type="number" ref={this.acountRef}></input><br/>
                SW-count<input type="number" ref={this.swcountRef}></input><br/>
                SH-count<input type="number" ref={this.shcountRef}></input><br/>
                <button onClick={this.props.onApplyNeuronUpdate}>Apply</button>
            </span>
            case "cascade": return <span>
                <span>Cascade properties</span><br/>
                Name<input type="text" ref={this.cascadeNameRef}></input><br/>
                Hidden layers count<input type="number" ref={this.hiddenLayersCountRef}></input><br/>
                SW-count<input type="number" ref={this.swcountRef}></input><br/>
                SH-count<input type="number" ref={this.shcountRef}></input><br/>
                <button onClick={this.props.onApplyCascadeCreate}>Apply</button>
            </span>
            case "source": return <span>
                <span>Neuron properties</span><br/>
                Name<input type="text" ref={this.neuronnameRef}></input><br/>
                A-count<input type="number" ref={this.acountRef}></input><br/>
                <button onClick={this.props.onApplyNeuronUpdate}>Apply</button>
            </span>
            case "learn": return <span>
                <span>Learn properties</span><br/>
                Name<input type="text" ref={this.neuronnameRef}></input><br/>
                A-Index<input type="number" ref={this.AindexRef}></input><br/>
                Righ value<input type="number" ref={this.rightValueRef}></input><br/>
                <button onClick={this.props.onLearn}>Apply</button>
            </span>
            case "S-element": return <span>
                <span>S-element</span><br/>
                Name<input type="number" ref={this.AindexRef}></input><br/>
                <input type="radio" name="imageOrNeuron">image</input>
                <input type="radio" name="imageOrNeuron">neuron</input>
                <button onClick={this.props.onLearn}>Apply</button>
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