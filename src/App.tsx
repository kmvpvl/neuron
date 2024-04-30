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
  brain = new Brain();
  propertiesType: PropsTypes = '';
  onAddNeuron() {
    this.propertiesType = "neuron";
    this.setState({});
  }
  onNeuronCreateOrUpdate() {
    let a_count = this.propertiesRef.current?.acountRef.current?.value;
    let s_count = this.propertiesRef.current?.scountRef.current?.value;
    let n_name = this.propertiesRef.current?.neuronnameRef.current?.value;
    let a = a_count === undefined || a_count === ""?0:parseInt(a_count);
    let s = s_count === undefined || s_count === ""?0:parseInt(s_count);
    let name = n_name === undefined?"":n_name;
    a = a === 0? a+1: a;
    s = s === 0? s+1: s;
    this.brain.addNeuron(name, s, a);
    this.propertiesType = "";
    this.setState({});
  }
  render(): React.ReactNode {
    return (
      <div className="App">
        <Logo></Logo>
        <User></User>
        <Toolbar brainName='My brain' onAddNeuron={this.onAddNeuron.bind(this)}></Toolbar>
        <Source></Source>
        <BrainComponent {...this.brain}></BrainComponent>
        <Properties type={this.propertiesType} ref={this.propertiesRef} onNeuronUpdated={this.onNeuronCreateOrUpdate.bind(this)}/>
        <Statusline connected={false} allSaved={true}></Statusline>
      </div>
    );
  }
}
