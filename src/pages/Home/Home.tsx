import './Home.css'

const Home = () => {
    return (
        <div className=' w-full min-h-screen '>
            <div className="logo p-6">
                <div className="banner p-6  bg-[#102D0B]  text-[#d3ffcd]">
                    <div className="first-sect">
                        <div className="left-img">
                            <img src="./banner-img-6.png" alt="" />
                        </div>
                        <div className="first-section-content">
                            <div className=" f-section-heading">
                                <h1 className='text-4xl'>Speak. Connect. Create.</h1>
                            </div>
                            <div className="f-section-para">
                                <p>Turn every voice into action with VoxaConnect <br /> your AI-powered conversational application.</p>
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
                            <button type='button' className='bg-[#d3ffcd] text-[#102d0b] text-2xl rounded-full  px-5 p-2.5 m-2 font-bold'>Start a Demo</button>
                        </div>
                        <div className="sec-right-img">
                            <img src="./banner-img-2.png" alt="" />
                            <img src="./banner-img-5.png" alt="" />
                        </div>
                    </div>
                </div>
            </div>
            {/* conversation section */}
            <div className="convo-section">
                {/* heading */}
                <h1 className='text-[#102d0b] text-3xl font-bold text-center p-1'>How to Start a Conversation with VoxaConnect</h1>
                {/* content-card section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                    {/* Step 1 */}
                    <div className="p-6  rounded-xl  flex flex-col items-center">
                        <div className="text-4xl mb-4">
                            <img src="/Group 4526-2.svg" className="h-16" alt="" />
                        </div>
                        <div className="conv-card-1 arc-1">
                            <h2 className="">Step 1</h2>
                            <p className="conv-para-sub-head">Start Demo</p>
                            <p className="conv-para-sub-para">
                                Begin right from the home screen with a single click.
                            </p>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="p-6  rounded-xl  flex flex-col items-center">
                        <div className="text-4xl mb-4">
                            <img src="/Group 4526-1.svg" className="h-16" alt="" />
                        </div>
                        <div className="conv-card-1 arc-2">
                            <h2 className="">Step 2</h2>
                            <p className="conv-para-sub-head">Choose Your AI Avatar</p>
                            <p className="conv-para-sub-para">
                                Select the AI persona avatar you'd like to interact with.
                            </p>
                        </div>

                    </div>

                    {/* Step 3 */}
                    <div className="p-6  rounded-xl  flex flex-col items-center">
                        <div className="text-4xl mb-4">
                            <img src="/Group 4526.svg" className="h-16" alt="" />
                        </div>
                        <div className="conv-card-1 arc-3">
                            <h2 className="">Step 3</h2>
                            <p className="conv-para-sub-head">Pick Conversation Type</p>
                            <p className="conv-para-sub-para">
                                Pick between video call or text chat – whatever suits you.
                            </p>
                        </div>

                    </div>

                    {/* Step 4 */}
                    <div className="p-6  rounded-xl  flex flex-col items-center">
                        <div className="text-4xl mb-4">
                            <img src="/Group 4526-3.svg" className="h-16" alt="" />
                        </div>
                        <div className="conv-card-1">
                            <h2 className="">Step 4</h2>
                            <p className="conv-para-sub-head">Start Conversing</p>
                            <p className="conv-para-sub-para">
                                Engage in a natural, real-time conversation with VoxaConnect.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    )
}

export default Home

