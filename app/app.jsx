import React, {Component} from 'react';
const { render } = require('react-dom');

// TESTING RELATED --------------------- //
const testMsgs = [
    {
        "time": "2016-10-27T21:51:18-07:00",
        "room": "1",
        "creator": "ahmad",
        "msgbody": "Sup Guise.",
    },
    {
        "time": "2016-10-27T20:51:18-07:00",
        "room": "1",
        "creator": "Stef",
        "msgbody": "Hey.",
    },
    {
        "time": "2016-10-27T19:51:18-07:00",
        "room": "1",
        "creator": "Ryan",
        "msgbody": "Whaddup.",
    },
    {
        "time": "2016-10-27T18:51:18-07:00",
        "room": "1",
        "creator": "Mystery Man",
        "msgbody": "???",
    },
];


class App extends Component {
    constructor() {
        super();
        this.state = {
            messages: testMsgs,
            view: 'room',
            currentRoom: '',
        };
    }
    render() {
        if (this.state.view === 'room') {
          return <Room roomId={this.state.currentRoom} messages={this.state.messages} />
        } else {
          return <div>NO</div>
        }
    }
}
class Room extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <Chatbox messages={this.props.messages} />
  }
}

class Chatbox extends Component {
    constructor(props) {
      super(props);
    }
    render() {
      const messagedivs = [];
      for (let i = 0; i < this.props.messages.length; i++) {
        messagedivs.push(<Message data={this.props.messages[i]} />);
      }
      return  (
        <div>{messagedivs}</div>
      )
    }
}

class Message extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
    <div className='msg-object'>
      <span className='msg-creator'>{this.props.data.creator}</span> said at
      <span className='msg-timestamp'>{this.props.data.time}</span>
      <span className='msg-body'>{this.props.data.msgbody}</span>
    </div>
  )
  }
}
render(
  <App />,
  document.getElementById('app')
);
