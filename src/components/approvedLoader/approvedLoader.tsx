const ApprovedLoader = () => {
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#E4E5FF]/90 rounded-xl z-20">
            <img
                src="./Default.png"
                alt="approval-loader"
                className="w-24 h-24 object-contain "
            />
            <p className="text-black font-medium">Waiting for Approval</p>
        </div>
    )
}

export default ApprovedLoader;
