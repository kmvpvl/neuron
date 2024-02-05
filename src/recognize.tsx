import './recognize.css';
import React from 'react';
interface IPaintState {
    pixels: boolean [];
}

export default class Paint extends React.Component<{}, IPaintState> {
    state:IPaintState = {
        pixels: [],

    }
    public draw: boolean = false;
    minx?: number = undefined;
    maxx?: number;
    miny?: number;
    maxy?: number;
    realwidth?: number;
    realheight?: number;
    xrat?: number;
    yrat?: number;
    render(): React.ReactNode {
        let pixels = this.state.pixels;
        if (pixels.length === 0) {
            for (let l = 0; l < 400; l++) pixels.push(false);
        }
        let paintComp = this;
        return <>
            <div className='paint-container'>
            {pixels.map((v, i)=><span key={i} className={`paint-cell-${v?'black':''}`} onMouseDown={(ev=>{paintComp.draw = true})} onMouseUp={(ev=>{paintComp.draw = false})} onMouseMove={(ev=>{
                if(paintComp.draw) {
                    const arr = paintComp.state.pixels;
                    arr[parseInt(ev.currentTarget.getAttribute('pixel')as string)] = true;
                    paintComp.setState(
                        {pixels: arr}
                    );
            }})} {...{pixel:i}}></span>)}
        </div>
        <button onClick={()=>this.setState({pixels:[]})}>Clear</button>
        <div>width = {this.realwidth}; height = {this.realheight}; xrat = {this.xrat}; yrat = {this.yrat};</div>
        </>
    }
    checkRow(y: number):boolean{
        let res: boolean = false;
        for (let l = y*20; l < (y+1)*20;l++) res ||= this.state.pixels[l];
        return res;
    }
    checkColumn(x: number): boolean{
        let res: boolean = false;
        for (let l = x; l < 400;l+=20) res ||= this.state.pixels[l];
        return res;
    }
    getFirstCol(): number {
        let i = 0;
        while (!this.checkColumn(i) ) i++;
        return i;
    }
    getLastCol(): number {
        let i = 19;
        while (!this.checkColumn(i) && i >= 0) i--;
        return i;
    }
    getFirstRow(): number {
        let i = 0;
        while (!this.checkRow(i)) i++;
        return i;
    }
    getLastRow(): number {
        let i = 19;
        while (!this.checkRow(i) && i >= 0) i--;
        return i;
    }

    getCountInRect(x:number, y:number, w:number, h: number):number {
        let counter: number = 0;
        for (let i = 0; i < w; i++) {
            for (let j = 0; j < h; j++) {
                if (this.state.pixels[(j+y)*20+i+x]) counter++;
            }
        }
        return counter;
    }

    doSprite(): number[]{
        this.minx = this.getFirstCol();
        this.maxx = this.getLastCol();
        this.miny = this.getFirstRow();
        this.maxy = this.getLastRow();
        this.realwidth = this.maxx - this.minx + 1;
        this.realheight = this.maxy - this.miny + 1;
        this.xrat = Math.round(this.realwidth / 3);
        this.yrat = Math.round(this.realheight / 3);
        const s1 = this.getCountInRect(this.minx, this.miny, this.xrat, this.yrat);
        const s2 = this.getCountInRect(this.minx+this.xrat, this.miny, this.xrat, this.yrat);
        const s3 = this.getCountInRect(this.minx+2*this.xrat, this.miny, this.xrat, this.yrat);
        const s4 = this.getCountInRect(this.minx, this.miny+this.yrat, this.xrat, this.yrat);
        const s5 = this.getCountInRect(this.minx+this.xrat, this.miny+this.yrat, this.xrat, this.yrat);
        const s6 = this.getCountInRect(this.minx+2*this.xrat, this.miny+this.yrat, this.xrat, this.yrat);
        const s7 = this.getCountInRect(this.minx, this.miny+2*this.yrat, this.xrat, this.yrat);
        const s8 = this.getCountInRect(this.minx+this.xrat, this.miny+2*this.yrat, this.xrat, this.yrat);
        const s9 = this.getCountInRect(this.minx+2*this.xrat, this.miny+2*this.yrat, this.xrat, this.yrat);
        const xc = this.xrat* this.yrat;
        const percent = 0.2;
        const vector = [s1/xc>percent?1:0, s2/xc>percent?1:0,s3/xc>percent?1:0,
            s4/xc>percent?1:0, s5/xc>percent?1:0, s6/xc>percent?1:0,
            s7/xc>percent?1:0, s8/xc>percent?1:0, s9/xc>percent?1:0,];
        this.setState(this.state);
        return vector;
    }
    doRecognize() {

    }
}