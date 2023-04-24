import React, { useState, useEffect } from "react";

const DialForm = ({ makeCall }) => {
  const [userIdError, setUserIdError] = useState(undefined);
  const [userId, setUserId] = useState("");

  const videoCall = () => {
    setUserIdError("");
    if (!userId) {
      return setUserIdError("Please input a userId");
    }
    makeCall({ userId, isVideoCall: true });
  };

  const audioCall = () => {
    setUserIdError("");
    if (!userId) {
      return setUserIdError("Please input a userId");
    }
    makeCall({ userId, isVideoCall: false });
  };

  return (
    <div>
      <>
        <div className="bg-gray-100 rounded-md px-[50px] py-[60px] flex flex-col space-y-4 w-[400px]">
          <div className="font-bold text-[18px]">Make a call</div>
          <div className="sm:col-span-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              User ID
            </label>
            <div className="mt-2">
              <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                <input
                  value={userId}
                  onChange={(e) => {
                    e.preventDefault();
                    setUserIdError("");
                    const value = e.target.value;
                    const strippedValue = value.replace(/\s+/g, "");
                    setUserId(strippedValue);
                  }}
                  type="text"
                  id="userId"
                  name="userId"
                  autoComplete="username"
                  className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="User ID"
                  required
                />
              </div>
              <div className="text-red-400 text-[12px] pt-2">
                {userIdError && <div>{userIdError}</div>}
              </div>
            </div>
          </div>
          <div className="sm:col-span-4 flex justify-center pt-[100px]">
            <div className="mt-2 flex space-x-4">
              <button
                onClick={() => videoCall()}
                className="bg-red-400 w-[50px] h-[50px] flex justify-center items-center rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-white"
                >
                  <path
                    strokeLinecap="round"
                    d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
              </button>
              <button
                onClick={() => audioCall()}
                className="bg-green-400 w-[50px] h-[50px] flex justify-center items-center rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default DialForm;
