import React, { useRef, useState, useEffect } from "react";
import styles from "./App.module.css"; // Ensure the path is correct

import { getOpenAIResponse } from "../api";
import logo from "../assets/chatgpt.svg";
import add from "../assets/add-30.png";
import messageIcon from "../assets/message.svg";
import Home from "../assets/home.svg";
import Saved from "../assets/bookmark.svg";
import upgrade from "../assets/rocket.svg";
import send from "../assets/send.svg";
import user from "../assets/user-icon.png";
import GPT from "../assets/chatgptLogo.svg";
import down from "../assets/down.svg";
import Speak from "../assets/speaking-head-svgrepo-com.svg";
import Star from "../assets/stars-svgrepo-com.svg";
import image from "../assets/image-files-svgrepo-com.svg";
import { useNavigate } from "react-router-dom";

function App() {
  const msgEnd = useRef(null);
  const textareaRef = useRef(null);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loadingMessage, setLoadingMessage] = useState(""); // For streaming responses
  const [drop, setDrop] = useState(false);

  useEffect(() => {
    msgEnd.current.scrollIntoView();
  }, [messages, loadingMessage]);

  useEffect(() => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [input]);

  const navigate = useNavigate();
  const nextPage = () => {
    navigate("/voicePrompt");
  };
  const imageGenerator = () => {
    navigate("/imageGenerator");
  };

  const handleSend = async () => {
    if (input.trim() === "") return;
    setInput("");
    // Add user message
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: input },
    ]);

    try {
      const responseAI = await getOpenAIResponse(input);

      if (
        typeof responseAI === "object" &&
        responseAI.choices &&
        responseAI.choices.length > 0
      ) {
        const aiResponse = responseAI.choices[0].message.content;

        // Stream AI response line by line
        simulateStreamingResponse(aiResponse);
      } else if (typeof responseAI === "string") {
        simulateStreamingResponse(responseAI);
      } else {
        handleError();
      }
    } catch (error) {
      handleError();
    }

    setInput("");
  };

  // Simulate streaming the AI response progressively
  const simulateStreamingResponse = (fullResponse) => {
    const chunks = fullResponse.split(" "); // Break response by words
    let currentMessage = "";

    chunks.forEach((chunk, index) => {
      setTimeout(() => {
        currentMessage += chunk + " ";
        setLoadingMessage(currentMessage);

        if (index === chunks.length - 1) {
          // Once the full message is received
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "bot", text: currentMessage.trim() },
          ]);
          setLoadingMessage(""); // Reset
        }
      }, index * 100); // Adjust delay as needed (100ms in this example)
    });
  };

  const handleError = () => {
    const errorMessage =
      "An error occurred while communicating with OpenAI. Please try again later.";
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "bot", text: errorMessage },
    ]);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleToggle = () => {
    setDrop((prevState) => !prevState);
  };

  return (
    <div className={styles.chatPage}>
      <div className={styles.app}>
        <div className={styles.sidebar}>
          <div className={styles.upperpart}>
            <div className={styles.uppersideTop}>
              <img src={logo} alt="Logo" className={styles.logo} />
              <span className={styles.brand}>AI Assistant</span>
            </div>
            <button className={styles.midBtn} onClick={nextPage}>
              Voice Prompt
            </button>
            <button className={styles.midBtn} onClick={imageGenerator}>
              Image Generator
            </button>
          </div>
          <div className={styles.lowerpart}>
            <div className={styles.listItem}>
              <img src={Home} alt="Home" className={styles.listItemImg} />
              <span>Home</span>
            </div>
            <div className={styles.listItem}>
              <img src={Saved} alt="Saved" className={styles.listItemImg} />
              <span>Saved</span>
            </div>
            <div className={styles.listItem}>
              <img src={upgrade} alt="Upgrade" className={styles.listItemImg} />
              <span>Upgrade</span>
            </div>
          </div>
        </div>
        <div className={styles.main}>
          <div className={styles.uppersideTop1}>
            <img src={logo} alt="Logo" className={styles.logo1} />
            <span className={styles.brand1}>AI Assistant</span>
          </div>
          <div className={styles.smallScreen} onClick={handleToggle}>
            <div className={styles.smallScreenItems}>
              <button>GPT</button>
              <img src={down} alt="down-symbol" />
            </div>
          </div>
          {drop && (
            <div className={`${styles.navigators} ${drop ? styles.show : ""}`}>
              <div className={styles.navigator}>
                <img src={Speak} alt="" />
                <div className={styles.span}>
                  <span>AI Assistant</span>
                  <span>Our Smartest model and Answers</span>
                </div>
              </div>
              <div className={styles.navigator}>
                <img src={Star} alt="" className={styles.image} />
                <div className={styles.span} onClick={imageGenerator}>
                  <span>Image Generator</span>
                  <span>Great Experience of AI Image Models</span>
                </div>
              </div>
              <div className={styles.navigator} onClick={nextPage}>
                <img src={image} alt="" />
                <div className={styles.span}>
                  <span>Voice Prompter</span>
                  <span>Experience the Innovative AI Assistant</span>
                </div>
              </div>
            </div>
          )}

          <div className={styles.messages}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${styles.chat} ${styles[msg.sender]}`}
              >
                <img
                  className={styles.chatImg}
                  src={msg.sender === "user" ? user : GPT}
                  alt={msg.sender}
                />
                <p className={styles.txt}>{msg.text}</p>
              </div>
            ))}

            {/* Show progressively loaded message */}
            {loadingMessage && (
              <div className={`${styles.chat} ${styles["bot"]}`}>
                <img className={styles.chatImg} src={GPT} alt="bot" />
                <p className={styles.txt}>{loadingMessage}</p>
              </div>
            )}

            <div ref={msgEnd} />
          </div>
          <div className={styles.footer}>
            <div className={styles.inp}>
              <textarea
                placeholder="Type a message"
                className={styles.inpInput}
                value={input}
                ref={textareaRef}
                onKeyDown={handleEnter}
                onChange={(e) => setInput(e.target.value)}
              />
              <button className={styles.send} onClick={handleSend}>
                <img src={send} alt="Send" />
              </button>
            </div>
            <p className={styles.warning}>
              ChatGPT can make mistakes. Version 2.4 developed by Amal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
