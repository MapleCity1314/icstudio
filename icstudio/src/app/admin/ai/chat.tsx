"use client";

import dynamic from "next/dynamic";

export const Chat = dynamic(
  () => import("./_chat").then((mod) => mod.ChatInterface),
  {
    ssr: false,
  }
);
