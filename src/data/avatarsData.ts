export interface Avatar {
  id: string
  name: string
  img: string
  route: string
  state: {
    selectedAvatar: string
  }
}

export const avatarsData: Avatar[] = [
  {
    id: "female",
    name: "Avatar Lina",
    img: "./ai-female.png",
    route: "/calldemooptions",
    state: { selectedAvatar: "female" },
  },
  {
    id: "male",
    name: "Avatar Rafik",
    img: "./ai-20.png",
    route: "/calldemooptions",
    state: { selectedAvatar: "male" },
  },
]
