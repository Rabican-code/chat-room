import PieSocket from 'piesocket-js';
import { useEffect, useState } from 'react';
import { useRef } from 'react'
import './App.css';

var channel;
var userName
function App() {

  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState("");
  const containerRef = useRef(null);

  var pieSocket = new PieSocket({
    clusterId: "s8014.nyc1",
    apiKey: "LCxNDwujfA9MnjZ99WC3pXFRb0cDP1kIWldrVqOa",
    notifySelf: true,
    presence: true,
  });
  useEffect(() => {
    userName = "user_" + (Math.floor(Math.random() * 1000));
    pieSocket.subscribe("chat-room").then((ch) => {
      channel = ch;
      console.log("Channel is ready");

      channel.listen("new_message", (data, meta) => {
        console.log("New message: ", data);
        setMessageList(data);
        if (data.from === userName) {
          containerRef.current.insertAdjacentHTML('beforeend', `<div> <h2>${data.message}</h2> <p> from : You</p>  <div>`);
        }
        else {
          containerRef.current.insertAdjacentHTML('beforeend', `<div> <h2>${data.message}</h2> <p>From : ${data.from}</p>  <div>`);
        }
      });
    })

  });

  const sendMessage = async () => {
    if (channel == null) {
      alert("Channel is not connected yet, wait a sec");
    }
    const messageData = {
      message: currentMessage,
      from: userName,
    };
    await channel.publish("new_message", messageData);

    setCurrentMessage("");

  }
  console.log(messageList.message)
  console.log(messageList.from)

  return (
    <>

      <div className='chatHead'>
        <h1 className="header">Chat</h1>
        <div className='chatBox'>
          {/* Show text */}

          <div className="chatLog">
            <div className='main'
              ref={containerRef}></div>
          </div>

          {/* Input fileld */}

        </div>
        <div className="ChatInput">
          <input
            type="text"
            className="input"
            value={currentMessage}
            placeholder="Type a message"
            autoFocus
            onChange={(event) => {
              setCurrentMessage(event.target.value);
            }}
            onKeyPress={(event) => {
              event.key === "Enter" && sendMessage();
            }}
          />

          <button className="send" onClick={sendMessage}>Send</button>
        </div>

      </div>
    </>
  )

}

export default App;

