import React from "react";
import "./source.css"
export interface ISourceProps {
    width: number;
    height: number;
}

export interface ISourceState {

}

export default class Source extends React.Component <ISourceProps, ISourceState> {
    canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef();
    imgRef: React.RefObject<HTMLImageElement> = React.createRef();
    private draw() {
        if (!this.canvasRef.current) return;
        const ctx = this.canvasRef.current.getContext("2d");
        ctx?.beginPath();
        ctx?.moveTo(0, 0);
        ctx?.lineTo(this.props.width, this.props.width);
        ctx?.stroke();
    }
    /*componentDidMount(): void {
        if (this.canvasRef.current) {
            this.draw();
            this.setState({});
        } else {
        }
    }*/
//
//<img src="./logo192.png" ref={this.imgRef} alt=""></img>
    public get imageData(): HTMLCanvasElement | undefined {
        if (!this.canvasRef.current) return undefined;
        return this.canvasRef.current;
    }

    render(): React.ReactNode {
        const h = this.props.height;
        const w = this.props.width;
        return <span className="source-container">
            <span>Source</span>
            <canvas ref={this.canvasRef} width={w} height={w}>
            </canvas>
            <span>{w}x{h} = {w*h}</span>
            <button onClick={this.draw.bind(this)}>Draw \</button>
        </span>
    }
}