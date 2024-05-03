import React, {  } from 'react';
import './App.css';
import Logo from './components/logo/logo';
import User from './components/user/user';
import Statusline from './components/statusline/statusline';
import Toolbar from './components/toolbar/toolbar';
import Properties, { PropsTypes } from './components/properties/properties';
import Source from './components/source/source';
import { Brain, Neuron } from './model/brain';
import BrainComponent from './components/brain/brain';

interface IAppState {
  curNeuron: Neuron;
}

export default class App extends React.Component<{}, IAppState> {
  propertiesRef: React.RefObject <Properties> = React.createRef();
  sourceRef: React.RefObject <Source> = React.createRef();
  brain = new Brain();
  propertiesType: PropsTypes = '';
  onAddNeuron() {
    this.propertiesType = "neuron";
    this.setState({});
  }
  onAddSource() {
  //  document
  }
  onAddCascade() {
    this.propertiesType = "cascade";
    this.setState({});
  }

  onCascadeCreate() {

  }
  onImageChanged() {
    this.setState({});
  }
  onNeuronCreateOrUpdate() {
    let a_count = this.propertiesRef.current?.acountRef.current?.value;
    let sw_count = this.propertiesRef.current?.swcountRef.current?.value;
    let sh_count = this.propertiesRef.current?.shcountRef.current?.value;
    let n_name = this.propertiesRef.current?.neuronnameRef.current?.value;
    let a = a_count === undefined || a_count === ""?0:parseInt(a_count);
    let sw = sw_count === undefined || sw_count === ""?0:parseInt(sw_count);
    let sh = sh_count === undefined || sh_count === ""?0:parseInt(sh_count);
    let name = n_name === undefined?"":n_name;
    a = a === 0? a+1: a;
    sw = sw === 0? sw+1: sw;
    sh = sh === 0? sh+1: sh;
    const n = this.brain.addNeuron(name, sw, sh, a);
    if (this.sourceRef.current?.canvasRef.current) {
      n.createLinkImage(this.sourceRef.current?.canvasRef.current, 0, 0);
    }
    this.propertiesType = "";
    this.setState({});
  }
  render(): React.ReactNode {
    return (
      <div className="App">
        <Logo></Logo>
        <User></User>
        <Toolbar brainName='My brain' 
          onAddNeuron={this.onAddNeuron.bind(this)} 
          onAddSource={this.onAddSource.bind(this)}
          onAddCascade={this.onAddCascade.bind(this)}></Toolbar>
        <Source ref={this.sourceRef} width={5} height={5} onImageChanged={this.onImageChanged.bind(this)}></Source>
        <BrainComponent {...this.brain}></BrainComponent>
        <Properties type={this.propertiesType} ref={this.propertiesRef} onNeuronUpdated={this.onNeuronCreateOrUpdate.bind(this)}/>
        <Statusline connected={false} allSaved={true} errorCode={0}></Statusline>
      </div>
    );
  }
}
