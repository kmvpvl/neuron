import React from "react";
import "./source.css"
export interface ISourceProps {

}

export interface ISourceState {

}

export default class Source extends React.Component <ISourceProps, ISourceState> {
    render(): React.ReactNode {
        return <span className="source-container">Source</span>
    }
}