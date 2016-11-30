import shuffle from 'lodash.shuffle';
import React from 'react';
import {guild} from './guild';
import s from './index.scss';

export default class Main extends React.Component {
  allocations = 46;

  constructor(props) {
    super(props);
    this.state = {
      people: shuffle(guild),
      title: `Click me in order to choose ${this.allocations} winners out of ${guild.length} candidates!`
    };
  }

  setWinners() {
    this.setState({
      people: shuffle(guild).slice(0, this.allocations),
      title: 'And the winners are...'
    });
  }

  onStart() {
    let counter = 100;
    const interval = setInterval(() => counter-- ? this.setWinners() : clearInterval(interval), 10);
  }

  render() {
    const basis = Math.floor(Math.sqrt(((window.innerWidth - 200) * (window.innerHeight - 200)) / this.state.people.length));
    return (
      <div>
        <button onClick={() => this.onStart()}>{this.state.title}</button>
        <br/>
        <br/>
        <div className={s.guild}>
          {this.state.people.map(x =>
            <div className={s.person} style={{flexBasis: `${basis}px`}} key={x.name}>
              <img src={x.image}/>
              <span>{x.name}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
}
