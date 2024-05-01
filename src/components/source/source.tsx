import React from "react";
import "./source.css"
export interface ISourceProps {

}

export interface ISourceState {

}

export default class Source extends React.Component <ISourceProps, ISourceState> {
    canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef();
    imgRef: React.RefObject<HTMLImageElement> = React.createRef();
    draw() {
        const ctx = this.canvasRef.current?.getContext("2d");
        if (this.imgRef.current) ctx?.drawImage(this.imgRef.current, 100, 100, 92, 92, 0, 0, 92, 92);
    }
    render(): React.ReactNode {
        return <span className="source-container">
            <span>Source</span>
            <canvas ref={this.canvasRef} width={100} height={100} onClick={this.draw.bind(this)}></canvas>
            <img src="./logo192.png" ref={this.imgRef}></img>
        </span>
    }
}