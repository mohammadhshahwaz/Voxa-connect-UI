export interface ConversationMode {
  id: string
  name: string
  img: string
  type: "button" | "link"
  route?: string
  state?: any
}

export const conversationModes: ConversationMode[] = [
  {
    id: "video",
    name: "Video Call",
    img: "./video-call.png",
    type: "button",
  },
  {
    id: "text",
    name: "Text Chat",
    img: "./text-chat.png",
    type: "link",
    route: "/conversations",
    state: { selectedAvatar: "" }, 
  },
]
