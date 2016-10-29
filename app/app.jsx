import React, {Component} from 'react';
const { render } = require('react-dom');
const HOST = 'http://localhost:3000/';
// TESTING RELATED --------------------- //
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
        let firstView;
        let currentRoomId;
        if (localStorage.getItem('lastView')) {
          firstView = localStorage.getItem('lastView');
          currentRoomId = localStorage.getItem('lastRoom');
        } else {
          firstView='room';
          currentRoomId = '5';
        }
        this.state = {
            messages: [],
            view: firstView,
            currentRoomId,
            userId: '1',
            roomList: testRooms,
        };
    }
    changeView(view) {
      const newStateObj = {view};
      localStorage.setItem('lastView', view);
      this.setState(newStateObj);
    }
    addNewMessages(msgs) {
      const newStateObj = { messages: this.state.messages.concat(msgs)};
      this.setState(newStateObj);
    }
    addGotMessages(msgs) {
      const newStateObj = { messages: msgs};
      this.setState(newStateObj);
    }
    addNewRooms(rooms) {
      const newStateObj = { roomList: this.state.messages.concat(rooms)};
      this.setState(newStateObj);
    }
    joinRoom(roomId) {
      const newStateObj = { view: 'room', currentRoomId: roomId };
            localStorage.setItem('lastView', 'room');
            localStorage.setItem('lastRoom', roomId);
      this.setState(newStateObj);
    }
    createRoom() {
      const name = document.getElementById('create-room-name').value;
      const expires = moment().add(document.getElementById('create-room-name').value, 'minutes');
      function error() {
        console.log('geolocation error');
      }
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
        const lat = position.coords.latitude;
        const long = position.coords.longitude
      const objToSend = {
        name,
        expires,
        lat,
        long,
      }
      const postReq = new XMLHttpRequest;
      postReq.addEventListener('load', () => {
        console.log('New Room Posted. Redirecting', postReq.responseText);
        const responseBody = JSON.parse(postReq.responseText);
        this.changeView(responseBody._id);
      });
      postReq.open("POST", HOST + 'createroom');
      postReq.setRequestHeader("Content-type", "application/json");
      postReq.send(JSON.stringify(objToSend));
    }, error);
    }
    render() {
        if (this.state.view === 'room') {
          return <RoomView currentRoomId={this.state.currentRoomId} messages={this.state.messages} changeView={this.changeView.bind(this)} addGotMessages={this.addGotMessages.bind(this)} addNewMessages={this.addNewMessages.bind(this)}/>
        } else if (this.state.view === 'lobby') {
          return <Lobby roomList={this.state.roomList} addNewRooms={this.addNewRooms.bind(this)} joinRoom={this.joinRoom.bind(this)} changeView={this.changeView.bind(this)}/>
        } else if (this.state.view === 'createRoom') {
          return <RoomCreate createRoom={this.createRoom.bind(this)} changeView={this.changeView.bind(this)}/>
        }
    }
}
class RoomCreate extends Component {
  render() {
    return (
      <div className="room-create-container">
        <input id='create-room-name' type='text' placeholder='Room Name'>
        </input>
        <input id='create-room-lifetime' type='text' placeholder='Lifetime of Room in mins'>
        </input>
        <button className='btn-back' onClick={() => this.props.changeView('lobby')}>Cancel</button>
        <button className='btn-create' onClick={() => this.props.createRoom()}>Create</button>
      </div>
    )
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
        <Chatbox messages={this.props.messages} addGotMessages={this.props.addGotMessages} currentRoomId={this.props.currentRoomId} addNewMessages={this.props.addNewMessages}/>
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
        console.log('Messages GOT', getReq.responseText);
        this.props.addGotMessages(JSON.parse(getReq.responseText));
      });
      getReq.send();
    }
    postMsg() {
      const msg = document.getElementById('newmsgbody').value;
      const msgObj = {
        msgBody: msg,
      };
      console.log('message to post:', JSON.stringify(msgObj));
      const postReq = new XMLHttpRequest;
      postReq.addEventListener('load', () => {
        console.log('New Message Posted. ', postReq.responseText);
        this.props.addNewMessages(JSON.parse(postReq.responseText));
      });
      postReq.open("POST", HOST + 'rooms/' + this.props.currentRoomId);
      postReq.setRequestHeader("Content-type", "application/json");
      postReq.send(JSON.stringify(msgObj));
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
      <span className='msg-creator'>{this.props.data.createdBy}</span> said at
      <span className='msg-timestamp'>{this.props.data.createdAt}</span>
      <span className='msg-body'>{this.props.data.msgBody}</span>
    </div>
  )
  }
}

class Lobby extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    function error(e) {
      console.log('geolocation error', e);
    }
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const long = position.coords.longitude;
      const getReq = new XMLHttpRequest;
      getReq.open("GET", HOST + 'roomlist');
      getReq.setRequestHeader('Content-Type', 'application/json');
      getReq.setRequestHeader('Lat', lat);
      getReq.setRequestHeader('Long', long);
      getReq.addEventListener('load', () => {
        console.log('Rooms GOT', this.responseText);
        this.props.addNewRooms(JSON.parse(this.responseText));
      });
      getReq.send();
    }, error);
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
      <button className='btn-create' onClick={() => this.props.changeView('createRoom')}>Create New Room</button>
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
