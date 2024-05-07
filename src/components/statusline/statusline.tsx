import React from "react"
import "./statusline.css"
export interface IStatuslineProps {
}

export interface IStatuslineState {
    allSaved: boolean;
    connected: boolean;
    errorCode: number;
    errorText?: string;
}

export default class Statusline extends React.Component<IStatuslineProps, IStatuslineState> {
    state: IStatuslineState = {
        allSaved: false,
        connected: false,
        errorCode: 0
    }
    render(): React.ReactNode {
        return <span className="statusline-container">
            <span className="status-element">{this.state.connected?'Connected': 'Disconnected'}</span>
            <span className="status-element">{this.state.allSaved?'All saved': 'Not saved'}</span>
            <span className={`status-element${this.state.errorCode !== 0?" error-text":""}`}>{this.state.errorCode === 0?"":`${this.state.errorCode} - ${this.state.errorText}`}</span>
        </span>
    }
}