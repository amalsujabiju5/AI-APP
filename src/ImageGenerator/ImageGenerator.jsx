import styles from "./ImageGenerator.module.css";

import logo from "../assets/chatgpt.svg";
import messageIcon from "../assets/message.svg";
import Home from "../assets/home.svg";
import Saved from "../assets/bookmark.svg";
import upgrade from "../assets/rocket.svg";
import send from "../assets/send.svg";
import user from "../assets/user-icon.png";
import React, { useEffect, useRef, useState } from "react";
import down from "../assets/down.svg";
import Speak from "../assets/speaking-head-svgrepo-com.svg";
import Star from "../assets/stars-svgrepo-com.svg";
import image from "../assets/image-files-svgrepo-com.svg";
import { useNavigate } from "react-router-dom";

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const ImageGenerator = () => {
  const msgEnd = useRef(null);
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [drop, setDrop] = useState(false);

  const sendMessage = async () => {
    const newChatEntry = {
      userMessage: input,
      botResponse: "",
      error: null,
    };

    setChatHistory([...chatHistory, newChatEntry]);
    setInput("");

    try {
      const response = await fetch(
        "https://api.openai.com/v1/images/generations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            prompt: input,
            n: 1,
            size: "512x512",
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error Response:", errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response Data:", data);

      setChatHistory((prevHistory) =>
        prevHistory.map((chat) =>
          chat.userMessage === input
            ? {
                ...chat,
                botResponse: data.data[0]?.url || "Error: No image found.",
              }
            : chat
        )
      );
    } catch (error) {
      console.error("Sorry, I can't generate that image:", error);
      setChatHistory((prevHistory) =>
        prevHistory.map((chat) =>
          chat.userMessage === input
            ? { ...chat, error: "Sorry, I can't generate that image." }
            : chat
        )
      );
    }
  };

  useEffect(() => {
    if (msgEnd.current) {
      msgEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const handleEnter = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const navigate = useNavigate();
  const nextPage = () => {
    navigate("/voicePrompt");
  };
  const textgenerator = () => {
    navigate("/");
  };

  const handleToggle = () => {
    setDrop((prevState) => !prevState);
  };

  return (
    <div className={styles.app}>
      <div className={styles.sidebar}>
        <div className={styles.upperpart}>
          <div className={styles.uppersideTop}>
            <img src={logo} alt="logo" className={styles.logo} />
            <span className={styles.brand}>ImageGenerator</span>
          </div>
          <button className={styles.midBtn} onClick={nextPage}>
            Voice Prompter
          </button>
          <button className={styles.midBtn} onClick={textgenerator}>
            Text Generator
          </button>
        </div>
        <div className={styles.lowerpart}>
          <div className={styles.listItem}>
            <img src={Home} alt="Home" className={styles.listItemImg} />
            Home
          </div>
          <div className={styles.listItem}>
            <img src={Saved} alt="Saved" className={styles.listItemImg} />
            Saved
          </div>
          <div className={styles.listItem}>
            <img src={upgrade} alt="Upgrade" className={styles.listItemImg} />
            Upgrade
          </div>
        </div>
      </div>
      <div className={styles.main}>
        <div className={styles.smallScreen} onClick={handleToggle}>
          <div className={styles.smallScreenItems}>
            <button>GPT</button>
            <img src={down} alt="down-symbol" />
          </div>
          <div className={styles.uppersideTop1}>
            <img src={logo} alt="Logo" className={styles.logo1} />
            <span className={styles.brand1}>Image Generator</span>
          </div>{" "}
        </div>
        {drop && (
          <div className={`${styles.navigators} ${styles.show}`}>
            <div className={styles.navigator}>
              <img src={Speak} alt="AI Assistant" />
              <div className={styles.span} onClick={nextPage}>
                <span>Voice prompt</span>

                <span>Experience the Innovative AI Assistant</span>
              </div>
            </div>
            <div className={styles.navigator}>
              <img src={Star} alt="Image Generator" className={styles.image} />

              <div className={styles.span} onClick={textgenerator}>
                <span>Ai Assistant</span>
                <span>Our Smartest model and Answers</span>
              </div>
            </div>
            <div className={styles.navigator}>
              <img src={image} alt="Voice Prompter" />
              <div className={styles.span}>
                <span>Image Generator</span>
                <span>Great Experience of AI Image Models</span>
              </div>
            </div>
          </div>
        )}
        <div className={styles.messages}>
          {chatHistory.map((chat, index) => (
            <div key={index}>
              <div className={`${styles.chat} ${styles.user}`}>
                <img className={styles.chatImg} src={user} alt="user" />
                <p className={styles.txt}>{chat.userMessage}</p>
              </div>
              {chat.botResponse && (
                <div className={`${styles.chat} ${styles.AI}`}>
                  <img
                    className={styles.AI}
                    src={chat.botResponse}
                    alt="AI Response"
                  />
                </div>
              )}
              {chat.error && (
                <div className={styles.showError}>
                  <p>{chat.error}</p>
                </div>
              )}
            </div>
          ))}
          <div ref={msgEnd} />
        </div>
        <div className={styles.footer}>
          <div className={styles.inp}>
            <textarea
              placeholder="Type your message..."
              className={styles.inpInput}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleEnter}
            ></textarea>
            <button className={styles.send} onClick={sendMessage}>
              <img src={send} alt="send" />
            </button>
          </div>
          <p className={styles.warning}>
            ChatGPT can make mistakes. Version 2.4 developed by Amal.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
