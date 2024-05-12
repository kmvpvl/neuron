import React, {  } from 'react';
import './App.css';
import Logo from './components/logo/logo';
import User from './components/user/user';
import Statusline, { IStatuslineState } from './components/statusline/statusline';
import Toolbar from './components/toolbar/toolbar';
import Properties, {  } from './components/properties/properties';
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
  userRef: React.RefObject<User> = React.createRef();
  braincompenentRef: React.RefObject<BrainComponent> = React.createRef();
  brain = new Brain();
  brainList: Array<string> = [];
  _username: string | null = localStorage.getItem("neuron_username");
  _authtoken: string | null = localStorage.getItem("neuron_authtoken");

  componentDidMount(): void {
    this.ping();
    //setInterval(this.ping.bind(this), 30000);
    if (this._username && this._authtoken) {
      this.loadBrainList();
    }
  }
  loadBrainList() {
    this.pendingRef.current?.incUse();
    this.brain.clear();
    serverCommand('brainlist', this.loginReq, undefined, (res)=> {
      this.pendingRef.current?.decUse();
      this.brainList = res;
      this.setState({});
    }, (err)=>{
      this.pendingRef.current?.decUse();
    });
  }
  loadBrain(brainname: string){
    this.pendingRef.current?.incUse();
    this.brain.clear();
    serverCommand('loadbrain', this.loginReq, {brainname: brainname}, (res)=> {
      this.pendingRef.current?.decUse();
      this.brain.clear();
      this.brain._name = res.name;
      for (let i = 0; i < res.neurons.length;i++){
        const n:INeuron = res.neurons[i];
        const no = this.brain.addNeuron(n._name, n._SWCount, n._SHCount, n._ACount, n._layer, n._ANames, n._learnCount, n._W, n._SLinks, this.sourceRef.current?.canvasRef.current);
        no.getSValues();
      }
      this.braincompenentRef.current?.setState({});
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
  onAddNeuronButtonPressed() {
    this.propertiesRef.current?.setState({type: "neuron"});
  }
  onAddSource() {
  //  document
  }
  onLearn() {
    this.propertiesRef.current?.setState({type: "learn"});
  }
  onAddCascade() {
    this.propertiesRef.current?.setState({type: "cascade"});
  }

  onCascadeCreate() {

  }
  onImageChanged() {
    this.braincompenentRef.current?.setState({});
  }
  onImageResized(w: number, h: number) {

  }
  doNeuronCreateOrUpdate() {
    let a_count = this.propertiesRef.current?.acountRef.current?.value;
    let a = a_count === undefined || a_count === ""?0:parseInt(a_count);

    let sw_count = this.propertiesRef.current?.swcountRef.current?.value;
    let sh_count = this.propertiesRef.current?.shcountRef.current?.value;
    let sw = sw_count === undefined || sw_count === ""?0:parseInt(sw_count);
    let sh = sh_count === undefined || sh_count === ""?0:parseInt(sh_count);

    let n_name = this.propertiesRef.current?.neuronnameRef.current?.value;
    let name = n_name === undefined?"":n_name;
    a = a === 0? a+1: a;
    sw = sw === 0? sw+1: sw;
    sh = sh === 0? sh+1: sh;
    const n = this.brain.addNeuron(name, sw, sh, a);
    if (this.sourceRef.current?.canvasRef.current) {
      n.createLinkImageDelta(this.sourceRef.current?.canvasRef.current);
    }
    this.propertiesRef.current?.setState({type: ""});
    this.saveBrain();
    this.braincompenentRef.current?.setState({});
  }

  doCascadeCreate() {
    const n_templName = this.propertiesRef.current?.cascadeNameRef.current?.value;
    const templName = n_templName === undefined?"":n_templName;

    const sw_count = this.propertiesRef.current?.swcountRef.current?.value;
    const sh_count = this.propertiesRef.current?.shcountRef.current?.value;
    const sw = sw_count === undefined || sw_count === ""?0:parseInt(sw_count);
    const sh = sh_count === undefined || sh_count === ""?0:parseInt(sh_count);

    const n_hiddenLayers = this.propertiesRef.current?.hiddenLayersCountRef.current?.value;
    const hiddenLayersCount = n_hiddenLayers === undefined || n_hiddenLayers === ""?1:parseInt(n_hiddenLayers);

    // creating first layer
    const sourceWidth = this.sourceRef.current?.state.width as number;
    const sourceHeight = this.sourceRef.current?.state.height as number;
    const tileW = sourceWidth - sw + 1;
    const tileH = sourceHeight - sh + 1;
    for (let i = 0; i < tileW; i ++) {
      for (let j = 0; j < tileH; j ++) {
        const n = this.brain.addNeuron(`${templName}-S-${i}-${j}`, sw, sh, hiddenLayersCount, 0);
        if (this.sourceRef.current?.canvasRef.current) {
          n.createLinkImageDelta(this.sourceRef.current?.canvasRef.current, i, j);
        }
      }
    }
    this.propertiesRef.current?.setState({type: ""});
    this.saveBrain();
    this.braincompenentRef.current?.setState({});
  }

  doRemoveAllNerons() {
    this.brain.clear();
    this.saveBrain();
    this.braincompenentRef.current?.setState({});
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
    this.braincompenentRef.current?.setState({});
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
  onBrainSelected(brainName: string) {
    this.loadBrain(brainName);
  }
  render(): React.ReactNode {
    return (
      <div className="App">
        <Logo></Logo>
        <User onCreateUser={this.createUser.bind(this)} username={this._username?this._username:undefined} brainlist={this.brainList} ref={this.userRef} onBrainSelected={this.onBrainSelected.bind(this)}></User>
        <Toolbar brainName='My brain' 
          onAddNeuron={this.onAddNeuronButtonPressed.bind(this)} 
          onAddSource={this.onAddSource.bind(this)}
          onRemoveAllNeurons={this.doRemoveAllNerons.bind(this)}
          onAddCascade={this.onAddCascade.bind(this)}
          onLearn={this.onLearn.bind(this)}></Toolbar>
        <Source ref={this.sourceRef} onImageChanged={this.onImageChanged.bind(this)} onImageResized={this.onImageResized.bind(this)}></Source>
        <BrainComponent ref={this.braincompenentRef} {...this.brain}></BrainComponent>
        <Properties ref={this.propertiesRef} 
          onApplyNeuronUpdate={this.doNeuronCreateOrUpdate.bind(this)}
          onApplyCascadeCreate={this.doCascadeCreate.bind(this)}
          onLearn={this.doLearn.bind(this)}
        />
        <Statusline ref={this.statuslineRef}></Statusline>
        <Pending ref={this.pendingRef}/>
      </div>
    );
  }
}
