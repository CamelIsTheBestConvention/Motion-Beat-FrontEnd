import { useCallback, useEffect, useState } from "react";
import socket from "../../server/server.js";
import { ingameSendData } from "../../redux/actions/sendDataAction";
import { useDispatch } from "react-redux";
import "../../styles/room/webcam.scss";
import { useAudio } from "../common/useSoundManager.js";

export const SecondScore = ({ gameData, railRefs, myPosition }) => {
  const [playerScores, setPlayerScores] = useState({});
  const { playMotionSFX } = useAudio();
  const [playerCombos, setPlayerCombos] = useState({});
  const [hittedNotes, setHittedNotes] = useState(0);
  const [missedNotes, setMissedNotes] = useState(0);
  const [combo, setCombo] = useState(0);
  const dispatch = useDispatch();
  const myNickname = sessionStorage.getItem("nickname");

  const handleScore = (res) => {
    // console.log("Score received:", res.nickname, res.score);
    setPlayerScores((prevScores) => {
      const updatedScores = {
        ...prevScores,
        [res.nickname]: res.score,
      };
      return updatedScores;
    });
    setPlayerCombos((prevCombos) => {
      const updatedCombos = {
        ...prevCombos,
        [res.nickname]: res.combo,
      };
      return updatedCombos;
    });
  };

  // 점수를 업데이트하는 함수
  const updateScore = useCallback((result) => {
    if (result === "hit") {
      // setHittedNotes(hittedNotes + 1);
      setHittedNotes((prev) => prev + 1);
      setCombo((prevCombo) => prevCombo + 1);
    } else if (result === "miss") {
      // setMissedNotes(missedNotes + 1);
      setMissedNotes((prev) => prev + 1);
      setCombo(0);
    }
  }, []);

  // 외부에서 이벤트를 받아서 점수 업데이트가 필요할 경우를 위한 이벤트 리스너 설정
  useEffect(() => {
    const handleScoreUpdate = (event) => {
      updateScore(event.detail.result);
    };

    window.addEventListener("scoreUpdate", handleScoreUpdate);

    return () => {
      window.removeEventListener("scoreUpdate", handleScoreUpdate);
    };
  }, [updateScore]);

  useEffect(() => {
    dispatch(
      ingameSendData({
        code: gameData.code,
        nickname: myNickname,
        score: hittedNotes,
        combo: combo,
      })
    );
  }, [hittedNotes, dispatch, gameData.code, myNickname, combo]);

  useEffect(() => {
    const session_instrument = sessionStorage.getItem("instrument");
    const session_motionType = sessionStorage.getItem("motionType");

    // console.log("노트 받는지 response:", hittedNotes);
    const sendData = {
      code: gameData.code,
      nickname: myNickname,
      currentScore: hittedNotes,
      combo: combo,
      instrument: session_instrument,
      motionType: session_motionType,
    };

    // console.log("보낼 데이터", sendData);
    socket.emit("hit", sendData);
    playMotionSFX(session_instrument, session_motionType, { volume: 1 });

    sessionStorage.setItem("hitNote", hittedNotes);
    sessionStorage.setItem("combo", combo);
  }, [
    hittedNotes,
    missedNotes,
    combo,
    gameData.code,
    myNickname,
    playMotionSFX,
  ]);

  // hit 출력
  useEffect(() => {
    const scoreUpdateEvents = gameData.players.map((player, index) => {
      const eventName = `liveScore${player.nickname}`;
      socket.on(eventName, (scoreData, combo, instrument, motionType) => {
        if (
          instrument !== undefined &&
          instrument !== null &&
          motionType !== null &&
          motionType !== undefined
        ) {
          // 게임 이벤트 발생 시 효과음 재생
          playMotionSFX(instrument, motionType, { volume: 1 }); // 예시로 볼륨을 1로 설정

          // if (index !== myPosition) {
          //   TriggerHitEffect(`player${index}`, railRefs.current[index]);
          // }
        }

        setPlayerScores((prevScores) => {
          const updatedScores = {
            ...prevScores,
            [player.nickname]: scoreData,
          };
          return updatedScores;
        });

        handleScore({
          nickname: player.nickname,
          score: scoreData,
          combo: combo,
        });
      });
      return eventName;
    });

    return () => {
      scoreUpdateEvents.forEach((eventName) => {
        socket.off(eventName);
      });
    };
  }, [gameData.players, myPosition, playMotionSFX, railRefs]);

  return (
    <>
      <div className="scoreWrapper">
        {gameData.players.map((player, index) => (
          <div className="score" key={index}>
            {/* <p name={player.nickname} className={`hitCombo ${combo > 0 ? 'show' : ''}`} key={`${player.nickname}-${combo}`}>{combo}COMBO</p> */}
            <p
              name={player.nickname}
              className={`hitCombo ${
                playerCombos[player.nickname] > 0 ? "show" : ""
              }`}
              key={`${player.nickname}-${playerCombos[player.nickname]}`}
            >
              {playerCombos[player.nickname]} COMBO
            </p>
            <p name={player.nickname} className="hitScore">
              score : {playerScores[player.nickname] * 100 || 0}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export const TriggerHitEffect = (target, elem) => {
  const hitEffect = document.getElementById(`${target}HitEffect`);
  if (!hitEffect) return; // hitEffect가 없으면 함수 실행 중지

  const notes = Array.from(elem?.current.children ?? []).filter((child) =>
    child.hasAttribute("data-index")
  );

  let closestNote = null;
  let minIndex = Infinity;
  for (const note of notes) {
    const index = parseInt(note.getAttribute("data-index"), 10);
    if (index < minIndex) {
      minIndex = index;
      closestNote = note;
    }
  }

  // 가장 작은 'data-index'를 가진 자식 요소가 있으면 제거
  if (closestNote) {
    elem.current.removeChild(closestNote);
  }

  hitEffect.classList.add("active");

  setTimeout(() => {
    hitEffect.classList.remove("active"); // 애니메이션이 끝나고 클래스를 제거
  }, 200); // 애니메이션 시간과 동일하게 설정
};

export default SecondScore;
