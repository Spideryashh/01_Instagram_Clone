import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
  User,
} from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import { setPosts,setSelectedPost } from "@/redux/postSlice";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import mitrabannerlogo  from "../assets/mitralogobanner.png";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector(store => store.realTimeNotification);
  const [open, setOpen] = useState(false);

  const logoutHandler = async () => {
    // api call
    try {
      const res = await axios.get("https://zero1-instagram-clone.onrender.com/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const sidebarHandler = (textType) => {
    if (textType === 'Logout') {
        logoutHandler();
    } else if (textType === "Create") {
        setOpen(true);
    } else if (textType === "Profile") {
        navigate(`/profile/${user?._id}`);
    } else if (textType === "Home") {
        navigate("/");
    } else if (textType === 'Messages') {
        navigate("/chat");
    }
}
  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create" },
    {
        icon: (
            <Avatar className='w-6 h-6'>
                <AvatarImage src={user?.profilePicture} alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
        ),
        text: "Profile"
    },
    { icon: <LogOut />, text: "Logout" },
]

  return (
    <div className="fixed top-4 right-2 z-10 left-0 px-2 border-gray-300 w-[12%] h-screen max-md:px-1   ">
      <div className="flex flex-col ">
      <h1 className='my-4 pl-1'>
      <img src={mitrabannerlogo} alt="MM" />
      </h1>
        <div>
          {sidebarItems.map((item, index) => {
            return (
              <div
                onClick={() => sidebarHandler(item.text)}
                key={index}
                className="flex items-center  gap-3 p-3 hover:bg-gray-200 cursor-pointer rounded-lg "
              >
                <span>{item.icon}</span>
                <span className="min-sm:visible max-md:hidden ">
                  {item.text}
                </span>
                {item.text === "Notifications" &&
                  likeNotification.length > 0 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          size="icon"
                          className="rounded-full h-4 w-4 absolute  left-10 max-md:left-8 "
                        >
                          {likeNotification.length}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        {likeNotification.length === 0 ? (
                          <p>No new notifications.</p>
                        ) : (
                          likeNotification.map((notification) => {
                            return (
                              <div key={notification.userId}>
                                <Avatar>
                                  <AvatarImage
                                    src={notification.userDetails?.profilePicture}
                                  />
                                  <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <p className="text-sm">
                                  <span className="font-bold">
                                    {notification.userDetails?.username+' '}
                                  </span>
                                  liked your post.
                                </p>
                              </div>
                            );
                          })
                        )}
                      </PopoverContent>
                    </Popover>
                  )}
              </div>
            );
          })}
        </div>
      </div>

      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeftSidebar;
