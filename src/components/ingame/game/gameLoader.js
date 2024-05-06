import { useLocation } from "react-router-dom";

/* 기본적인 것들 로드하기 */
export const Load = async () => {

  try {
    const results = await Promise.all([
      ingameSkin(),
      loadSongData(),
      connectServer(),
      connectPeer(),
      syncPeer(),
      audio()
    ]);

    const [skinData, songData, serverData, peerData, syncData, audioData] = results;
    console.log("시스템 준비");
    return { skinData, songData, serverData, peerData, syncData, audioData };

  } catch (error) {
    console.error("로드 실패");
    throw error
  }
}

const ingameSkin = async () => {
  console.log("인게임 스킨");
  /* 더미데이터 */
  let colors = ["255,0,0", "255, 255, 0", "0, 255, 0", "14, 128, 255"];
  let userData = { playerName: "indu", playerColor: "255, 165, 0", myPosition: 2 }

  await new Promise(resolve => setTimeout(() => {
    console.log("인게임 스킨 로딩 완료");
    resolve();
  }, 1000))

  return { colors, userData };
};

const loadSongData = async () => {
  console.log("노래 데이터");

  /* 이 노래데이터, 유저데이터는 Webcam의 임시데이터 입니다. */
  let ingameData = { imageUrl: "https://i.namu.wiki/i/C7Pn4lj5y_bVOJ8oMyjvvqO2Pv2qach6uyVt2sss93xx-NNS3fWpsDavIVYzfcPX516sK2wcOS8clpyz6acFOtpe1WM6-RN6dWBU77m1z98tQ5UyRshbnJ4RPVic87oZdHPh7tR0ceU8Uq2RlRIApA.webp", songSound: "/song/0.mp3" }

  let noteExactTime = {
    player0: [
      { "index": 0, "type": "A", "time": 1000 },
      { "index": 1, "type": "B", "time": 2000 },
      { "index": 2, "type": "A", "time": 2200 },
      { "index": 3, "type": "A", "time": 2400 },
      { "index": 4, "type": "B", "time": 2500 },
      { "index": 5, "type": "C", "time": 10000 },
    ],
    player1: [
      { "index": 0, "type": "A", "time": 2000 },
      { "index": 1, "type": "B", "time": 3000 },
      { "index": 2, "type": "C", "time": 10000 },
    ],
    player2: [
      { "index": 0, "type": "D", "time": 8000 },
      // { "index": 1, "type": "F", "time": 10000 },
      // { "index": 2, "type": "D", "time": 11000 },
      // { "index": 3, "type": "K", "time": 15000 },
    ],
    player3: [
      { "index": 0, "type": "B", "time": 2000 },
      { "index": 1, "type": "B", "time": 2500 },
      { "index": 2, "type": "C", "time": 10000 },
    ]
  };

  await new Promise(resolve => setTimeout(() => {
    console.log("Song data loaded.");
    resolve();
  }, 800));

  return { ingameData, noteExactTime };
};

const connectServer = async () => {
  console.log("서버에서 노래 시작시간 수신");
  /* 노래 시작시간 데이터 받기, api같은거 */
  let startAfterTime = 3000;
  return { startAfterTime }
};

const connectPeer = async () => {
  console.log("Connecting to peer...");
  return new Promise(resolve => setTimeout(() => {
    console.log("Connected to peer.");
    resolve();
  }, 500));
};

const syncPeer = async () => {
  console.log("Synchronizing with peer...");
  return new Promise(resolve => setTimeout(() => {
    console.log("Synchronization complete.");
    resolve();
  }, 300));
};

const audio = async () => {
  console.log("Loading audio...");
  return new Promise(resolve => setTimeout(() => {
    console.log("Audio is ready.");
    resolve();
  }, 1100));
};

export default Load