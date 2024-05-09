import React, {  } from 'react';
import './App.css';
import Logo from './components/logo/logo';
import User from './components/user/user';
import Statusline, { IStatuslineState } from './components/statusline/statusline';
import Toolbar from './components/toolbar/toolbar';
import Properties, { PropsTypes } from './components/properties/properties';
import Source from './components/source/source';
import { Brain, INeuron, Neuron } from './model/brain';
import BrainComponent from './components/brain/brain';
import { ILoginReq, serverCommand, serverFetch } from './common/fetches';
import Pending from './components/pending/pending';

interface IAppState {
  curNeuron: Neuron;
}

export default class App extends React.Component<{}, IAppState> {
  propertiesRef: React.RefObject <Properties> = React.createRef();
  sourceRef: React.RefObject <Source> = React.createRef();
  statuslineRef: React.RefObject <Statusline> = React.createRef();
  pendingRef: React.RefObject <Pending> = React.createRef();
  brain = new Brain();
  propertiesType: PropsTypes = '';
  _username: string | null = localStorage.getItem("neuron_username");
  _authtoken: string | null = localStorage.getItem("neuron_authtoken");

  componentDidMount(): void {
    this.ping();
    //setInterval(this.ping.bind(this), 30000);
    if (this._username && this._authtoken) {
      this.loadBrain();
    }
  }
  loadBrain(){
    this.pendingRef.current?.incUse();
    this.brain.clear();
    serverCommand('loadbrain', this.loginReq, {brainname: ""}, (res)=> {
      this.pendingRef.current?.decUse();
      this.brain.clear();
      for (let i = 0; i < res.neurons.length;i++){
        const n:INeuron = res.neurons[i];
        const no = this.brain.addNeuron(n._name, n._SWCount, n._SHCount, n._ACount, n._ANames, n._learnCount, n._W, n._SLinks, this.sourceRef.current?.canvasRef.current);
        no.getSValues();
      }
      this.setState({});
    }, (err)=>{
      this.pendingRef.current?.decUse();
    });
  }
  ping () {
    const obj = this;
    serverFetch('version', "GET", undefined, undefined, (res)=>{
      if (obj.statuslineRef.current) {
        let stl: IStatuslineState = obj.statuslineRef.current?.state;
        stl.connected = true;
        obj.statuslineRef.current?.setState(stl);
      }
    }, (err)=> {
      if (obj.statuslineRef.current) {
        let stl: IStatuslineState = obj.statuslineRef.current?.state;
        stl.connected = false;
        stl.errors.push({
          errorCode: -1,
          errorText: err.message
        });
        obj.statuslineRef.current?.setState(stl);
      }
    })
  }
  onAddNeuron() {
    this.propertiesType = "neuron";
    this.setState({});
  }
  onAddSource() {
  //  document
  }
  onLearn() {
    this.propertiesType = "learn";
    this.setState({});
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
  doNeuronCreateOrUpdate() {
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
    this.saveBrain();
    this.setState({});
  }
  get loginReq(): ILoginReq {
    return {username: this._username as string, authtoken: this._authtoken as string};
  } 

  saveBrain() {
    this.pendingRef.current?.incUse();
    serverCommand('savebrain', this.loginReq, {brain: this.brain.json}, (res)=> {
      this.pendingRef.current?.decUse();
    }, (err)=> {
      this.pendingRef.current?.decUse();
    })
  }

  doLearn() {
    const rightValue = parseFloat(this.propertiesRef.current?.rightValueRef.current?.value as string);
    const ind = parseInt(this.propertiesRef.current?.AindexRef.current?.value as string);
    this.brain._neurons[0].learn(ind, rightValue);
    this.saveBrain();
    this.setState({});
  }
  saveUserToLocalStorage(){
    if (this._username && this._authtoken) {
      localStorage.setItem("neuron_username", this._username);
      localStorage.setItem("neuron_authtoken", this._authtoken);
    }
  }
  createUser(name: string) {
    this.pendingRef.current?.incUse();
    serverCommand('newuser', undefined, {
      username: name
    }, (res)=>{
      this.pendingRef.current?.decUse();
      this._username = name;
      this._authtoken = res.authtoken;
      this.saveUserToLocalStorage();
      this.setState({});
    }, (err)=> {
      this.pendingRef.current?.decUse();
    })
  }
  render(): React.ReactNode {
    return (
      <div className="App">
        <Logo></Logo>
        <User onCreateUser={this.createUser.bind(this)} username={this._username?this._username:undefined}></User>
        <Toolbar brainName='My brain' 
          onAddNeuron={this.onAddNeuron.bind(this)} 
          onAddSource={this.onAddSource.bind(this)}
          onAddCascade={this.onAddCascade.bind(this)}
          onLearn={this.onLearn.bind(this)}></Toolbar>
        <Source ref={this.sourceRef} width={5} height={5} onImageChanged={this.onImageChanged.bind(this)}></Source>
        <BrainComponent {...this.brain}></BrainComponent>
        <Properties type={this.propertiesType} ref={this.propertiesRef} 
          onNeuronUpdated={this.doNeuronCreateOrUpdate.bind(this)}
          onLearn={this.doLearn.bind(this)}
        />
        <Statusline ref={this.statuslineRef}></Statusline>
        <Pending ref={this.pendingRef}/>

      </div>
    );
  }
}
