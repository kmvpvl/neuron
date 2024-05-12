import React from "react";
import "./source.css"
export interface ISourceProps {
    onImageChanged: ()=>void;
    onImageResized: (w: number, h: number)=>void;
}

export interface ISourceState {
    width: number;
    height: number;
}

export default class Source extends React.Component <ISourceProps, ISourceState> {
    state: ISourceState = {
        width: localStorage.getItem("source_width_default")?parseInt(localStorage.getItem("source_width_default")as string):5,
        height: localStorage.getItem("source_height_default")?parseInt(localStorage.getItem("source_height_default")as string):5,
    }
    canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef();
    imgRef: React.RefObject<HTMLImageElement> = React.createRef();
    widthRef: React.RefObject<HTMLInputElement> = React.createRef();
    heightRef: React.RefObject<HTMLInputElement> = React.createRef();
    private drawbackslash() {
        if (!this.canvasRef.current) return;
        const ctx = this.canvasRef.current.getContext("2d");
        ctx?.beginPath();
        ctx?.moveTo(0, 0);
        ctx?.lineTo(this.state.width, this.state.height);
        ctx?.stroke();
        this.props.onImageChanged();
    }
    private drawslash() {
        if (!this.canvasRef.current) return;
        const ctx = this.canvasRef.current.getContext("2d");
        ctx?.beginPath();
        ctx?.moveTo(this.state.width, 0);
        ctx?.lineTo(0, this.state.height);
        ctx?.stroke();
        this.props.onImageChanged();
    }
    private drawhor() {
        if (!this.canvasRef.current) return;
        const ctx = this.canvasRef.current.getContext("2d");
        ctx?.beginPath();
        ctx?.moveTo(0, this.state.height/2);
        ctx?.lineTo(this.state.width, this.state.height/2);
        ctx?.stroke();
        this.props.onImageChanged();
    }
    private drawver() {
        if (!this.canvasRef.current) return;
        const ctx = this.canvasRef.current.getContext("2d");
        ctx?.beginPath();
        ctx?.moveTo(this.state.width/2, 0);
        ctx?.lineTo(this.state.width/2, this.state.height);
        ctx?.stroke();
        this.props.onImageChanged();
    }
    private clear() {
        if (!this.canvasRef.current) return;
        const ctx = this.canvasRef.current.getContext("2d");
        ctx?.clearRect(0, 0, this.state.width, this.state.height);
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

    onImageResized () {
        const w = this.widthRef.current?.value;
        if (w === undefined) return;
        const wNum = parseInt(w);
        const h = this.heightRef.current?.value;
        if (h === undefined) return;
        const hNum = parseInt(h);
        localStorage.setItem("source_width_default", w);
        localStorage.setItem("source_height_default", h);
        this.setState({width: wNum, height:hNum});
        this.props.onImageResized(wNum, hNum);

    }

    render(): React.ReactNode {
        const h = this.state.height;
        const w = this.state.width;
        return <span className="source-container">
            <span>Source</span>
            <canvas ref={this.canvasRef} width={w} height={h}>
            </canvas>
            <span>
                <input ref={this.widthRef} type="number" defaultValue={w} onChange={this.onImageResized.bind(this)}></input>x
                <input ref={this.heightRef} type="number" defaultValue={h} onChange={this.onImageResized.bind(this)}></input>
            = {w*h}</span>
            <button onClick={this.drawbackslash.bind(this)}>Draw \</button>
            <button onClick={this.drawslash.bind(this)}>Draw /</button>
            <button onClick={this.drawhor.bind(this)}>Draw -</button>
            <button onClick={this.drawver.bind(this)}>Draw |</button>
            <button onClick={this.clear.bind(this)}>Clear</button>
        </span>
    }
}