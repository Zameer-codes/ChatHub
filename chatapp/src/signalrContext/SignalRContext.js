import { useState, useEffect } from "react";
import * as signalR from "@microsoft/signalr";

const useSignalR = (hubUrl) => {
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl).configureLogging(signalR.LogLevel.Information)
      .build();
    newConnection.start().then(() => console.log("connection started"));
    setConnection(newConnection);
  }, [hubUrl]);
  return connection;
};

export default useSignalR;
