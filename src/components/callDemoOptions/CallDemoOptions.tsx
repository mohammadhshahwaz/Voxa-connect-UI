import { useState } from "react"
import { NavLink, useLocation } from "react-router"
import MaleModal from "../maleModal/MaleModal"
import FemaleModal from "../femaleModal/femaleModal"
import { conversationModes } from "../../data/conversationModes" 

const CallDemoOptions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const location = useLocation()
  const selectedAvatar = location.state?.selectedAvatar || "male"

  const isFemale = selectedAvatar === "female"

  return (
    <div className="w-full min-h-screen bg-[#f2fcea]">
      {/* Banner Section */}
      <div className="p-6">
        <div className="banner-demo relative bg-[#102D0B] text-[#d3ffcd] flex items-center justify-between p-10">
          <div
            className="z-10 max-w-lg text-right"
            style={{ alignItems: "end" }}
          >
            <h2 className="text-3xl font-bold mb-4">Choose your Connect</h2>
            <p className="text-lg text-white">
              Switch between video call or text chat whatever suits you.
            </p>
          </div>
        </div>
      </div>

      {/* Avatar Selection */}
      <div className="convo-sectin p-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-10">
          {conversationModes.map((mode) => (
            <div
              key={mode.id}
              className="avatar-card bg-[#102d0b] rounded-xl shadow-lg flex flex-col items-center"
            >
              <img
                src={mode.img}
                alt={mode.name}
                className="object-cover mb-4"
              />
              <p className="font-semibold text-[#d3ffcd] text-lg">
                {mode.type === "button" ? (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 rounded-lg"
                  >
                    {mode.name}
                  </button>
                ) : (
                  <NavLink
                    to={mode.route || "/"}
                    state={{ selectedAvatar }}
                    className="px-4 py-2 rounded-lg"
                  >
                    {mode.name}
                  </NavLink>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen &&
        (isFemale ? (
          <FemaleModal onClose={() => setIsModalOpen(false)} />
        ) : (
          <MaleModal onClose={() => setIsModalOpen(false)} />
        ))}
    </div>
  )
}

export default CallDemoOptions
