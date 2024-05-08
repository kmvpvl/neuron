import React from "react"
import "./statusline.css";

interface ErrorStatus {
    errorCode: number;
    errorText?: string;
}
export interface IStatuslineProps {
}

export interface IStatuslineState {
    allSaved: boolean;
    connected: boolean;
    errors: Array<ErrorStatus>;
}

export default class Statusline extends React.Component<IStatuslineProps, IStatuslineState> {
    state: IStatuslineState = {
        allSaved: false,
        connected: false,
        errors: []
    }
    render(): React.ReactNode {
        const lastError = this.state.errors.length > 0?this.state.errors[this.state.errors.length]:null
        return <span className="statusline-container">
            <span className="status-element">{this.state.connected?'Connected': 'Disconnected'}</span>
            <span className="status-element">{this.state.allSaved?'All saved': 'Not saved'}</span>
            <span className={`status-element${lastError?" error-text":""}`}>{lastError?`${lastError.errorCode} - ${lastError.errorText}`:""}</span>
        </span>
    }
}