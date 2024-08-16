import "./singlePage.scss";
import Slider from "../../components/slider/Slider.jsx";
import Map from "../../components/map/Map";
import { useLoaderData, useNavigate } from "react-router-dom";
import domPurify from "dompurify";
import apiRequest from "../../lib/apiRequest.js";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

function SinglePage() {
  const postData = useLoaderData();
  const [saved, setSaved] = useState(postData.isSaved);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleSave = async () => {
    try {
      if (!currentUser) {
        navigate(`/login`);
      }
      const res = await apiRequest.post(`/users/save`, {
        postId: postData.id,
        });
      setSaved((prev) => !prev);
    } catch (error) {
      console.log(err);
      setSaved((prev) => !prev);
    }
  };
  const handleMessage = async () => {
    try {
      const res = await apiRequest.post(`/chats`,{
        recieverId: postData.user.id,
      });
      navigate("/profile");
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={postData.images} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{postData.title}</h1>
                <div className="address">
                  <img src="/pin.png" alt="" />
                  <span>{postData.address}</span>
                </div>
                <div className="price">₹ {postData.price}</div>
              </div>
              <div className="user">
                <img src={postData.user.avatar} alt="" />
                <span>{postData.user.username}</span>
              </div>
            </div>
            <div
              className="bottom"
              dangerouslySetInnerHTML={{
                __html: domPurify.sanitize(postData.postDetail.desc),
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className="features">
        <div className="wrapper">
          <p className="title">General</p>
          <div className="listVertical">
            <div className="feature">
              <img src="/utility.png" alt="" />
              <div className="featureText">
                <span>Utilities</span>
                {postData.postDetail.utilities === "owner" ? (
                  <p>Owner is responsible</p>
                ) : (
                  <p>Tenant is responsible</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Pet Policy</span>
                {postData.postDetail.pet === "allowed" ? (
                  <p>Pets Allowed</p>
                ) : (
                  <p>Pets not Allowed</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Income Policy</span>
                <p>{postData.postDetail.income}</p>
              </div>
            </div>
          </div>
          <p className="title">Sizes</p>
          <div className="sizes">
            <div className="size">
              <img src="/size.png" alt="" />
              <span>{postData.postDetail.size}</span>
            </div>
            <div className="size">
              <img src="/bed.png" alt="" />
              <span>{postData.bedroom}</span>
            </div>
            <div className="size">
              <img src="/bath.png" alt="" />
              <span>{postData.bathroom} bathroom</span>
            </div>
          </div>
          <p className="title">Nearby Places</p>
          <div className="listHorizontal">
            <div className="feature">
              <img src="/school.png" alt="" />
              <div className="featureText">
                <span>School</span>
                <p>
                  {postData.postDetail.school > 999
                    ? postData.postDetail.school / 1000 + "km"
                    : postData.postDetail.school + "m"}{" "}
                  away
                </p>
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Bus Stop</span>
                <p>{postData.postDetail.bus}m away</p>
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Restaurant</span>
                <p>{postData.postDetail.restaurant}m away</p>
              </div>
            </div>
          </div>
          <p className="title">Location</p>
          <div className="mapContainer">
            <Map items={[postData]} />
          </div>
          <div className="buttons">
            <button onClick={handleMessage}>
              <img src="/chat.png" alt="" />
              Send a Message
            </button>
            <button
              onClick={handleSave}
              style={{
                backgroundColor: saved ? "#fece51" : "white",
              }}
            >
              <img src="/save.png" alt="" />
              {saved ? "Place Saved" : "Save the Place"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePage;