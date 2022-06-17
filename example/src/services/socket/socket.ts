import io from 'socket.io-client';

const socket = io('https://meet-app-video.herokuapp.com');
export default socket;