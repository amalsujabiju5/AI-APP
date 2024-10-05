import "regenerator-runtime/runtime";
import React, { useEffect, useRef, useState } from "react";
import "./voicePrompt.css";
import logo from "../assets/chatgpt.svg";
import add from "../assets/add-30.png";
import messageIcon from "../assets/message.svg";
import Home from "../assets/home.svg";
import Saved from "../assets/bookmark.svg";
import upgrade from "../assets/rocket.svg";
import send from "../assets/send.svg";
import user from "../assets/user-icon.png";
import GPT from "../assets/chatgptLogo.svg";
import mic from "../assets/microphone-broadcast-svgrepo-com.svg";
import down from "../assets/down.svg";
import Speak from "../assets/speaking-head-svgrepo-com.svg";
import Star from "../assets/stars-svgrepo-com.svg";
import image from "../assets/image-files-svgrepo-com.svg";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useNavigate } from "react-router-dom";

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

function VoicePrompt() {
  const msgEnd = useRef(null);
  const textareaRef = useRef(null);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [userInput, setUserInput] = useState(""); // State to manage user input
  const [chatHistory, setChatHistory] = useState([]); // State to store chat history
  const [thinking, setThinking] = useState(false); // State to show loading
  const [selectedVoice, setSelectedVoice] = useState(null); // State to manage selected voice
  const [drop, setDrop] = useState(false);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const getOpenAIResponse = async (message) => {
    try {
      setThinking(true);
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: message }],
            max_tokens: 2000,
            temperature: 0.7,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
          }),
        }
      );
      const data = await response.json();
      setThinking(false);
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error fetching data from OpenAI API:", error);
      setThinking(false);
      return "An error occurred while fetching the response.";
    }
  };

  useEffect(() => {
    if (listening && transcript) {
      setUserInput(transcript); // Update userInput with the transcript
    }
  }, [transcript, listening]);

  const handleSend = async (message) => {
    if (!message.trim()) return; // Do nothing if the message is empty
    const response = await getOpenAIResponse(message);
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { role: "user", content: message },
      { role: "bot", content: response },
    ]);
    setUserInput(""); // Clear the user input after sending
    resetTranscript(); // Clear the transcript after sending the message
    speakResponse(response);
  };

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      console.log("Available voices:", voices); // Log available voices

      if (voices.length !== 0) {
        // Look for a female voice by name
        const femaleVoice = voices.find(
          (voice) =>
            voice.name.toLowerCase().includes("female") ||
            voice.name.toLowerCase().includes("en-gb") // Adjust based on voice names
        );
        setSelectedVoice(femaleVoice || voices[0]);
        console.log("Selected voice:", femaleVoice || voices[0]); // Log selected voice
      }
    };

    // Ensure voices are loaded
    loadVoices();

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const speakResponse = (text) => {
    const speechSynthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    //use this other wise the chrome wont support this
    window.speechSynthesis.cancel();
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      console.log("Using voice:", selectedVoice.name); // Log the voice being used
    } else {
      console.warn("Voice not selected or unavailable");
    }

    utterance.onend = () => {
      setUserInput(""); // Clear the user input after speech synthesis is done
    };
    speechSynthesis.speak(utterance);
  };

  const handleSpeechRecognition = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: false });
    }
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    if (!e.target.value.trim()) {
      resetTranscript();
    }
  };

  useEffect(() => {
    msgEnd.current.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  useEffect(() => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [userInput, chatHistory]);

  const navigate = useNavigate();
  const nextPage = () => {
    navigate("/");
  };

  const ImageGenerator = () => {
    navigate("/imageGenerator");
  };
  const Voice = () => {
    navigate("/voicePrompt");
  };
  const textgenerator = () => {
    navigate("/textgenerator"); // Make sure the route /textgenerator exists in your app's routing setup
  };

  const handleToggle = () => {
    setDrop((prevState) => !prevState);
  };
  return (
    <div className="app">
      <div className="sidebar">
        <div className="upperpart">
          <div className="uppersideTop">
            <img src={logo} alt="logo" className="logo" />
            <span className="brand">voicePrompt</span>
          </div>

          <button className="midBtn" onClick={nextPage}>
            Text Generator
          </button>
          <button className="midBtn" onClick={ImageGenerator}>
            Image Generator
          </button>
        </div>
        <div className="lowerpart">
          <div className="listItem">
            <img src={Home} alt="" className="listItemImg" />
            Home
          </div>
          <div className="listItem">
            <img src={Saved} alt="" className="listItemImg" />
            Saved
          </div>
          <div className="listItem">
            <img src={upgrade} alt="amal" className="listItemImg" />
            Upgrade
          </div>
        </div>
      </div>
      <div className="main">
        <div className="smallScreen" onClick={handleToggle}>
          <div className="smallScreenItems">
            <button>GPT</button>
            <img src={down} alt="down-symbol" />
          </div>
          <div className="uppersideTop1">
            <img src={logo} alt="Logo" className="logo1" />
            <span className="brand1">Voice Generator</span>
          </div>{" "}
        </div>
        {drop && (
          <div className={`navigators ${drop ? "show" : ""}`}>
            <div className="navigator" onClick={Voice}>
              <img src={Speak} alt="AI Assistant" />
              <div className="span">
                <span>Voice prompt</span>
                <span>Experience the Innovative AI Assistant</span>
              </div>
            </div>
            <div className="navigator" onClick={nextPage}>
              <img src={Star} alt="Image Generator" className="image" />
              <div className="span">
                <span>AI Assistant</span>
                <span>Our Smartest model and Answers</span>
              </div>
            </div>

            <div className="navigator" onClick={ImageGenerator}>
              <img src={image} alt="Voice Prompter" />
              <div className="span">
                <span>Image Generator</span>
                <span>Great Experience of AI Image Models</span>
              </div>
            </div>
          </div>
        )}
        <div className="messages">
          {chatHistory.map((message, index) => (
            <div key={index} className={`chat ${message.role}`}>
              <img
                className="chatImg"
                src={message.role === "user" ? user : GPT}
                alt={message.role}
              />
              <p className="txt">{message.content}</p>
            </div>
          ))}
          <div ref={msgEnd} />
        </div>
        <div className="footer">
          <div className="inp">
            <textarea
              placeholder="Type or speak your message..."
              className="inpInput"
              value={userInput}
              ref={textareaRef}
              onChange={handleInputChange}
            />
            {userInput.trim() ? (
              <button className="send" onClick={() => handleSend(userInput)}>
                <img src={send} alt="send" />
              </button>
            ) : (
              <button className="send" onClick={handleSpeechRecognition}>
                <img
                  className={`mic ${listening ? "play" : ""}`}
                  src={mic}
                  alt="mic"
                />
              </button>
            )}
          </div>

          <p className="warning">
            ChatGPT can make mistakes. Version 2.4 developed by Amal.
          </p>
        </div>
      </div>
    </div>
  );
}

export default VoicePrompt;
