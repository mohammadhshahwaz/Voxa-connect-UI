import { Link } from "react-router"
import "./Home.css"
import { conversationSteps } from "../../data/conversationSteps" // adjust path as needed

const Home = () => {
  return (
    <div className="w-full min-h-screen">
      {/* Banner Section */}
      <div className="logo p-6">
        <div className="banner p-6 bg-[#102D0B] text-[#d4ffcd]">
          <div className="first-sect">
            <div className="left-img">
              <img src="./banner-img-6.png" alt="" />
            </div>
            <div className="first-section-content">
              <div className="f-section-heading">
                <h1 className="text-4xl">Speak. Connect. Create.</h1>
              </div>
              <div className="f-section-para">
                <p>
                  Turn every voice into action with <span className="text-[#d4ffcd]"> VoxaConnect</span> <br />
                  your AI-powered conversational application.
                </p>
              </div>
            </div>
            <div className="right-img">
              <img src="./banner-img-1.png" alt="" />
            </div>
          </div>

          <div className="second-section">
            <div className="sec-left-img">
              <img src="/banner-img-7.png" alt="" />
              <img src="./banner-img-3.png" alt="" />
            </div>
            <div className="btn">
              <button
                type="button"
                className="bg-[#d3ffcd] text-[#102d0b] text-2xl rounded-full px-5 p-2.5 m-2 font-bold"
              >
                <Link to="/calldemo">Start a Demo</Link>
              </button>
            </div>
            <div className="sec-right-img">
              <img src="./banner-img-2.png" alt="" />
              <img src="./banner-img-5.png" alt="" />
            </div>
          </div>
        </div>
      </div>

      {/* Conversation Section */}
      <div className="convo-section">
        <h1 className="text-[#102d0b] text-3xl font-semibold text-center p-1">
          How to Start a Conversation with VoxaConnect
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          {conversationSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl flex flex-col items-center"
            >
              <div className="text-4xl mb-4">
                <img src={step.img} className="h-16" alt={step.title} />
              </div>
              <div className={`conv-card-1 ${step.cardClass || ""}`}>
                <h2>{step.step}</h2>
                <p className="conv-para-sub-head">{step.title}</p>
                <p className="conv-para-sub-para">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
