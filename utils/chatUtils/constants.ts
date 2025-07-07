export const websocketEndPoint = 'http://localhost:8080/websocket'

export const backEndPoint = 'http://localhost:8080'

export const getWebsocketSubRoom = (roomId: number) => `/ws/sub/room/${roomId}/`
export const getWebsocketPubRoom = (roomId: number) => `/ws/pub/room/${roomId}/`

export  const getChatRoomsUrl = () => `/chat`

export const getChatLastReadUrl = (roomId: number, chatId: number) => `/chat/room/${roomId}/chat/${chatId}`

export const getChatListFromRoomUrl = (roomId: number) => `/chat/${roomId}`

export const getChatRoomInfoFromRoomUrl = (roomId: number) => `/chat/room/${roomId}`

export const getUserSellingListUrl = (userId: number) => `/chat/user/${userId}`

export const getChatImageUrl = (imageName: string) => `${backEndPoint}/api/v1/tes/images/${imageName}`

// 수정
export const getChatPostImageUrl = (imageName: string) => `${backEndPoint}/api/v1/tes/images/${imageName}`