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
    <div className="w-full min-h-screen bg-[var(--color-bg-light-sec)] text-[var(--color-neutral-dark)]">
      {/* Banner Section */}
      <div className="p-6">
        <div className="banner-demo relative bg-[var(--color-primary-dark)] text-[var(--text-dark-hover)] flex items-center justify-between p-10 rounded-2xl shadow-md">
          <div className="z-10 max-w-lg text-right" style={{ alignItems: "end" }}>
            <h2 className="text-3xl font-bold mb-4 text-[var(--color-primary)]">
              Choose your Connect
            </h2>
            <p className="text-lg text-[var(--text-white)]">
              Switch between video call or text chat — whatever suits you.
            </p>
          </div>
        </div>
      </div>

      {/* Avatar Selection */}
      <div className="convo-section p-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-10">
          {conversationModes.map((mode) => (
            <div
              key={mode.id}
              className="avatar-card bg-[var(--color-primary-dark)] rounded-xl shadow-lg flex flex-col items-center transition"
            >
              <img src={mode.img} alt={mode.name} className="object-cover mb-4" />
              <p className="font-semibold text-[var(--color-primary)] text-lg">
                {mode.type === "button" ? (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 rounded-lg  text-[var(--color-primary)] hover:text-[var(--text-dark-hover)] transition"
                  >
                    {mode.name}
                  </button>
                ) : (
                  <NavLink
                    to={mode.route || "/"}
                    state={{ selectedAvatar }}
                    className="px-4 py-2 rounded-lg  text-[var(--color-primary)] hover:text-[var(--text-dark-hover)] transition"
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
