import "./App.css";
import { useRef, useState, useEffect } from "react";
import { chain } from "./utils/chains";
import { useChatStore } from "./hooks/useChatStore.jsx";
import Message from "./components/message/Message";
import Loading from "./components/loading/Loading.jsx";

function App() {
  const inputRef = useRef();
  const { messages, addMessage, setMessages, clearMessages } = useChatStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("chat-storage");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.state?.messages) {
          setMessages(parsed.state.messages);
        }
      } catch (error) {
        console.error("Kunde inte läsa chat-historik:", error);
      }
    }
  }, [setMessages]);

  async function getAnswer(event) {
    event.preventDefault();

    if (event.type === "click" || event.key === "Enter") {
      const question = inputRef.current.value;
      inputRef.current.value = "";


      addMessage({ role: "user", content: question });

      setLoading(true);

      const chatHistory = messages
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join("\n");

      const answer = await chain.invoke({
        question,
        chatHistory
      });

      addMessage({ role: "assistant", content: answer });

      setLoading(false);

    }
  }

  const messageComponents = messages.map((message, index) => {
    return (
      <Message content={message.content} role={message.role} key={index} />
    );
  });

  const clearChat = () => {
    clearMessages();
  };

  return (
    <main className="chat">
      <button className="delete__btn" onClick={clearChat}>Radera</button>
      <section className="chat__messages">
        {messageComponents}
        {loading && <Loading />}
      </section>
      <form className="chat__form">
        <input type="text"
          ref={inputRef} />
        <button className="send__btn" onClick={getAnswer} onKeyUp={getAnswer}>
          Fråga
        </button>
      </form>
    </main>
  );
}

export default App;
