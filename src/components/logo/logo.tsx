import React from "react";
import "./logo.css"
export interface ILogoProps {

}

export interface ILogoState {

}

export default class Logo extends React.Component<ILogoProps, ILogoState> {
    render(): React.ReactNode {
        return <span className="logo-container">Logo</span>
    }
}