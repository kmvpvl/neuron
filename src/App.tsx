import React, { RefObject } from 'react';
import './App.css';
import Learn from './learn';
import Paint from './recognize';

export default class App extends React.Component<{}, {}> {
  learnRef: RefObject<Learn> = React.createRef();
  recognizeRef: RefObject<Paint> = React.createRef();
  render(): React.ReactNode {
    return (
      <div className="App">
        <button onClick={()=>this.learnRef.current?.doLearn()}>Learn</button>
        <button onClick={()=>{
          const v = this.recognizeRef.current?.doSprite();
          const ch = this.learnRef.current?.doCalc(v as number[]) as number;
          alert(`${ch>0.3?'x':'not x'}: assurance: ${ch>0.3?ch:1- 0.3+ch}`);
        }}>Recognize</button>
        <Paint ref={this.recognizeRef}/>
        <Learn ref={this.learnRef}></Learn>
      </div>
    );
  }
}
