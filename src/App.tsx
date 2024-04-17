import React from 'react';
import './App.css';
import BrainComponent from './components/brain/brain';
import { Brain, IBrain } from './model/brain';

export default class App extends React.Component<{}, {}> {
  brain: Brain = new Brain();
  render(): React.ReactNode {
    return (
      <div className="App">
        <BrainComponent {...this.brain as IBrain}></BrainComponent>
      </div>
    );
  }
}
