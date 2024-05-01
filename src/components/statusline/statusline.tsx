import React from "react"
import "./statusline.css"
export interface IStatuslineProps {
    allSaved: boolean;
    connected: boolean;
    errorCode: number;
    errorText?: string;
}

export interface IStatuslineState {

}

export default class Statusline extends React.Component<IStatuslineProps, IStatuslineState> {
    render(): React.ReactNode {
        return <span className="statusline-container">
            <span className="status-element">{this.props.connected?'Connected': 'Disconnected'}</span>
            <span className="status-element">{this.props.allSaved?'All saved': 'Not saved'}</span>
            <span className={`status-element${this.props.errorCode !== 0?" error-text":""}`}>{this.props.errorCode === 0?"":`${this.props.errorCode} - ${this.props.errorText}`}</span>
        </span>
    }
}