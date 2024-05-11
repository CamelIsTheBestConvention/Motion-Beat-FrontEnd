// import axios from "axios";
// import { useEffect, useState } from "react"
// import "../../../../styles/main/mypageBox.scss"

// const MypageBox = () => {
//   const backendUrl = process.env.REACT_APP_BACK_API_URL;
//   const myNickname = sessionStorage.getItem("nickname");
//   const [recentSongList, setRecentSongList] = useState([]);
//   const [favoriteSongList, setFavoriteSongList] = useState([]);
//   const [activeTab, setActiveTab] = useState('favorite');
//   // 즐겨찾기 최신 변경
//   const [changeFav, setChangeFav] = useState(true);
//   const [changeRec, setChangeRec] = useState(false);

//   const clickFavorite = () => {
//     setChangeFav(true);
//     setChangeRec(false);
    
//     // // 즐겨찾기 api
//     // const favoriteSongs = async () => {
//     //   try {
//     //     const response = await axios.get(`${backendUrl}/api/songs/favorite`, {
//     //       headers: {
//     //         "Content-Type": "application/json",
//     //         "Authorization": `Bearer ${sessionStorage.getItem("userToken")}`,
//     //         "UserId": sessionStorage.getItem("userId"),
//     //         "Nickname": sessionStorage.getItem("nickname")
//     //       }
//     //     });
//     //     setFavoriteSongList(response.data.recentlyPlayed);
//     //   } catch (error) {
//     //     console.error("leave room error", error);
//     //   }
//     // };

//     // favoriteSongs();
//   }

//   // 최근 플레이 api
//   const clickRecently = () => {
//     setChangeRec(true);
//     setChangeFav(false);

//     // const recentlySongs = async () => {
//     //   try {
//     //     const response = await axios.get(`${backendUrl}/api/songs/recent`, {
//     //       headers: {
//     //         "Content-Type": "application/json",
//     //         "Authorization": `Bearer ${sessionStorage.getItem("userToken")}`,
//     //         "UserId": sessionStorage.getItem("userId"),
//     //         "Nickname": sessionStorage.getItem("nickname")
//     //       }
//     //     });
//     //     setRecentSongList(response.data);
//     //   } catch (error) {
//     //     console.error("leave room error", error);
//     //   }
//     // };

//     // recentlySongs();
//   }

//   useEffect(() => {
//     if (changeRec || changeFav) {
//       const fetchData = async () => {
//         if (changeRec) {
//           try {
//             const response = await axios.get(`${backendUrl}/api/songs/recent`, {
//               headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${sessionStorage.getItem("userToken")}`,
//                 "UserId": sessionStorage.getItem("userId"),
//                 "Nickname": sessionStorage.getItem("nickname")
//               }
//             });
//             setRecentSongList(response.data.recentlyPlayed);
//           } catch (error) {
//             console.error("leave room error", error);
//           }
//         } else if (changeFav) {
//           try {
//             const response = await axios.get(`${backendUrl}/api/songs/favorite`, {
//               headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${sessionStorage.getItem("userToken")}`,
//                 "UserId": sessionStorage.getItem("userId"),
//                 "Nickname": sessionStorage.getItem("nickname")
//               }
//             });
//             setFavoriteSongList(response.data);
//           } catch (error) {
//             console.error("leave room error", error);
//           }
//         }
//       };
//       fetchData();
//     }
//   }, [changeRec, changeFav]);

//   return (
//     <>
//       <div className="mypageBoxWrapper">
//         <div className="mypageNickname">
//           <p>{myNickname}</p>
//         </div>

//         <div className="mypageMainBox">
//           <div className="mypageFavorite" onClick={clickFavorite} style={{ zIndex: changeFav ? 3 : 2 }}>
//             {changeFav &&
//               <>
//                 <span className="favoriteTitle">즐겨찾기 한 노래</span>
//                 <ul style={{fontSize: "2rem", color: "white"}}>
//                   {favoriteSongList.map((song, index) => (
//                     <li key={index}>
//                       <p>{song.title}</p>
//                       <p>{song.artist}</p>
//                       <p>{song.difficulty}</p>
//                       </li>
//                   ))}
//                 </ul>
//               </>
//             }
//           </div>
          
//           <div className="mypageRecently" onClick={clickRecently} style={{ zIndex: changeRec ? 3 : 2 }}>
//             {changeRec &&
//               <>
//                 <span className="recentlyTitle">최근 플레이 한 노래</span>
//                 <ul style={{fontSize: "2rem", color: "white"}}>
//                   {recentSongList.map((song, index) => (
//                     <li key={index}>
//                       <p>{song.title}</p>
//                       <p>{song.artist}</p>
//                       <p>{song.difficulty}</p>
//                       </li>
//                   ))}
//                 </ul>
//               </>
//             }
//           </div>
//         </div>


//       </div>
//     </>
//   )
// }
// export default MypageBox

import axios from "axios";
import { useEffect, useState } from "react"
import "../../../../styles/main/mypageBox.scss"

const MypageBox = () => {
  const backendUrl = process.env.REACT_APP_BACK_API_URL;
  const myNickname = sessionStorage.getItem("nickname");
  const [recentSongList, setRecentSongList] = useState([]);
  const [favoriteSongList, setFavoriteSongList] = useState([]);
  const [activeTab, setActiveTab] = useState('favorite'); // 상태 추가

  const fetchData = async () => { // 데이터 가져오는 함수
    try {
      const response = await axios.get(`${backendUrl}/api/songs/${activeTab}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("userToken")}`,
          "UserId": sessionStorage.getItem("userId"),
          "Nickname": sessionStorage.getItem("nickname")
        }
      });

      if (activeTab === 'favorite') {
        setFavoriteSongList(response.data);
        console.log(response.data);
      } else if (activeTab === 'recent') {
        setRecentSongList(response.data.recentlyPlayed);
        console.log(response.data.recentlyPlayed);
      }
    } catch (error) {
      console.error("leave room error", error);
    }
  };

  useEffect(() => {
    fetchData();
    console.log("Active tab is now:", activeTab);
  }, [activeTab]); // activeTab이 변경될 때마다 fetchData 호출

  const handleClick = (tab) => { // 탭 클릭 시 호출되는 함수
    console.log("Changing tab to:", tab);
    setActiveTab(tab);
  };

  return (
    <>
      <div className="mypageBoxWrapper">
        <div className="mypageNickname">
          <p>{myNickname}</p>
        </div>

        <div className="mypageMainBox">
          <div className="mypageFavorite" onClick={() => handleClick('favorite')} style={{ zIndex: activeTab === 'favorite' ? 3 : 2 }}>
            <span className="favoriteTitle">즐겨찾기 한 노래</span>
            {activeTab === 'favorite' && favoriteSongList && (favoriteSongList.length > 0) &&
              <ul style={{fontSize: "2rem", color: "white"}}>
                {favoriteSongList.map((song, index) => (
                  <li key={index}>
                    <p>{song.title}</p>
                    <p>{song.artist}</p>
                    <p>{song.difficulty}</p>
                  </li>
                ))}
              </ul>
            }
          </div>
          
          <div className="mypageRecently" onClick={() => handleClick('recent')} style={{ zIndex: activeTab === 'recent' ? 3 : 2 }}>
            <span className="recentlyTitle">최근 플레이 한 노래</span>
            {activeTab === 'recent' && recentSongList && (recentSongList.length > 0) &&
              <ul style={{fontSize: "2rem", color: "white"}}>
                {recentSongList.map((song, index) => (
                  <li key={index}>
                    <p>{song.title}</p>
                    <p>{song.artist}</p>
                    <p>{song.difficulty}</p>
                  </li>
                ))}
              </ul>
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default MypageBox;