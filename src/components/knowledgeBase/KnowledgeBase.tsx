import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './knowledgeBase.css'
import { faCloudArrowUp, faTimes } from "@fortawesome/free-solid-svg-icons";
import ApprovedLoader from "../approvedLoader/approvedLoader";
import { useRef } from "react";

const KnowledgeBase = () => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            console.log("Selected files:", files);
           
        }
    };

    return (
        <div className=' w-full min-h-screen '>
            <div className="logo p-6">
                <div className="banner- py-6 pb-3 bg-[#102D0B]  text-[#d3ffcd]">
                    <div className="img-carausel">
                        <img src="./banner-img-1.png" alt="" />
                        <img src="./banner-img-2.png" alt="" />
                        <img src="./banner-img-3.png" alt="" />
                        <img src="./banner-img-4.png" alt="" />
                        <img src="./banner-img-5.png" alt="" />
                        <img src="./banner-img-6.png" alt="" />
                        <img src="./banner-img-7.png" alt="" />
                    </div>
                    <div className="content-section-kn">
                        <h2 className='content-section-heading'>Enhance AI with Your Documents</h2>
                        <p className='content-section-para'>
                            Upload PDFs, Word files, or text docs to expand Voxa Connect’s knowledge.
                            Your AI learns instantly and answers with greater accuracy.
                        </p>
                        <div className="btn-4">
                            <button className='btnn' type='button' onClick={handleButtonClick}>
                                <FontAwesomeIcon icon={faCloudArrowUp} /> Upload a Documents
                            </button>
                            {/* Hidden file input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileChange}
                                multiple
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* files section */}
            <div className="convo-section p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                    {/* File Card - Waiting for Approval */}
                    <div className="file-card relative bg-[#D4FFCD] p-4 rounded-xl shadow">
                        <ApprovedLoader />
                        {/* icon */}
                        <FontAwesomeIcon
                            icon={faTimes}
                            className="absolute top-3 right-3 cursor-pointer text-gray-700"
                        />
                        <div className=" file-content flex flex-col items-center">
                            <img src="./pdf.png" alt="pdf-file" />
                            <p className="font-semibold">Company_Product_Overview.pdf</p>
                            <p className="text-gray-500 text-sm">Sep 8, 2025</p>
                        </div>
                    </div>

                    {/* File Card - Pricing Guide */}
                    <div className="file-card relative bg-[#D4FFCD] p-4 rounded-xl shadow">
                        {/* icon */}
                        <FontAwesomeIcon
                            icon={faTimes}
                            className="absolute top-3 right-3 cursor-pointer text-gray-700"
                        />

                        <div className="file-content flex flex-col items-center">
                            <img src="./file.png" alt="pdf-file" />
                            <p className="font-semibold">Pricing_Guide_2025.docx</p>
                            <p className="text-gray-500 text-sm">Sep 21, 2025</p>
                        </div>
                    </div>

                    {/* File Card - Product Overview */}
                    <div className="file-card relative bg-[#D4FFCD] p-4 rounded-xl shadow">
                        {/* icon */}
                        <FontAwesomeIcon
                            icon={faTimes}
                            className="absolute top-3 right-3 cursor-pointer text-gray-700"
                        />
                        <div className=" file-content flex flex-col items-center">
                            <img src="./file.png" alt="pdf-file" />
                            <p className="font-semibold">Company_Product_Overview.pdf</p>
                            <p className="text-gray-500 text-sm">Sep 15, 2025</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default KnowledgeBase
