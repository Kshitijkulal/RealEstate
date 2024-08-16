import { defer } from "react-router-dom";
import apiRequest from "./apiRequest"

export const singlePageLoader = async ({request,params}) => {
    const res = await apiRequest.get(`/posts/${params.id}`);
    return res.data;
}

export const listPageLoader = async ({request, params}) => {
    const query = request.url.split("?")[1]
    const res = apiRequest.get(`/posts?${query}`) ;
    return defer({
        postResponse: res
    });
}

export const profilePageLoader = async ({request, params}) => {
    const query = request.url.id;
    const res = await apiRequest.get(`/users/profileposts`);
    const chatPromise = apiRequest.get("/chats");
    return defer({
        postResponse: res,
        chatResponse: chatPromise,
    });
}