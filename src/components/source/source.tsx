import React from "react";
import "./source.css"
export interface ISourceProps {
    width: number;
    height: number;
    onImageChanged: ()=>void;
}

export interface ISourceState {

}

export default class Source extends React.Component <ISourceProps, ISourceState> {
    canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef();
    imgRef: React.RefObject<HTMLImageElement> = React.createRef();
    private drawbackslash() {
        if (!this.canvasRef.current) return;
        const ctx = this.canvasRef.current.getContext("2d");
        ctx?.beginPath();
        ctx?.moveTo(0, 0);
        ctx?.lineTo(this.props.width, this.props.height);
        ctx?.stroke();
        this.props.onImageChanged();
    }
    private drawslash() {
        if (!this.canvasRef.current) return;
        const ctx = this.canvasRef.current.getContext("2d");
        ctx?.beginPath();
        ctx?.moveTo(this.props.width, 0);
        ctx?.lineTo(0, this.props.height);
        ctx?.stroke();
        this.props.onImageChanged();
    }
    private drawhor() {
        if (!this.canvasRef.current) return;
        const ctx = this.canvasRef.current.getContext("2d");
        ctx?.beginPath();
        ctx?.moveTo(0, this.props.height/2);
        ctx?.lineTo(this.props.width, this.props.height/2);
        ctx?.stroke();
        this.props.onImageChanged();
    }
    private drawver() {
        if (!this.canvasRef.current) return;
        const ctx = this.canvasRef.current.getContext("2d");
        ctx?.beginPath();
        ctx?.moveTo(this.props.width/2, 0);
        ctx?.lineTo(this.props.width/2, this.props.height);
        ctx?.stroke();
        this.props.onImageChanged();
    }
    private clear() {
        if (!this.canvasRef.current) return;
        const ctx = this.canvasRef.current.getContext("2d");
        ctx?.clearRect(0, 0, this.props.width, this.props.height);
        this.props.onImageChanged();
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
            <button onClick={this.drawbackslash.bind(this)}>Draw \</button>
            <button onClick={this.drawslash.bind(this)}>Draw /</button>
            <button onClick={this.drawhor.bind(this)}>Draw -</button>
            <button onClick={this.drawver.bind(this)}>Draw |</button>
            <button onClick={this.clear.bind(this)}>Clear</button>
        </span>
    }
}