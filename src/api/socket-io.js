import IO from 'socket.io-client';
import config from '@/config.js';

export default function () {
    let socketUrl = config.get('websocket');
    const socket = IO(socketUrl);
    let userinfo = getCookie('userInfo')
    if (userinfo) {
        let msg = {
            type: "crm",
            data: null,
            create_time: userinfo.dateTime,
            uid: userinfo.id,
            department: userinfo.department || 0
        };
        socket.emit("init", JSON.stringify(msg));
    }
    return socket
}