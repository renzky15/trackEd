"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function StatusListener() {
  const router = useRouter();

  const setupEventSource = useCallback(() => {
    console.log("Setting up EventSource connection...");
    const eventSource = new EventSource("/api/feedback/status-updates");

    eventSource.onopen = () => {
      console.log("EventSource connection established");
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received message:", data);

        if (data.type === "connection") {
          console.log("Connected with client ID:", data.clientId);
        } else if (data.type === "status_update") {
          console.log("Status update received:", data);
          router.refresh();
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      eventSource.close();

      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        console.log("Attempting to reconnect...");
        setupEventSource();
      }, 5000);
    };

    return eventSource;
  }, [router]);

  useEffect(() => {
    const eventSource = setupEventSource();

    return () => {
      console.log("Cleaning up EventSource connection...");
      eventSource.close();
    };
  }, [setupEventSource]);

  return null;
}
