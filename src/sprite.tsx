import React from 'react';
import "./sprite.css";

interface ISpriteProps {
    v: number;
}

interface ISpriteState {

}

export default class Sprite extends React.Component<ISpriteProps, ISpriteState> {
    render(): React.ReactNode {
        const vv = new Array<boolean>();
        for (let i = 0; i < 9; i++) vv.push( ((this.props.v >> i) & 1) === 1 );
        return <div className='sprite-container'>
            {vv.map((v, i)=><span key={i} className={v?'sprite-cell-black':''}></span>)}
        </div>;
    }
}