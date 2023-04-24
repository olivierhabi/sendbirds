import SendBirdCall from "sendbird-calls";
import React, { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import DialForm from "./DialForm";
import IncomingCallModal from "./IncomingCallModal";

const Call = () => {
  const [userId, setUserId] = useState("");
  const [call, setCall] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [ringing, setRinging] = useState(false);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [muted, setMuted] = useState(false);
  const [mutedVideo, setMutedAudio] = useState(false);

  useEffect(() => {
    if (userId) {
      initSendbirdCalls();
    }
  }, [userId]);

  const addEventHandler = () => {
    SendBirdCall.addListener(`CALLS_HANDLER_${userId}`, {
      onRinging: (call) => {
        console.log("Receiving call");
        call = setDefaultCallHandlers(call);
        setRinging(true);
        setCall(call);
      },
    });
  };

  const initSendbirdCalls = async () => {
    const APP_ID = process.env.REACT_APP_APP_ID;
    SendBirdCall.init(APP_ID);

    try {
      await authenticate();
      await SendBirdCall.connectWebSocket();
      addEventHandler();
      setAuthenticated(true);
    } catch {
      setAuthenticated(false);
    }
  };

  const authenticate = () => {
    return new Promise((resolve, reject) => {
      SendBirdCall.authenticate({ userId }, (res, error) => {
        if (error) {
          console.log("Error authenticaing");
          reject(error);
        } else {
          console.log(`Authenticated as ${userId}`);
          resolve(res);
        }
      });
    });
  };

  const setDefaultCallHandlers = (call) => {
    call.onEstablished = () => {
      setRinging(false);
      setConnecting(false);
      console.log("Call established");
    };
    call.onConnected = () => {
      setRinging(false);
      setConnected(true);
      setConnecting(false);
      console.log("Call connected");
    };
    call.onReconnected = () => {
      setConnected(true);
      setConnecting(false);
      console.log("Call reconnected");
    };
    call.onReconnecting = () => {
      setConnected(false);
      setConnecting(true);
      console.log("Call reconnecting");
    };
    call.onEnded = () => {
      setRinging(false);
      setConnected(false);
      setConnecting(false);
      setCall(null);
      console.log("Call ended");
    };
    call.onRemoteAudioSettingsChanged = () => {
      console.log("Remote audio settings changed");
    };
    call.onRemoteVideoSettingsChanged = () => {
      console.log("Remote video settings changed");
    };
    return call;
  };

  const defaultCallParams = {
    callOption: {
      localMediaView: document.getElementById("local_video_element_id"),
      remoteMediaView: document.getElementById("remote_video_element_id"),
      audioEnabled: true,
      videoEnabled: true,
    },
  };

  const makeCall = ({ userId, isVideoCall }) => {
    const dialParams = { ...defaultCallParams, ...{ userId, isVideoCall } };
    let call = SendBirdCall.dial(dialParams, (call, error) => {
      if (error) {
        setCall(null);
      }
    });

    call = setDefaultCallHandlers(call);
    setConnecting(true);
    setCall(call);
  };

  return (
    <div className="p-10 px-[50px]">
      <div className="flex justify-center mt-[100px]">
        <>
          {userId && (
            <>
              <div className="flex flex-col">
                <div className="flex justify-center py-3 text-[20px]">
                  <h1 className="font-bold">Authenticated as {userId}</h1>
                </div>

                {authenticated && ringing && (
                  <div>
                    <IncomingCallModal
                      visible={ringing}
                      onAccept={() => call.accept(defaultCallParams)}
                      onDecline={() => call.end()}
                    />
                  </div>
                )}

                {authenticated && connected && (
                  <div className="flex justify-center">
                    <div className="flex flex-col space-y-3">
                      <h2>
                        {call.isVideoCall ? "Video" : "Audio"} Call is Connected
                      </h2>
                      <div className="flex space-x-4">
                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                          <button
                            onClick={() => {
                              setMuted(!muted);
                              call.isLocalAudioEnabled
                                ? call.muteMicrophone()
                                : call.unmuteMicrophone();
                            }}
                            className="flex space-x-2 rounded-md w-full bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            <div>
                              {call.isLocalAudioEnabled ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-6 h-6"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-6 h-6"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z"
                                  />
                                </svg>
                              )}
                            </div>
                            <div className="pt-[2px]">Toggle Audio</div>
                          </button>
                        </div>
                        {call.isVideoCall && (
                          <div className="flex bg-yellow-500 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                            <button
                              onClick={() => {
                                setMutedAudio(!mutedVideo);
                                call.isLocalVideoEnabled
                                  ? call.stopVideo()
                                  : call.startVideo();
                              }}
                              className="flex space-x-2 rounded-md w-full bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                              <div>
                                {mutedVideo ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M12 18.75H4.5a2.25 2.25 0 01-2.25-2.25V9m12.841 9.091L16.5 19.5m-1.409-1.409c.407-.407.659-.97.659-1.591v-9a2.25 2.25 0 00-2.25-2.25h-9c-.621 0-1.184.252-1.591.659m12.182 12.182L2.909 5.909M1.5 4.5l1.409 1.409"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
                                    />
                                  </svg>
                                )}
                              </div>
                              <div className="pt-[2px]">Toggle Video</div>
                            </button>
                          </div>
                        )}
                        <div className="bg-red w-[100px]">
                          <button
                            onClick={() => call.end()}
                            className="rounded-md w-full h-[42px] bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            End Call
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {authenticated && connecting && (
                  <div className="flex justify-center">
                    <div className="flex flex-col space-y-3">
                      <div className="flex space-x-2">
                        <div className="bg-green-400 w-[50px] h-[50px] flex justify-center items-center rounded-full">
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
                        </div>
                        <div className="h-full flex items-center">
                          Calling...
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-center py-3 text-[20px]">
                  {authenticated && !ringing && !connected && !connecting && (
                    <DialForm makeCall={makeCall} />
                  )}
                  {!authenticated && (
                    <div>
                      <h1 className="font-bold flex justify-center py-3 text-[20px]">
                        Unable to authenticate as {userId}
                      </h1>
                      <LoginForm userId={userId} setUserId={setUserId} />
                    </div>
                  )}
                </div>

                <div className="relative h-[700px] w-[1200px] flex rounded-md">
                  {/* {call?.isVideoCall && <h3>Remote Video</h3>} */}
                  <video
                    className="absolute top-0 left-0 w-full h-full object-cover z-0 rounded-md"
                    id="remote_video_element_id"
                    autoPlay={true}
                    visible={call?.isVideoCall}
                    style={
                      call?.isVideoCall ? { width: "100%" } : { width: "0%" }
                    }
                  />
                  {/* {call?.isVideoCall && <h3>My Video</h3>} */}
                  <video
                    className="absolute top-0 left-0 object-cover z-1 w-[400px] h-[250px] rounded-md"
                    id="local_video_element_id"
                    autoPlay="true"
                    visible={call?.isVideoCall}
                    style={
                      call?.isVideoCall ? { width: "30%" } : { width: "0%" }
                    }
                  />
                </div>
              </div>
            </>
          )}

          {!userId && (
            <div>
              <h1 className="font-bold flex justify-center py-3 text-[20px]">
                Not Authenticated
              </h1>
              <LoginForm setUserId={setUserId} />
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default Call;
