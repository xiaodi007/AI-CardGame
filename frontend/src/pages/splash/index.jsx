import {
  ConnectButton,
  useCurrentAccount,
  useSignAndExecuteTransactionBlock,
  useSuiClient,
} from "@mysten/dapp-kit";
import { useState, useEffect } from "react";
import { TransactionBlock } from "@mysten/sui.js/transactions";

import { BucketClient } from "bucket-protocol-sdk";
import { COINS_TYPE_LIST, COIN_DECIMALS } from "bucket-protocol-sdk";

import { TypeAnimation } from "react-type-animation";
import { PACKAGE_ID, ROLES } from "../../config/constants";
import AudioPlay from "../../components/AudioPlay";

import { useNavigate } from "react-router-dom";
import "./index.less";

import { updateUserPoints, getLeaderboard } from "../../utils/utils";

const typeTextStyle = {
  whiteSpace: "pre-line",
  height: "30px",
  display: "inline-block",
  fontSize: 13,
  color: "white",
  paddingTop: 10,
  paddingLeft: 10,
};
const Splash = () => {
  const [showLoading, setShowLoading] = useState(false);
  const [showAddress, setShowAddress] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [userBalance, setUserBalance] = useState(0);
  const navigate = useNavigate();
  const client = useSuiClient();

  let counterPackageId = PACKAGE_ID;

  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();

  useEffect(() => {
    // 随机生成角色
    const randomIndex = Math.floor(Math.random() * 6) + 1;
    const role = ROLES[randomIndex - 1];
    localStorage.setItem("role", JSON.stringify(role));
  }, []);

  useEffect(() => {
    // 获取排行榜数据
    const fetchLeaderboard = async () => {
      const data = await getLeaderboard(showAddress); // 传入当前用户地址获取排行榜
      if (data) {
        setLeaderboard(data.top10);
      }
    };

    fetchLeaderboard();
  }, [showAddress]);

  
  function StartGameBtnWrapper() {
    const account = useCurrentAccount();
    useEffect(() => {
      if (account && account.address) {
        setShowAddress(account.address);
      }
    });

    useEffect(() => {
      // 获取用户余额
      const fetchUserBalance = async () => {
        const balance = await getLeaderboard(showAddress); // 传入当前用户地址获取排行榜
        if (balance) {
          setUserBalance(balance.userPoints);
        }
      };
  
      fetchUserBalance();
    });

    if (!account) {
      return null;
    }
    

    return (
      <div>
        {/* Display user balance */}
        {showAddress && (
          <div className="userBalance text-white text-center mt-4">
            <p>当前积分余额: {userBalance}</p>
          </div>
        )}
        <div
          className="startGameBtn w-[280px] m-auto p-2 border border-white text-center cursor-pointer"
          onClick={handleInitGame}
        >
          开始游戏
        </div>
        {showLoading && firstLoadTextWrapper()}
      </div>
    );
  }

  async function handleInitGame() {
    const data = await getLeaderboard(showAddress);
    let userPoints = 0;
    if (data) {
      userPoints = data.userPoints;
    }
    const txb = new TransactionBlock();
    setShowLoading(true);
    let is_charge_points = false;

    if (userPoints < 100) {
      // Instantiate BucketClients
      const coinDetails = await client.getCoins({
        owner: showAddress,
        coinType: COINS_TYPE_LIST.USDC,
      });
      // console.log(coinDetails)
      const buck = new BucketClient();
      const amountToTrans = 1 * 10 ** COIN_DECIMALS.USDC;
      const filteredData = coinDetails.data.filter(
        (item) => parseInt(item.balance) > 1000000
      );
      console.log(filteredData);
      // console.log(showAddress)
      const coinIn = filteredData[0].coinObjectId;
      const coinInObj = txb.object(coinIn);
      // console.log(coinInObj);
      const usdcInput = txb.splitCoins(coinInObj, [amountToTrans]);

      // txb.transferObjects([referralRebate], tx.pure.address(referrer));
      const coinOut = buck.psmSwapIn(
        txb,
        COINS_TYPE_LIST.USDC, // e.g USDC coin type
        usdcInput, // usdc coin object
        "0xde5448c74d811c5409041537078665ab8497a28fb125a95d7d8a12300cc655d5" // referrer address
      );
      txb.transferObjects([coinOut], showAddress);
      is_charge_points = true;
      
    }

    txb.moveCall({
      arguments: [
        txb.object("0x8"), // r: &Random
      ],
      target: `${counterPackageId}::game::rollDice`,
    });

    signAndExecute(
      {
        transactionBlock: txb,
        options: {
          showEffects: true,
          showObjectChanges: true,
        },
      },
      {
        onSuccess: (tx) => {
          client
            .waitForTransactionBlock({
              digest: tx.digest,
            })
            .then(() => {
              console.log("----------------objectID----------------")
              const objectArr = tx.effects?.created
              // const objectId = tx.effects?.created?.[2]?.reference?.objectId;
              const objectId = objectArr.find(item => item.owner.Shared)?.reference.objectId;
              console.log(tx.effects?.created)
              console.log("/////////////////////////////////////////////")
              localStorage.setItem("gameId", objectId + "");
              localStorage.setItem("addressId", showAddress + "");
              if(is_charge_points) {
                updateUserPoints(showAddress, 100)
              }
              navigate("/home");
            });
        },
        onError: (e) => {
          console.error(e);
        },
      }
    );
  }

  const firstLoadTextWrapper = () => {
    return (
      <TypeAnimation
        style={typeTextStyle}
        omitDeletionAnimation={true}
        speed={40}
        sequence={[`打开Sui钱包 确认交易...`, 5000, `即将进入，请等待...`]}
      />
    );
  };
  return (
    <div className="startPage w-full h-screen py-6">
      {/* <div className="absolute top-[20px] m-auto"> */}
      <img src="/assets/title.png" className="w-[300px] m-auto mb-10" />
      {/* <div className="description">
        这种方法确保了在用户交互后音频才会播放，符合现代浏览器的自动播放策略。您可以根据需要添加更多的控制，例如暂停、停止、调整音量等。
        这种方法确保了在用户交互后音频才会播放，符合现代浏览器的自动播放策略。您可以根据需要添加更多的控制，例如暂停、停止、调整音量等。
      </div> */}
      {/* <img src="/assets/start-border.png" className="w-[60%] m-auto mb-10" /> */}
      <div className="w-[300px] m-auto ">
        <div className=" pb-4 flex justify-center align-middle">
          <p className=" pt-3 text-lg">玩家：</p>
          <ConnectButton connectText="连接 Sui钱包" />
        </div>
        <StartGameBtnWrapper />
      </div>
      {/* 排行榜展示 */}
      <div className="leaderboard-container w-[300px] m-auto mt-6">
        <h2 className="text-white text-center mb-4">排行榜</h2>
        <ul className="leaderboard-list">
          {leaderboard.map((entry, index) => {
            // 截断用户地址
            const shortUser = `${entry.user.slice(0, 6)}...${entry.user.slice(
              -4
            )}`;

            return (
              <li key={index} className="leaderboard-item flex justify-between">
                <span className="text-white">
                  {index + 1}. {shortUser}
                </span>
                <span className="text-white">{entry.points} 分</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="absolute top-3 right-3">
        <AudioPlay src="/assets/music/rush1.mp3" />
      </div>
    </div>
  );
};

export default Splash;
