import "./login.css"


const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-screen  text-green-600 login--">
      <div className="w-full max-w-md bg-white login-form rounded-2xl shadow-lg p-8">
        {/* Title */}
        <h2 className="text-3xl greeting font-bold text-center mb-6">
          Welcome to Login
        </h2>

        {/* Login Form */}
        <form className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
          
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full login-button  py-2 rounded-lg font-bold text-xl transition"
          >
            Login
          </button>
        </form>

      
      </div>
    </div>
  );
};

export default Login;
