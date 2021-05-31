const SEND = 'redux/message/SEND';
const SEND_SUCCESS = 'redux/message/SEND_SUCCESS';
const SEND_FAIL = 'redux/message/SEND_FAIL';

//send chat message
export function send(chatId, content) {
    const message = { chatId, content };
    return {
        type: 'socket',
        types: [SEND, SEND_SUCCESS, SEND_FAIL],
        promise: (socket) => socket.emit('SendMessage', message),
    }
}

