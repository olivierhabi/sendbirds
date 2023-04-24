import React, { useState, useEffect } from "react";

const LoginForm = ({ userId, setUserId }) => {
  const connect = (e, status) => {
    e.preventDefault();
    setUserId(e.target.userId.value);
  };

  return (
    <>
      <form onSubmit={connect}>
        <div className="bg-gray-100 rounded-md px-[50px] py-[60px] flex flex-col space-y-4 w-[400px]">
          <div className="font-bold text-[18px]">Connect to Sendbird Calls</div>
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
                  type="text"
                  id="userId"
                  name="userId"
                  autoComplete="username"
                  className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="User ID"
                  required
                />
              </div>
            </div>
          </div>
          <div className="sm:col-span-4">
            <div className="mt-2">
              <div className="flex bg-yellow-500 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                <button
                  type="submit"
                  className="rounded-md w-full bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Connect
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default LoginForm;
