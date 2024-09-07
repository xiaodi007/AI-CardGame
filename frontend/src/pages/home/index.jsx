import { useSuiClientQuery } from "@mysten/dapp-kit";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import "./index.less";
import AudioPlay from "../../components/AudioPlay";
import SelectedTools from "./components/SelectedTools";
import { TypeAnimation } from "react-type-animation";
import HealthBar from "./components/HealthBar";
import ToolGroup from "./components/ToolGroup";
import CurrentPlayerRing from "./components/CurrentPlayerRing";
import GrowDoor from "./components/GrowDoor";

import GameLife from "./action/GameLife";

const typeTextStyle = {
  whiteSpace: "pre-line",
  height: "160px",
  display: "block",
  fontSize: 16,
  color: "white",
};

const Home = () => {
  const [step, setStep] = useState();
  const [gameId, setGameId] = useState(0);
  const [addressId, setAddressId] = useState('');
  const [game, setGame] = useState();
  const [usingTools, setUsingTools] = useState([]);
  const [usingToolTip, setUsingToolTip] = useState({});
  const [ignored, forceUpdate] = useState(0); // 用于强制更新组件
  const [currentRole, setCurrentRole] = useState({});
  const [aiSpeak, setAiSpeak] = useState();
  const [toolSelectedModalOpen, setToolSelectedModalOpen] = useState(false);
  const [isShowAiSpeak, setIsShowAiSpeak] = useState(false);

  const navigate = useNavigate();

  const { data, isPending, error, refetch } = useSuiClientQuery("getObject", {
    id: gameId,
    options: {
      showContent: true,
      showOwner: true,
    },
  });

  useEffect(() => {
    const gameId = localStorage.getItem("gameId");
    const addressId = localStorage.getItem("addressId");
    const role = JSON.parse(localStorage.getItem("role") || "{}");
    console.log(role);
    setGameId(gameId);
    setCurrentRole(role);
    setAddressId(addressId);
  }, []);

  useEffect(() => {
    console.log("effect: ", game);
    game?.setEventListener("onGameEvent", async (name, data) => {
      // console.log('onGameEvent: ', name, data);
      if (
        name === "useTool" ||
        name === "roundResult" ||
        name === "resetWorld"
      ) {
        setUsingToolTip(data);
        setToolSelectedModalOpen(true);
      } else if (name === "aiSpeek") {
        setAiSpeak(data);
        setIsShowAiSpeak(true);
        setTimeout(() => {
          setIsShowAiSpeak(false);
        }, 7000);
      } else if (name === "gameOver") {
        setStep(5);
      }
      forceUpdate((x) => x + 1);
    });
  }, [game]);

  useEffect(() => {
    initData(data);
  }, [data]);

  const generateDifferentDiceResults = (array) => {
    const [first, second] = array || [];

    if (first === second) {
      let firstDice = Math.floor(Math.random() * 6) + 1;
      let secondDice;
      do {
        secondDice = Math.floor(Math.random() * 6) + 1;
      } while (firstDice === secondDice);
      return [firstDice, secondDice];
    }
    return [first, second];
  };

  const formatData = (data) => {
    const { turn_begin, turn_item, ...reset } = data || {};
    return {
      ...reset,
      turn_begin: generateDifferentDiceResults(turn_begin),
      turn_item: generateDifferentDiceResults(turn_item),
    };
  };
  const initData = async (data) => {
    if (!data) {
      setStep(0);
      return;
    }
    setStep(1);
    setTimeout(() => {
      const fields = getCounterFields(data?.data);
      const _gameData = formatData(fields);
      const game = new GameLife();
      _gameData.roleAppId = currentRole?.app_id;
      _gameData.addressId = addressId;
      game?.prepareGame(_gameData);
      console.log("inti game: ", game);
      setGame(game);
    }, 1000);
  };

  function getCounterFields(data) {
    if (!data || data?.content?.dataType !== "moveObject") {
      return null;
    }

    return data?.content?.fields || {};
  }

  const handleToolClick = (role, type, indexList) => {
    if (role !== game?.leader || game?.gameOver) return;

    const [first] = indexList || [];
    game?.makeDecision?.(`c-${first}`);
    const tempTools = [...usingTools];
    console.log("tempTools: ", tempTools, type);
    tempTools.push(type);
    setUsingTools(tempTools);
    // setToolSelectedModalOpen(true);
  };

  const errorWrapper = () => {
    return (
      <>
        <div className="text-center">
          {/* <div className="text-3xl font-bold mt-10 mb-40">异世界出现了未知错误</div> */}
          <div
            className=" w-[280px] m-auto p-2 text-lg text-[#26b2b9] border-2 border-[#26b2b9] text-center cursor-pointer"
            onClick={() => {
              localStorage.removeItem("gameId");
              navigate("/");
            }}
          >
            重新进入
          </div>
        </div>
      </>
    );
  };
  const firstLoadTextWrapper = () => {
    return (
      <TypeAnimation
        style={typeTextStyle}
        omitDeletionAnimation={true}
        speed={80}
        sequence={[
          `即将开始游戏\n
           加载数据中\n
           游戏初始化成功\n
           异世界创建成功\n
           
准备完毕!`,
          3000,
          () => {
            setStep(2);
          },
        ]}
      />
    );
  };

  const nextActionTextWrapper = () => (
    <TypeAnimation
      sequence={[
        `本回合由: ${game?.leader} 先选择\n`,
        2000,
        () => {
          setStep(4);
          if (game?.leader !== "人类") {
            game?.startRound?.();
          }
        },
      ]}
      cursor={true}
      style={typeTextStyle}
    />
  );

  const selectedPlayer = () => {
    return (
      <>
        <div className="w-[500px] ml-[80px] mb-[40px]">
          {game?.leader === "人类" ? (
            <div className="mb-4">
              迎接挑战的时刻到了，是选择自己还是让对手进入那未知的异世界？
              <br />
              同时，你还可以使用不同道具，让世界变得更加有趣。
            </div>
          ) : (
            <div className="mb-4">人工智能正在参与挑战，你要担心了。</div>
          )}
          {/* <div className="w-full flex flex-wrap">
            {usingTools?.length > 0 && <div>使用道具：</div>}
            {usingTools?.map((item, index) => {
              return (
                <img
                  width={60}
                  key={index}
                  className="mr-2"
                  style={{ objectFit: "fill" }}
                  src={`/assets/tool/${item}.png`}
                />
              );
            })}
          </div> */}
        </div>
        {game?.leader === "人类" && (
          <>
            <div
              className=" w-[280px] m-auto my-4 p-2 text-lg border border-white text-center cursor-pointer"
              onClick={() => {
                game?.makeDecision?.("b");
              }}
            >
              对 手
            </div>
            <div
              className=" w-[280px] m-auto p-2 text-lg border border-white text-center cursor-pointer"
              onClick={() => {
                game?.makeDecision?.("a");
              }}
            >
              自己
            </div>
          </>
        )}
        <div className=" absolute left-[50%] bottom-[20px] translate-x-[-280px]">
          <GrowDoor />
        </div>
      </>
    );
  };

  const winner = () => (
    <>
      <div className="text-center">
        <div className="mb-6">回合结束</div>
        <div className="text-3xl font-bold mb-40">{game?.leader} 赢了</div>
        <div className="text-2xl font-bold mb-40">游戏数据将存储在Walrus上</div>
        <div className="text-2xl font-bold mb-40">Walrus blob_id: {game?.conversations_blob_id} </div>
        <div
          className=" w-[280px] m-auto p-2 text-lg text-[#26b2b9] border-2 border-[#26b2b9] text-center cursor-pointer"
          onClick={() => {
            localStorage.removeItem("gameId");
            navigate("/");
          }}
        >
          再来一局
        </div>
      </div>
    </>
  );

  return (
    <div className="home">
      {/* AI玩家 */}
      <div className=" absolute left-0 top-4 w-full m-auto flex justify-center align-middle">
        <div className=" w-auto min-w-[550px] border border-[#6ca4a2] flex gap-2 p-2">
          <ToolGroup
            items={game?.aiItems || []}
            onClick={undefined}
            // onClick={(type, indexList) =>
            //   handleToolClick("人工智能", indexList)
            // }
          />
          {!game?.aiItems?.length && (
            <div className="w-full text-right">还没有道具</div>
          )}
        </div>
        <div className="border border-red-500 ml-4 relative">
          <div className="w-full absolute left-0 top-0 bg-slate-600 opacity-80 text-center">
            {currentRole?.name || "默认"}
          </div>
          <img
            width={120}
            // style={{ objectFit: "fill" }}
            // src={`/assets/role/role1.png`}
            src={`https://aggregator-devnet.walrus.space/v1/KFNK4FOcywHEbZ-KhyihuJ9eALc0rXbYJBjhenEt3ms`}
          />
          <div className="w-[220px] absolute right-[-230px] top-0 p-1 text-[14px] border border-gray-500 bg-black">
            {aiSpeak || "正在思考。。。"}
          </div>
          <CurrentPlayerRing show={game?.leader === "人工智能"} />
          <div className="w-full absolute left-0 bottom-0 bg-slate-600 opacity-80">
            <HealthBar health={game?.aiHealth} role="ai" />
          </div>
        </div>
      </div>
      {/* 公告区域 */}
      <div className=" absolute top-[200px] left-0 w-[160px] bg-slate-700 opacity-60 p-2 px-4">
        <div className="text-center">信息牌</div>
        <div>
          安全世界：
          <span className="text-lg text-[#25b9b4] font-bold">
            {game?.safeWorlds || 0}
          </span>
          个
        </div>
        <div>
          致命世界：
          <span className="text-lg text-[#FD0813] font-bold">
            {game?.dangerousWorlds || 0}
          </span>
          个
        </div>
      </div>
      {/* 游戏区域 */}
      <div className=" absolute top-[200px] left-0 w-full flex justify-center align-middle">
        <div className="gameCenter w-[660px] h-[400px]  p-6 border border-[#6ca4a2] bg-slate-700 opacity-80 relative">
          {/* {renderUsingTools()} */}
          {step === 0 && errorWrapper()}
          {step === 1 && firstLoadTextWrapper()}
          {step === 2 && nextActionTextWrapper()}
          {step === 4 && selectedPlayer()}
          {step === 5 && winner()}
        </div>
      </div>

      {/* 真人玩家 */}
      <div className=" absolute left- bottom-4 w-full m-auto flex justify-center align-middle">
        <div className="border mr-4 relative">
          <img
            width={120}
            style={{ objectFit: "fill" }}
            // src={`/assets/role/role3.png`}
            src={`https://aggregator-devnet.walrus.space/v1/yEf7__kozUy6Bvr1134c256RO-iqga_Zf1V3Bfv3mMo`}
          />
          <CurrentPlayerRing show={game?.leader === "人类"} />
          <div className="w-full absolute left-0 bottom-0 bg-slate-600 opacity-80">
            <HealthBar health={game?.playerHealth} />
          </div>
        </div>
        <div className=" w-auto min-w-[550px] border border-[#6ca4a2] flex gap-2 p-2">
          <ToolGroup
            items={game?.playerItems || []}
            onClick={(type, indexList) =>
              handleToolClick("人类", type, indexList)
            }
          />
          {!game?.playerItems?.length && <div>还没有道具</div>}
        </div>
      </div>
      <SelectedTools
        open={toolSelectedModalOpen}
        values={usingToolTip}
        onCancel={() => setToolSelectedModalOpen(false)}
      />

      <div className="absolute top-3 right-3">
        <AudioPlay
          src={
            game?.playerHealth <= 2
              ? "/assets/music/rush1.mp3"
              : "/assets/music/begin2-4.mp3"
          }
        />
      </div>
    </div>
  );
};

export default Home;
