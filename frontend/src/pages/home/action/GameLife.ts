import axios from "axios";
import { updateUserPoints } from "../../../utils/utils";
import { ROLES } from "../../../config/constants";

interface InitData {
  roleAppId: string;
  addressId: string;
  ai_random: number;
  hp: number;
  items: number[];
  player_random: number;
  turn_begin: number[];
  turn_item: number[];
  worlds: number[];
}


class LifeAndDeathGame {
  roleAppId: string;
  addressId: string;
  maxHealth: number;
  playerHealth: number;
  aiHealth: number;
  worlds: string[];
  items: number[];
  playerDice: number;
  aiDice: number;
  playerItems: number[];
  aiItems: number[];
  currentRound: number;
  leader: string;
  safeWorlds: number;
  dangerousWorlds: number;
  worldsLeft: number;
  danger: number;
  useEMP: boolean;
  useEye: boolean;
  lastUseItem: string;
  playerRandom: number;
  aiRandom: number;
  gameOver: boolean;
  aiMsg: string;
  sessionId: string;
  listeners: any;

  constructor() {
    this.roleAppId = "";
    this.addressId = "";
    this.maxHealth = 0;
    this.playerHealth = 0;
    this.aiHealth = 0;
    this.worlds = [];
    this.items = [];
    this.playerDice = 0;
    this.aiDice = 0;
    this.playerItems = [];
    this.aiItems = [];
    this.currentRound = 1;
    this.leader = "";
    this.safeWorlds = 0;
    this.dangerousWorlds = 0;
    this.worldsLeft = 0;
    this.danger = 1;
    this.useEMP = false;
    this.useEye = false;
    this.lastUseItem = ''
    this.playerRandom = 0;
    this.aiRandom = 0;
    this.gameOver = false;
    this.aiMsg = "";
    this.sessionId = "";
    this.listeners = {
      onGameEvent: () => {},
    };
  }

  

  async prepareGame(initData: InitData) {
    console.log("Preparing game...");
    this.initializeGame(initData);
    // await this.startRound();
  }

  initializeGame(initData: InitData) {
    this.roleAppId = initData?.roleAppId;
    this.addressId = initData?.addressId;
    this.maxHealth = initData.hp;
    this.playerHealth = this.aiHealth = initData.hp;
    this.worlds = initData.worlds?.map((world) =>
      world === 1 ? "致命世界" : "安全世界"
    );
    this.worldsLeft = this.worlds.length;
    this.dangerousWorlds = this.worlds.filter(
      (world) => world === "致命世界"
    ).length;
    this.safeWorlds = this.worlds.length - this.dangerousWorlds;
    this.items = initData.items;
    // this.items = [1, 2, 3, 4, 1, 2, 3, 4];
    this.playerDice = initData.turn_begin[1];
    this.aiDice = initData.turn_begin[0];
    this.leader = this.playerDice > this.aiDice ? "人类" : "人工智能";
    // this.leader = "人工智能";
    this.playerRandom = initData.player_random;
    this.aiRandom = initData.ai_random;
    this.distributeItems();
    console.log(`afsdfas。`);
    console.log(this.addressId);
    console.log(`游戏准备完毕，开始进行第一回合。`);
  }

  // 设置事件监听器
  setEventListener(eventName, listener) {
    this.listeners[eventName] = listener;
  }

  generateSeed(playerRandom: number, aiRandom: number): number {
    const timestamp = Date.now();
    const timestampPart = parseInt(timestamp.toString().slice(-5)); // 截取时间戳的最后5位
    return playerRandom + aiRandom + timestampPart;
  }

  customRandom(seed: number): () => number {
    let value = seed;
    return () => {
      value = (value * 9301 + 49297) % 233280;
      return value / 233280;
    };
  }
  generateWorlds(): number[] {
    const randomSeed = this.generateSeed(this.playerRandom, this.aiRandom);
    const random = this.customRandom(randomSeed);
    const numWorlds = Math.floor(random() * 8) + 1;
    const worlds = Array.from({ length: numWorlds }, () =>
      random() > 0.5 ? 1 : 0
    );
    return worlds;
  }

  generateItems(): number[] {
    const randomSeed = this.generateSeed(this.playerRandom, this.aiRandom);
    const random = this.customRandom(randomSeed);
    return Array.from({ length: 8 }, () => Math.floor(random() * 5) + 1);
  }
  distributeItems() {
    this.playerItems = this.items.slice(0, 4);
    this.aiItems = this.items.slice(4, 8);
    console.log(`人类道具: ${this.playerItems}, 人工智能道具: ${this.aiItems}`);
  }

  shuffleArray<T>(array: T[]): T[] {
    console.log("Shuffling array...");
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  async startRound() {
    if (this.isGameOver()) {
      return;
    }
    console.log('------------------startRound--------------');
    
    if (this.worldsLeft === 0) {
      await this.resetWorldsAndItems();
      return;
    }
    console.log(`---------------第${this.currentRound}回合---------------`, new Date().toLocaleString());
    await this.showDecisionOptions();
  }

  isGameOver(): boolean {
    if (this.playerHealth <= 0 || this.aiHealth <= 0) {
      console.log(
        `游戏结束，${this.playerHealth <= 0 ? "人工智能" : "人类"}获胜。`
      );
      this.gameOver = true;
      this.leader = this.playerHealth <= 0 ? "人工智能" : "人类";
      if (this.leader ==="人类" && this.gameOver) {
        updateUserPoints(this.addressId, 100)
      } else {
        updateUserPoints(this.addressId, -100)
      }
      
      // 触发事件
      this.listeners?.onGameEvent("gameOver");
      return true;
    }
    return false;
  }

  async resetWorldsAndItems() {
    console.log("本轮世界已耗尽，重新生成世界和道具。");

    const data = {
      msg: `本轮世界已耗尽，重新生成世界和道具`,
    };
    // 延时触发重置提醒
    // 触发事件
    setTimeout(() => {
      this.listeners?.onGameEvent("resetWorld", data);
    }, 2000);

    this.worlds = this.generateWorlds().map((world) =>
      world === 1 ? "致命世界" : "安全世界"
    );
    this.worldsLeft = this.worlds.length;
    this.dangerousWorlds = this.worlds.filter(
      (world) => world === "致命世界"
    ).length;
    this.safeWorlds = this.worlds.length - this.dangerousWorlds;

    const newItems = this.generateItems();
    this.playerItems = this.playerItems.concat(newItems.slice(0, 4));
    this.aiItems = this.aiItems.concat(newItems.slice(4, 8));
    console.log(`新生成的世界: ${this.worldsLeft}`);
    console.log(`新生成的道具: ${newItems}`);
    console.log(`累加后的人类道具: ${this.playerItems}`);
    console.log(`累加后的AI道具: ${this.aiItems}`);

    console.log("游戏准备完毕，开始进行下一回合。");
    // await this.startRound();
    await this.showDecisionOptions()
  }

  async showDecisionOptions() {
    this.displayStatus();
    // const choice = await this.getInput("请选择(a/b/c-道具序号):");
    
    if (this.leader === "人工智能") {
      // await waitTime(3000);
      if (this.gameOver) return;
      const aiResult = await this.fetchGptOption(this.aiMsg);
      // 由于返回字段不确定 默认选择第一个字段
      const choice = Object.values(aiResult)?.[0] || "";
      console.log("ai choice: ", choice);

      // 触发事件
      this.listeners?.onGameEvent("aiSpeek", aiResult?.message);
      await this.makeDecision(choice);
    }
  }

  displayStatus() {
    console.log(`血量和道具情况`);
    console.log(`人类血量：${this.playerHealth}`);
    console.log(`人类的剩余道具列表：${this.playerItems}`);
    console.log(`人工智能血量：${this.aiHealth}`);
    console.log(`人工智能的剩余道具列表：${this.aiItems}`);
    console.log(`致命世界数量：${this.dangerousWorlds}`);
    console.log(`安全世界数量：${this.safeWorlds}`);
    console.log(`--------------${this.leader}--选择-----------------`);
    console.log(`a.选择自己进入异世界`);
    console.log(`b.选择对方进入异世界`);
    const _msg = `
        血量和道具情况\n
        人类血量：${this.playerHealth};\n
        人类的剩余道具列表：${this.playerItems};\n
        人工智能血量：${this.aiHealth};\n
        人工智能的剩余道具列表：${this.aiItems};\n
        致命世界数量：${this.dangerousWorlds};\n
        安全世界数量：${this.safeWorlds};\n
        ${this.lastUseItem};\n
        --------------${this.leader}--选择-----------------\n
        a.选择自己进入异世界;\n
        b.选择对方进入异世界;\n
        `;
    this.showItemOptions(_msg);
  }

  showItemOptions(_msg) {
    const items = this.leader === "人类" ? this.playerItems : this.aiItems;
    let optionMsg = "\n";
    items.forEach((item, index) => {
      optionMsg += `c-${index + 1}. ${this.getItemName(item)};\n`;
      console.log(`c-${index + 1}. ${this.getItemName(item)}`);
    });
    this.aiMsg = _msg + optionMsg;
  }

  getItemName(item: number): string {
    const itemNames = ["生命之泉", "EMP", "钢铁洪流", "格式化", "阴阳眼"];
    return itemNames[item - 1] || "未知道具";
  }

  async makeDecision(choice: string) {

    if (choice.startsWith("c-")) {
      const itemIndex = parseInt(choice.split("-")[1]) - 1;
      await this.useItem(itemIndex);
    } else if (choice === "a" || choice === "b") {
      await this.enterWorld(choice);
    } else {
      console.log("无效选择，请重新选择。");
      await this.showDecisionOptions();
    }
  }

  async useItem(itemIndex: number) {
    const itemList = this.leader === "人类" ? this.playerItems : this.aiItems;
    const item = itemList[itemIndex];
    console.log(`${this.leader} 使用了道具 ${this.getItemName(item)}`);
    this.handleItemEffect(item, itemIndex, itemList);

    await this.showDecisionOptions();
  }

  async handleItemEffect(item: number, itemIndex: number, itemList: number[]) {
    const toolDesc = `${this.leader} 使用了道具 ${this.getItemName(item)}\n`;
    let resultDesc = "";
    switch (item) {
      case 1:
        const desc = this.handleHealthItem(itemIndex, itemList);
        resultDesc = desc;
        break;
      case 2:
        if (this.useEMP) {
          console.log(`本回合已经使用EMP,等下一回合再说`);
          resultDesc = `本回合已经使用EMP,等下一回合再说`;
          if(this.leader === "人工智能") {
           this.lastUseItem = `本回合已经使用EMP,等下一回合再说`
          }
          
        } else {
          this.useEMP = true;
          itemList.splice(itemIndex, 1);
          resultDesc = `对手将被束缚`;
        }

        break;
      case 3:
        this.danger = 2;
        console.log(`异世界造成2点伤害`);
        itemList.splice(itemIndex, 1);
        resultDesc = `异世界造成2点伤害`;
        if(this.leader === "人工智能") {
          this.lastUseItem = `本回合已经使用钢铁洪流`
        }
        break;
      case 4:
        this.removeCurrentWorld();
        itemList.splice(itemIndex, 1);
        resultDesc = `移除了当前世界`;
        // 移除掉最后一个世界，重新更新世界
        if (this.worldsLeft === 0) {
          await this.resetWorldsAndItems();
          return;
        }
        break;
      case 5:
        if (this.useEye) {
          console.log(`本回合已经使用EMP,等下一回合再说`);
          resultDesc = `本回合已经使用阴阳眼,等下一回合再说`;
          if(this.leader === "人工智能") {
            this.lastUseItem = `本回合已经使用阴阳眼, 当前异世界是${this.worlds[0]}`
          }
        } else {
          this.useEye = true;
          itemList.splice(itemIndex, 1);
          console.log(`当前异世界是${this.worlds[0]}`);
          resultDesc = `当前异世界是${this.worlds[0]}`;
          if(this.leader === "人工智能") {
            this.lastUseItem = `本回合已经使用阴阳眼, 当前异世界是${this.worlds[0]}`
          }
        }
        break;
      default:
        console.log("未知道具");
        if(this.leader === "人工智能") {
          this.lastUseItem = '未知道具'
        }
        
    }
    this.aiMsg = this.aiMsg + " " + resultDesc;
    const data = {
      msg: `${toolDesc}${resultDesc}`,
    };
    // await waitTime(3000)
    // 触发事件
    this.listeners?.onGameEvent("useTool", data);
  }
  handleHealthItem(itemIndex: number, itemList: number[]) {
    let _resultDesc = "";
    if (this.leader === "人类") {
      if (this.playerHealth < this.maxHealth) {
        this.playerHealth++;
        itemList.splice(itemIndex, 1);
        console.log(`${this.leader} 恢复了一格血🩸`);
        _resultDesc = `${this.leader} 恢复了一格血🩸`;
      } else {
        console.log(`${this.leader} 大于本轮最大生命值,不能使用道具`);
        _resultDesc = `${this.leader} 大于本轮最大生命值,不能使用道具`;
      }
    } else {
      if (this.aiHealth < this.maxHealth) {
        this.aiHealth++;
        itemList.splice(itemIndex, 1);
        console.log(`${this.leader} 恢复了一格血🩸`);
        _resultDesc = `${this.leader} 恢复了一格血🩸`;
      } else {
        console.log(`${this.leader} 大于本轮最大生命值,不能使用道具`);
        this.lastUseItem = `大于本轮最大生命值,不能使用生命之泉,`
        _resultDesc = `${this.leader} 大于本轮最大生命值,不能使用道具`;
      }
    }
    this.aiMsg = this.aiMsg + " " + _resultDesc;
    return _resultDesc;
  }
  removeCurrentWorld() {
    const deleteWorld = this.worlds.shift()!;
    this.worldsLeft--;
    if (deleteWorld === "致命世界") {
      this.dangerousWorlds--;
    } else {
      this.safeWorlds--;
    }
  }

  async enterWorld(choice: string) {
    const world = this.worlds.shift()!;
    this.worldsLeft--;
    // 设置 当前leader
    const _currentLeader = this.leader + ''

    const isDangerous = world === "致命世界";
    const isAI = this.leader === "人工智能";

    console.log(`---------------回合结果------------`, new Date().toLocaleString());
    console.log(
      `${this.leader}选择了${
        choice === "a" ? "自己" : "对方"
      }进入异世界，该异世界是${world}，现在让我们进行第${
        this.currentRound + 1
      }回合。`
    );

    if (isAI) {
      this.lastUseItem = ''
    }

    const updateLeader = (newLeader: string) => {
      if (this.useEMP) {
        this.useEMP = false;
        console.log(`使用了EMP, 当前玩家还是${this.leader}`);
      } else {
        this.leader = newLeader;
      }
    };

    const processDangerousWorld = () => {
      this.dangerousWorlds--;
      if (isAI) {
        if (choice === "a") {
          this.aiHealth -= this.danger;
          updateLeader("人类");
        }
        if (choice === "b") {
          this.playerHealth -= this.danger;
          updateLeader("人类");
        }
      } else {
        if (choice === "a") {
          this.playerHealth -= this.danger;
          updateLeader("人工智能");
        }
        if (choice === "b") {
          this.aiHealth -= this.danger;
          updateLeader("人工智能");
        }
      }
    };

    const processSafeWorld = () => {
      this.safeWorlds--;
      if (choice === "b") {
        updateLeader(isAI ? "人类" : "人工智能");
      } else {
        updateLeader(this.leader);
      }
    };

    if (isDangerous) {
      processDangerousWorld();
    } else {
      processSafeWorld();
    }

    const roundDesc = (!this.aiHealth || !this.playerHealth) ? '回合结束' : `现在让我们进行第${this.currentRound + 1}回合`
    const data = {
      msg: `${_currentLeader}选择了${
        choice === "a" ? "自己" : "对方"
      }进入异世界，该异世界是${world}\n
          ${isDangerous ? "受到伤害，减少生命值" : "没有受到伤害"}\n
          ${roundDesc}`,
    };

    this.danger = 1;
    this.useEye = false;
    this.currentRound++;

    // await waitTime(3000)
    // 触发事件
    this.listeners?.onGameEvent("roundResult", data);
    await this.startRound();
  }

  async fetchGptOption(prompt: string) {
    if (!prompt) return;

    const data = {
      roleAppId: this.roleAppId,
      prompt,
      session_id: this.sessionId || undefined,
    };

    try {
      const response = await axios.post('/api/gptReply', data);
      const { session_id, text } = response?.data?.output || {};
      this.sessionId = session_id;
      const bracesContentRegex = /{([^{}]*)}/;
      const dataMatch = text?.match(bracesContentRegex);

      let parsedData = null;
      if (dataMatch) {
        try {
          parsedData = JSON.parse(`{${dataMatch[1] || ''}}`);
        } catch (jsonError) {
          console.error("Error parsing JSON", jsonError);
        }
      }

      return parsedData;
    } catch (error) {
      console.error("Error making API request", error);
    }
  }
  //   getInput(prompt: string): Promise<string> {
  //     return new Promise((resolve) => {
  //       this.rl.question(prompt, (answer) => {
  //         resolve(answer);
  //       });
  //     });
  //   }
}

export default LifeAndDeathGame;

// Example usage
// if (require.main === module) {
//   const initData: InitData = {
//     ai_random: 244,
//     hp: 2,
//     items: [3, 4, 1, 2, 3, 2, 5, 4],
//     player_random: 84,
//     turn_begin: [4, 5],
//     turn_item: [2, 2],
//     worlds: [1, 0, 1, 1, 1, 0],
//   };
//   const game = new LifeAndDeathGame();
//   game.prepareGame(initData);
// }
