import api from "./axios";

export interface Friend {
  id: number;
  name: string;
  email: string;
}

export type FriendshipStatus = "PENDING" | "ACCEPTED" | "DECLINED";

export interface FriendRequest {
  id: number;
  status: FriendshipStatus;
  createdAt: string;
  requester: Friend;
  receiver: Friend;
}


export async function sendFriendRequest(receiverId: number) {
  const res = await api.post(`/friendship/request/${receiverId}`);
  return res.data;
}


export async function acceptFriendRequest(requestId: number) {
  const res = await api.post(`/friendship/accept/${requestId}`);
  return res.data;
}


export async function declineFriendRequest(requestId: number) {
  const res = await api.post(`/friendship/decline/${requestId}`);
  return res.data;
}


export async function getFriends(): Promise<Friend[]> {
  const res = await api.get("/friendship/list");
  return res.data;
}


   export async function getFriendRequests(): Promise<FriendRequest[]> {
   const res = await api.get("/friendship/requests");
   return res.data;
}