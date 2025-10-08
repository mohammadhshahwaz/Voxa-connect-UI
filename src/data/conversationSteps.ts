export interface ConversationStep {
  step: string
  title: string
  description: string
  img: string
  cardClass?: string
}

export const conversationSteps: ConversationStep[] = [
  {
    step: "Step 1",
    title: "Start Demo",
    description: "Begin right from the home screen with a single click.",
    img: "/Cions.svg",
    cardClass: "arc-1",
  },
  {
    step: "Step 2",
    title: "Choose Your AI Avatar",
    description: "Select the AI persona avatar you'd like to interact with.",
    img: "/icons-mens.svg",
    cardClass: "arc-2",
  },
  {
    step: "Step 3",
    title: "Pick Conversation Type",
    description: "Pick between video call or text chat – whatever suits you.",
    img: "/Cions.svg",
    cardClass: "arc-3",
  },
  {
    step: "Step 4",
    title: "Start Conversing",
    description: "Engage in a natural, real-time conversation with VoxaConnect.",
    img: "/icons-start.svg",
  },
]
