import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });
let allsocket: User[] = [];
interface User{
    socket:WebSocket;
    room:number;
}
wss.on("connection", (socket) => {

    socket.on("message",(message)=>{
        // @ts-ignore
        const pasemessage=JSON.parse(message);
        if(pasemessage.type=="join"){
            allsocket.push({
                socket,
                room:pasemessage.payload.roomId,
            })
        }
        if (pasemessage.type=="chat")
        {
            let currentuser=null;
            for (let i=0;i<allsocket.length;i++)
            {
                // @ts-ignore
                if (allsocket[i].socket==socket)
                {
                    // @ts-ignore
                    currentuser=allsocket[i].room;
                }
            }
            for (let i=0;i<allsocket.length;i++)
            {
                // @ts-ignore
                if (allsocket[i].room==currentuser)
                {
                    allsocket[i]?.socket.send(pasemessage.payload.message);
                }
            }
        }
    })
});