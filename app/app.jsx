import React, {Component} from 'react';
const { render } = require('react-dom');
const HOST = 'http://localhost:3000/';

require("./scss/main.scss");
let socket = io.connect();

// TESTING RELATED --------------------- //
class App extends Component {
    constructor() {
        super();
        // this little chunk helps persist the current view across page refreshes
        // using localstorage
        let firstView;
        let currentRoomId;
        if (localStorage.getItem('lastView') !== null) {
          firstView = localStorage.getItem('lastView');
          currentRoomId = localStorage.getItem('lastRoom');
          socket.on(`${currentRoomId}`, (msg) => {
            console.log('socket msg received:', msg);
            this.addNewMessages(msg);
          });
        // Set defaults if this is their first time.
        } else {
          firstView = 'lobby';
          currentRoomId = '';
        }
        console.log(firstView, currentRoomId);
        this.state = {
            messages: [],
            view: firstView,
            currentRoomId,
            userId: '1',
            roomList: [],
            roomObj: {},
        };
    }
    changeView(view) {
      // clear existing socket listeners, set localStorage
      // for help with view persistence, and set state to swap out components
      socket.off();
      const newStateObj = {view};
      console.log('Changing to view:', view);
      localStorage.setItem('lastView', view);
      // when entering the lobby, add a listener for newRoom events
      if (view === 'lobby') {
        socket.on('newRoom', newRoomObj => {
          const newStateObj = {roomList: this.state.roomList.concat(newRoomObj)};
          this.setState(newStateObj);
        });
      }
      this.setState(newStateObj);
    }
    addNewMessages(msgs) {
      const newStateObj = { messages: this.state.messages.concat(msgs)};
      this.setState(newStateObj);
    }
    addGotMessagesAndRoomData(data) {
      // Also make a socket connection!
      const newStateObj = { messages: data.msgs, roomObj: data.roomObj };
      this.setState(newStateObj);
    }
    addNewRooms(rooms) {
      const newStateObj = { roomList: this.state.messages.concat(rooms)};
      this.setState(newStateObj);
    }
    addGotRooms(rooms) {
      const newStateObj = { roomList: rooms};
      this.setState(newStateObj);
    }
    joinRoom(roomObj) {
      if (moment(roomObj.expires) - moment() < 0) {
        this.changeView('lobby');
      }
      const newStateObj = { view: 'room', currentRoomId: roomObj._id, roomObj };
            localStorage.setItem('lastView', 'room');
            localStorage.setItem('lastRoom', roomObj._id);
            socket.off();
            socket.on(`${roomObj._id}`, (msg) => {
              console.log('socket msg received:', msg);
              this.addNewMessages(msg);
            });
      this.setState(newStateObj);
    }
    createRoom() {
      const name = document.getElementById('create-room-name').value;
      const minsUntilExpiry = document.getElementById('create-room-lifetime').value;
      const expires = moment().add(minsUntilExpiry, 'minutes');
      console.log(`New Room Expires in ${minsUntilExpiry} minutes, which is at: ${expires}`);
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
      };
      const postReq = new XMLHttpRequest;
      postReq.addEventListener('load', () => {
        console.log('New Room Posted. Redirecting', postReq.responseText);
        const newRoomObj = JSON.parse(postReq.responseText);
        socket.emit('createRoom', newRoomObj);
        this.joinRoom(newRoomObj);
      });
      postReq.open("POST", HOST + 'createroom');
      postReq.setRequestHeader("Content-type", "application/json");
      postReq.send(JSON.stringify(objToSend));
    }, error);
    }
    // leaveRoom(roomObj) {
    //   socket.removeListener(`${roomObj._id}`);
    //   this.changeView('lobby');
    // }
    render() {
        if (this.state.view === 'room') {
          return <RoomView roomObj={this.state.roomObj} currentRoomId={this.state.currentRoomId} messages={this.state.messages} changeView={this.changeView.bind(this)} addGotMessagesAndRoomData={this.addGotMessagesAndRoomData.bind(this)} addNewMessages={this.addNewMessages.bind(this)}/>
        } else if (this.state.view === 'lobby') {
          return <Lobby roomList={this.state.roomList} addGotRooms={this.addGotRooms.bind(this)} joinRoom={this.joinRoom.bind(this)} changeView={this.changeView.bind(this)}/>
        } else if (this.state.view === 'createRoom') {
          return <RoomCreate createRoom={this.createRoom.bind(this)} changeView={this.changeView.bind(this)}/>
        } else {
          return <div><h1>Where's your view, brah?</h1></div>
        }
    }
}
class RoomCreate extends Component {
  render() {
    return (
      <div className="room-create-container">
        <input id='create-room-name' type='text' placeholder='Room Name'>
        </input>
        <input id='create-room-lifetime' type='text' placeholder='Room Life'>
        </input>
        <button className='btn-back' onClick={() => this.props.changeView('lobby')}>Create</button>
        <button className='btn-create' onClick={() => this.props.createRoom()}>Cancel</button>
      </div>
    )
  }
}
class RoomView extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log('roomObj:', this.props.roomObj);
    const expiry = moment(this.props.roomObj.expires).fromNow();
    return (
      <div id='chatroom-container'>
        <h3>Room: {this.props.roomObj.name}</h3>
        <h4>Expires: {expiry}</h4>
        <button className='btn-back' onClick={() => this.props.changeView('lobby')}>Back to Lobby</button>
        <Chatbox changeView={this.props.changeView} messages={this.props.messages} addGotMessagesAndRoomData={this.props.addGotMessagesAndRoomData} currentRoomId={this.props.currentRoomId} addNewMessages={this.props.addNewMessages}/>
      </div>
    )
}
}

class Chatbox extends Component {
    constructor(props) {
      super(props);
    }
    componentDidMount() {
      console.log('mounting room', this.props.currentRoomId);
      const getReq = new XMLHttpRequest;
      getReq.open("GET", HOST + 'rooms/' + this.props.currentRoomId);
      getReq.addEventListener('load', () => {
        const data = JSON.parse(getReq.responseText);
        console.log('Data GOT', data);
        if (data.roomObj && ((moment(data.roomObj.expires) - moment()) > 0)) this.props.addGotMessagesAndRoomData(data);
        else this.props.changeView('lobby');
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
        socket.emit('post', JSON.parse(postReq.responseText));
        // this.props.addNewMessages(JSON.parse(postReq.responseText));
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
            <input type='text' id='newmsgbody' name='msgbody'></input>
            <button className='btn-postmsg' onClick={() => this.postMsg()}>Post</button>
        </div>
      )
    }
}

class Message extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const thisTime = moment(this.props.data.createdAt).fromNow();
    return (
    <div className='msg-object'>
      Sum Gai<span className='msg-creator'>{this.props.data.createdBy}</span> said at
      <span className='msg-timestamp'>{thisTime}</span> :
      <span className='msg-body'>{this.props.data.msgBody}</span>
    </div>
  )
  }
}

class Lobby extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
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
        console.log('Rooms GOT', getReq.responseText);
        this.props.addGotRooms(JSON.parse(getReq.responseText));
      });
      getReq.send();
    }, error);
  }
  render() {
    const roomDivs = [];
    for (let i = 0; i < this.props.roomList.length; i++) {
      const expiry = moment(this.props.roomList[i].expires).fromNow();
      roomDivs.push(<Room key={`room${i}`} data={this.props.roomList[i]} expiry={expiry} joinRoom={this.props.joinRoom} />);
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
      <span className='room-name'>{this.props.data.name}</span>
      <span className='room-creator'>Creator: {this.props.data.creatorid}</span>
      <span className='room-expires'>Expires: {this.props.expiry}</span>
      <button className='btn-joinroom' onClick={()=>this.props.joinRoom(this.props.data)}>Join</button>
    </div>
  )
  }
}

render(
  <App />,
  document.getElementById('app')
);
