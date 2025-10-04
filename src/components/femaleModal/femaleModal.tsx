import React from "react";

interface FemaleModalProps {
    onClose: () => void;
}

const FemaleModal: React.FC<FemaleModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
            {/* Modal Container */}
            <div className="relative w-[95%] max-w-6xl gap-3 h-[80vh] flex  rounded-2xl overflow-hidden">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-white font-bold text-xl hover:text-red-300 z-50"
                >
                    ✕
                </button>

                {/* Left Section (Video Call) */}
                <div className="flex-1 relative bg-black rounded-2xl flex items-center justify-center">
                    {/* Main Participant Video */}
                    <img
                        src="./ai-female.png"
                        alt="Main Participant"
                        className="w-full h-full object-cover"
                    />

                    {/* Small Participant (Bottom-right overlay) */}
                    <div className="absolute bottom-6 right-6 w-40 h-28 rounded-lg overflow-hidden shadow-lg border border-white/20">
                        <img
                            src="./Rectangle 34.png"
                            alt="Small Participant"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Call Controls */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/30">
                        <button className="p-3 rounded-full bg-[#d3ffcd] text-white hover:bg-[#b2ffa5]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2.99939C11.0054 2.99939 10.0516 3.39448 9.34835 4.09774C8.64509 4.801 8.25 5.75483 8.25 6.74939V11.9994C8.25 12.994 8.64509 13.9478 9.34835 14.651C10.0516 15.3543 11.0054 15.7494 12 15.7494C12.9946 15.7494 13.9484 15.3543 14.6516 14.651C15.3549 13.9478 15.75 12.994 15.75 11.9994V6.74939C15.75 5.75483 15.3549 4.801 14.6516 4.09774C13.9484 3.39448 12.9946 2.99939 12 2.99939ZM6 11.2494C6.19891 11.2494 6.38968 11.3284 6.53033 11.4691C6.67098 11.6097 6.75 11.8005 6.75 11.9994C6.75 13.3918 7.30312 14.7271 8.28769 15.7117C9.27226 16.6963 10.6076 17.2494 12 17.2494C13.3924 17.2494 14.7277 16.6963 15.7123 15.7117C16.6969 14.7271 17.25 13.3918 17.25 11.9994C17.25 11.8005 17.329 11.6097 17.4697 11.4691C17.6103 11.3284 17.8011 11.2494 18 11.2494C18.1989 11.2494 18.3897 11.3284 18.5303 11.4691C18.671 11.6097 18.75 11.8005 18.75 11.9994C18.7503 13.66 18.1385 15.2624 17.0316 16.5002C15.9247 17.738 14.4003 18.5244 12.75 18.7089V20.2494C12.75 20.4483 12.671 20.6391 12.5303 20.7797C12.3897 20.9204 12.1989 20.9994 12 20.9994C11.8011 20.9994 11.6103 20.9204 11.4697 20.7797C11.329 20.6391 11.25 20.4483 11.25 20.2494V18.7089C9.59971 18.5244 8.07534 17.738 6.96841 16.5002C5.86149 15.2624 5.24968 13.66 5.25 11.9994C5.25 11.8005 5.32902 11.6097 5.46967 11.4691C5.61032 11.3284 5.80109 11.2494 6 11.2494Z" fill="#102D0B" />
                            </svg>
                        </button>
                        <button className="p-3 rounded-full bg-[#d3ffcd] text-white hover:bg-[#b2ffa5] ">
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="13" viewBox="0 0 17 13" fill="none">
                                <path d="M1.21875 12.9996C0.89375 12.9996 0.609375 12.8778 0.365625 12.634C0.121875 12.3903 0 12.1059 0 11.7809V1.21838C0 0.893384 0.121875 0.609009 0.365625 0.365259C0.609375 0.121509 0.89375 -0.000366211 1.21875 -0.000366211H11.7812C12.1062 -0.000366211 12.3906 0.121509 12.6344 0.365259C12.8781 0.609009 13 0.893384 13 1.21838V3.28747C13 4.13553 14.0253 4.56024 14.625 3.96057C15.2247 3.36091 16.25 3.78561 16.25 4.63367V8.3656C16.25 9.21365 15.2247 9.63836 14.625 9.0387C14.0253 8.43903 13 8.86374 13 9.71179V11.7809C13 12.1059 12.8781 12.3903 12.6344 12.634C12.3906 12.8778 12.1062 12.9996 11.7812 12.9996H1.21875Z" fill="#102D0B" />
                            </svg>
                        </button>
                        <button className="p-3 rounded-full bg-[#102d0b]  text-[#d2ffcd] hover:bg-[#b2ffa5]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="37" height="16" viewBox="0 0 37 16" fill="none">
                                <path d="M36.0192 10.6624L35.5842 12.5338C35.1755 14.2882 33.5215 15.4598 31.7199 15.2718L28.1313 14.8964C26.5692 14.7322 25.2847 13.5803 24.9564 12.0494L24.0448 7.78496C22.4306 7.08381 20.6311 6.75893 18.647 6.80886C16.7367 6.84114 14.8356 7.26617 13.0561 8.0588L12.1816 12.0436C11.8492 13.552 10.5805 14.6738 9.03601 14.8236L5.43562 15.1772C3.63812 15.3525 1.97945 14.176 1.55319 12.4247L1.09566 10.549C0.641195 8.68087 1.21663 6.71895 2.60771 5.40153C5.89186 2.2872 11.1932 0.745809 18.5151 0.771434C25.848 0.797496 31.169 2.38421 34.4717 5.52982C35.8617 6.85314 36.4515 8.8053 36.0192 10.6624Z" fill="#D4FFCD" />
                            </svg>
                        </button>
                        <button className="p-3 rounded-full bg-[#d3ffcd] text-white hover:bg-[#b2ffa5]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M12 3.74875C11.9998 3.60762 11.9598 3.46942 11.8846 3.35001C11.8093 3.23061 11.7019 3.13485 11.5747 3.07375C11.4475 3.01265 11.3056 2.98868 11.1654 3.0046C11.0252 3.02052 10.8923 3.07569 10.782 3.16375L7.2375 5.99875H3.75C3.55109 5.99875 3.36032 6.07777 3.21967 6.21842C3.07902 6.35907 3 6.54984 3 6.74875V12.7487C3 12.9477 3.07902 13.1384 3.21967 13.2791C3.36032 13.4197 3.55109 13.4987 3.75 13.4987H7.2375L10.782 16.3337C10.8923 16.4218 11.0252 16.477 11.1654 16.4929C11.3056 16.5088 11.4475 16.4848 11.5747 16.4237C11.7019 16.3626 11.8093 16.2669 11.8846 16.1475C11.9598 16.0281 11.9998 15.8899 12 15.7487V3.74875ZM16.5375 9.74875C16.5387 10.6353 16.3646 11.5134 16.0253 12.3325C15.686 13.1516 15.1882 13.8956 14.5605 14.5217L13.5 13.4612C13.9882 12.9742 14.3754 12.3956 14.6393 11.7584C14.9031 11.1213 15.0385 10.4383 15.0375 9.74875C15.0384 9.05917 14.903 8.37621 14.6391 7.73911C14.3753 7.102 13.9882 6.5233 13.5 6.03625L14.5605 4.97575C15.1882 5.60186 15.686 6.34585 16.0253 7.16496C16.3646 7.98407 16.5387 8.86215 16.5375 9.74875Z" fill="#102D0B" />
                            </svg>
                        </button>
                        <button className="p-3 rounded-full bg-[#d3ffcd] text-white hover:bg-[#b2ffa5]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M11.3753 18.333H8.62532C8.47255 18.333 8.33713 18.2844 8.21908 18.1872C8.10102 18.0899 8.0281 17.9649 8.00033 17.8122L7.66699 15.708C7.4031 15.6108 7.12532 15.4788 6.83366 15.3122C6.54199 15.1455 6.28505 14.9719 6.06283 14.7913L4.12533 15.6872C3.97255 15.7566 3.81977 15.767 3.66699 15.7184C3.51421 15.6698 3.39616 15.5691 3.31283 15.4163L1.93783 12.9788C1.85449 12.8399 1.83366 12.6941 1.87533 12.5413C1.91699 12.3885 2.00033 12.2635 2.12533 12.1663L3.91699 10.8538C3.88921 10.7288 3.87185 10.5865 3.86491 10.4267C3.85796 10.267 3.85449 10.1247 3.85449 9.99965C3.85449 9.87465 3.85796 9.73229 3.86491 9.57257C3.87185 9.41285 3.88921 9.27049 3.91699 9.14549L2.12533 7.83299C2.00033 7.73576 1.91699 7.61076 1.87533 7.45799C1.83366 7.30521 1.85449 7.15938 1.93783 7.02049L3.31283 4.58299C3.39616 4.43021 3.51421 4.32951 3.66699 4.2809C3.81977 4.23229 3.97255 4.24271 4.12533 4.31215L6.06283 5.20799C6.28505 5.02743 6.54199 4.85382 6.83366 4.68715C7.12532 4.52049 7.4031 4.39549 7.66699 4.31215L8.00033 2.18715C8.0281 2.03438 8.10102 1.90938 8.21908 1.81215C8.33713 1.71493 8.47255 1.66632 8.62532 1.66632H11.3753C11.5281 1.66632 11.6635 1.71493 11.7816 1.81215C11.8996 1.90938 11.9725 2.03438 12.0003 2.18715L12.3337 4.29132C12.5975 4.38854 12.8788 4.51702 13.1774 4.67674C13.476 4.83646 13.7295 5.01354 13.9378 5.20799L15.8753 4.31215C16.0281 4.24271 16.1809 4.23229 16.3337 4.2809C16.4864 4.32951 16.6045 4.43021 16.6878 4.58299L18.0628 6.99965C18.1462 7.13854 18.1705 7.28785 18.1357 7.44757C18.101 7.60729 18.0142 7.73576 17.8753 7.83299L16.0837 9.10382C16.1114 9.24271 16.1288 9.39201 16.1357 9.55174C16.1427 9.71146 16.1462 9.86077 16.1462 9.99965C16.1462 10.1385 16.1427 10.2844 16.1357 10.4372C16.1288 10.5899 16.1114 10.7358 16.0837 10.8747L17.8753 12.1663C18.0003 12.2635 18.0837 12.3885 18.1253 12.5413C18.167 12.6941 18.1462 12.8399 18.0628 12.9788L16.6878 15.4163C16.6045 15.5691 16.4864 15.6698 16.3337 15.7184C16.1809 15.767 16.0281 15.7566 15.8753 15.6872L13.9378 14.7913C13.7156 14.9719 13.4621 15.149 13.1774 15.3226C12.8927 15.4962 12.6114 15.6247 12.3337 15.708L12.0003 17.8122C11.9725 17.9649 11.8996 18.2844 11.7816 18.1872C11.6635 18.2844 11.5281 18.333 11.3753 18.333ZM10.0003 12.708C10.7503 12.708 11.3892 12.4441 11.917 11.9163C12.4448 11.3885 12.7087 10.7497 12.7087 9.99965C12.7087 9.24965 12.4448 8.61076 11.917 8.08299C11.3892 7.55521 10.7503 7.29132 10.0003 7.29132C9.25032 7.29132 8.61144 7.55521 8.08366 8.08299C7.55588 8.61076 7.29199 9.24965 7.29199 9.99965C7.29199 10.7497 7.55588 11.3885 8.08366 11.9163C8.61144 12.4441 9.25032 12.708 10.0003 12.708Z" fill="#102D0B" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Right Section (Transcript) */}
                <div className="w-80 bg-[#102d0b]/90 text-[#d3ffcd] rounded-2xl flex flex-col border-l border-white/20">
                    <h3 className="text-lg font-semibold p-4 border-b border-white/20">
                        Live Transcript
                    </h3>

                    <div className="flex-1 overflow-y-auto p-4 space-y-6 text-sm">
                        {/* User Message (Right aligned) */}
                        <div className="flex flex-col items-end gap-1">
                            <p className="text-xs text-white pr-8">You</p>
                            <div className="flex items-start gap-2">
                                <p className="bg-white text-[#102D0B] px-3 py-2 rounded-lg">
                                    Hey Lina, quick recap please.
                                </p>
                                <img src="./Rectangle 34.png" alt="You" className="w-6 h-6 rounded-full" />
                            </div>
                        </div>

                        {/* Lina Message (Left aligned) */}
                        <div className="flex flex-col items-start gap-1">
                            <p className="text-xs text-white pl-8">Avatar Lina</p>
                            <div className="flex items-start gap-2">
                                <img src="./ai-female.png" alt="Lina" className="w-6 h-6 rounded-full" />
                                <p className="bg-[#d4ffcd] text-[#102D0B] px-3 py-2 rounded-lg">
                                    Sure! Team discussed new project timeline.
                                </p>
                            </div>
                        </div>

                        {/* User Message */}
                        <div className="flex flex-col items-end gap-1">
                            <p className="text-xs text-white pr-8">You</p>
                            <div className="flex items-start gap-2">
                                <p className="bg-white text-[#102D0B] px-3 py-2 rounded-lg">
                                    What are the key deliverables?
                                </p>
                                <img src="./Rectangle 34.png" alt="You" className="w-6 h-6 rounded-full" />
                            </div>
                        </div>

                        {/* Lina Message */}
                        <div className="flex flex-col items-start gap-1">
                            <p className="text-xs text-white pl-8">Avatar Lina</p>
                            <div className="flex items-start gap-2">
                                <img src="./ai-female.png" alt="Lina" className="w-6 h-6 rounded-full" />
                                <p className="bg-[#d4ffcd] text-[#102D0B] px-3 py-2 rounded-lg">
                                    UI mockups and user research report.
                                </p>
                            </div>
                        </div>

                        {/* User Message */}
                        <div className="flex flex-col items-end gap-1">
                            <p className="text-xs text-white pr-8">You</p>
                            <div className="flex items-start gap-2">
                                <p className="bg-white text-[#102D0B] px-3 py-2 rounded-lg">
                                    Perfect, when's the deadline?
                                </p>
                                <img src="./Rectangle 34.png" alt="You" className="w-6 h-6 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FemaleModal;