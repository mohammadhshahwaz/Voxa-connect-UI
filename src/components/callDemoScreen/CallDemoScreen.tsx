// Updated CallDemoScreen.tsx
import { NavLink } from 'react-router'
import './callDemoScreen.css'
import { avatarsData } from '../../data/avatarsData'

const CallDemoScreen = () => {
  return (
    <div className='w-full min-h-screen bg-[var(--color-bg-light-sec)]'>
      {/* Banner Section */}
      <div className="p-6">
        <div className="banner-demo relative bg-[var(--color-primary-dark)] text-[var(--color-primary)] flex items-center justify-between p-10">
          {/* Text */}
          <div className="z-10 max-w-lg" style={{ textAlign: 'right', alignItems: 'end' }}>
            <h2 className="text-3xl font-bold mb-4">Choose Your AI Avatar</h2>
            <p className="text-lg text-[var(--text-white)]">
              Pick the AI persona avatar that fits your needs from a friendly guide to a business strategist.
            </p>
          </div>
        </div>
      </div>

      {/* Avatar Selection */}
      <div className="convo-sectin p-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-10">
          {avatarsData.map((avatar) => (
            <NavLink
              key={avatar.id}
              to={avatar.route}
              state={avatar.state}
              className="avatar-card bg-[var(--color-primary-dark)] rounded-xl shadow-lg flex flex-col items-center p-4 transition-transform hover:scale-105"
            >
              <img
                src={avatar.img}
                alt={avatar.name}
                className="object-cover mb-2"
              />
              <p className="font-semibold text-[var(--color-primary)] text-lg">
                {avatar.name}
              </p>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CallDemoScreen
