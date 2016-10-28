import React, {Component} from 'react';
const { render } = require('react-dom');
const HOST = 'http://localhost:3000/';
// TESTING RELATED --------------------- //
const testMsgs = [
    {
        "createdAt": "2016-10-27T21:51:18-07:00",
        "roomId": "1",
        "createdBy": "ahmad",
        "msgBody": "Sup Guise.",
    },
    {
        "createdAt": "2016-10-27T20:51:18-07:00",
        "roomId": "1",
        "createdBy": "Stef",
        "msgBody": "Hey.",
    },
    {
        "createdAt": "2016-10-27T19:51:18-07:00",
        "roomId": "1",
        "createdBy": "Ryan",
        "msgBody": "Whaddup.",
    },
    {
        "createdAt": "2016-10-27T18:51:18-07:00",
        "roomId": "1",
        "createdBy": "Mystery Man",
        "msgBody": "???",
    },
];

const testRooms = [
  {
    "lat": "33.35",
    "long": "-118.02",
    "expires": "2016-10-27T18:51:18-07:00",
    "name": 'CodeSmith Kitchen',
    "creatorId": 'Ryan',
    "_id": '5',
  },
  {
    "lat": "33.35",
    "long": "-118.02",
    "expires": "2016-10-27T18:51:18-07:00",
    "name": 'CodeSmith Kitchen',
    "creatorId": 'Ryan',
    "_id": '6',
  }
];
class App extends Component {
    constructor() {
        super();
        this.state = {
            messages: testMsgs,
            view: 'room',
            currentRoomId: '9',
            userId: '1',
            roomList: testRooms,
        };
    }
    changeView(room) {
      const newStateObj = {view: room};
      this.setState(newStateObj);
    }
    addNewMessages(msgs) {
      const newStateObj = { messages: this.state.messages.concat(msgs)};
      this.setState(newStateObj);
    }
    joinRoom(roomId) {
      const newStateObj = { view: 'room', currentRoomId: roomId };
      this.setState(newStateObj);
    }
    render() {
        if (this.state.view === 'room') {
          return <RoomView currentRoomId={this.state.currentRoomId} messages={this.state.messages} changeView={this.changeView.bind(this)} addNewMessages={this.addNewMessages.bind(this)}/>
        } else if (this.state.view === 'lobby') {
          return <Lobby roomList={this.state.roomList} joinRoom={this.joinRoom.bind(this)}/>
        }
    }
}
class RoomView extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div id='chatroom-container'>
        <h3>Room: {this.props.currentRoomId}</h3>
        <button className='btn-back' onClick={() => this.props.changeView('lobby')}>Back to Lobby</button>
        <Chatbox messages={this.props.messages} currentRoomId={this.props.currentRoomId} addNewMessages={this.props.addNewMessages}/>
      </div>
    )
}
}

class Chatbox extends Component {
    constructor(props) {
      super(props);
    }
    componentDidMount() {
      const getReq = new XMLHttpRequest;
      getReq.open("GET", HOST + 'rooms/' + this.props.currentRoomId);
      getReq.addEventListener('load', () => {
        console.log('Messages GOT', this.responseText);
        this.props.addNewMessages(JSON.parse(this.responseText));
      });
      getReq.send();
    }
    postMsg() {
      const msg = document.getElementById('newmsgbody').value;
      const postReq = new XMLHttpRequest;
      postReq.addEventListener('load', () => {
        console.log('New Message Posted. ', this);
        // this.props.addNewMessages()
      });
      postReq.open("POST", HOST + 'rooms/' + this.props.currentRoomId);
      postReq.setRequestHeader("Content-type", "application/json");
      postReq.send(JSON.stringify(msg));
    }
    render() {
      const messagedivs = [];
      for (let i = 0; i < this.props.messages.length; i++) {
        messagedivs.push(<Message key={`msg${i}`} data={this.props.messages[i]} />);
      }
      return  (
        <div className="chatbox-container">
          {messagedivs}
          {/* <form action={`/rooms/${this.props.currentRoomId}`}> */}
            <input type='text' id='newmsgbody' name='msgbody'></input>
            <button className='btn-postmsg' onClick={() => this.postMsg()}>Post</button>
          {/*  </form> */}
        </div>
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

class Lobby extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const roomDivs = [];
    for (let i = 0; i < this.props.roomList.length; i++) {
      roomDivs.push(<Room key={`room${i}`} data={this.props.roomList[i]} joinRoom={this.props.joinRoom} />);
    }
    return  (
    <div className='lobby-container'>
      <h2>Welcome to the Lobby</h2>
      {roomDivs}
    </div>
  )
  }
}

class Room extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
    <div className='room-object'>
      <span className='room-name'>{this.props.data.roomName}</span>
      <span className='room-creator'>Creator: {this.props.data.creator}</span>
      <span className='room-expires'>Expires: {this.props.data.expires}</span>
      <button className='btn-joinroom' onClick={()=>this.props.joinRoom(this.props.data._id)}>Join</button>
    </div>
  )
  }
}

render(
  <App />,
  document.getElementById('app')
);
