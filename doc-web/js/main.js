// 语言数据
const languages = {
    zh: {
      "nav": {
        "logo": "末日协议",
        "overview": "游戏概览",
        "gameplay": "玩法介绍",
        "cards": "卡牌展示",
        "ai": "AI 竞技",
        "contact": "Github 链接"
      },
      "banner": {
        "title": "在随机世界中，决策成就胜利",
        "subtitle": "AI赋能的终极卡牌对战体验",
        "subtitle1": "基于Sui进行开发",
        "cta": "立即加入"
      },
      "overview": {
        "title": "游戏概览",
        "subtitle": "玩家的目标是通过使用各种道具卡牌，在随机生成的异世界中击败对手。游戏开始时，系统会生成“致命世界”和“安全世界”的数量，但它们的顺序是未知的。你需要通过手中的道具和概率进行有限推理，来判断你将进入的是哪个世界。进入致命世界将扣除你的生命值。你的任务是利用手中的卡牌，在每个回合中做出最佳决策，以削弱对手的血量，直到一方血量归零。",
        "feature1": "随机生成的世界",
        "feature1_desc": "每一场对决都在不同的世界中展开，充满未知与挑战。通过 Move Sui 编程语言和 Sui 最新的Random模块进行构建, 生成真随机数",
        "feature2": "AI 智能对手",
        "feature2_desc": "AI 自动生成的对手带来智能化的策略挑战",
        "feature3": "集成WALRUS",
        "feature3_desc": "与AI对战数据将存储在Walrus上,以训练更强的AI",
        "feature4": "积分系统",
        "feature4_desc": "与Bucket Protocol集成, 当积分不足时, 自动兑换USDC为BUCK, 转化为游戏积分继续游玩"
      },
      "gameplay": {
        "title": "玩法介绍",
        "description": "通过使用五种独特的卡牌类型，你将运用智慧和策略战胜对手...",
        "intro": "界面介绍"
      },
      "ai": {
        "title": "AI 竞技",
        "description": "我们的 AI 对手经过精心训练，能够预测并对抗玩家的策略. 游戏预设了六个AI角色(qwen-max模型), 每个角色都有不同的策略偏好:司马懿\n蝙蝠侠\n福尔摩斯\n风间飞鸟\n秦始皇\nJoker"
      },
      "footer": {
        "text": "&copy; 2024 末日协议. 保留所有权利。"
      }
    },
    en: {
      "nav": {
        "logo": "Doomsday Protocol",
        "overview": "Overview",
        "gameplay": "Gameplay",
        "cards": "Cards",
        "ai": "AI Battle",
        "contact": "Github Link"
      },
      "banner": {
        "title": "In Random Worlds, Decisions Lead to Victory",
        "subtitle": "AI-Powered Ultimate Card Battle Experience",
        "subtitle1": "build on top of Sui",
        "cta": "Join Now"
      },
      "overview": {
        "title": "Game Overview",
        "subtitle": "Your goal is to use various item cards to defeat your opponent in randomly generated otherworlds. At the beginning of each round, the system will generate the number of “Lethal Worlds” and “Safe Worlds,” but their sequence is unknown. You need to make limited inferences using the tools and probability at your disposal to determine which world you are about to enter. Entering a Lethal World will reduce your health. Your task is to use your cards wisely, making strategic decisions each turn to reduce your opponent's health until one side reaches zero.",
        "feature1": "Randomly Generated Worlds",
        "feature1_desc": "Each match is set in a different world, filled with unknown challenges. Built using the Move Sui programming language along with Sui's latest random modules, generated real random numbers",
        "feature2": "AI Smart Opponent",
        "feature2_desc": "AI-generated opponents offer smart and tactical challenges.",
        "feature3": "Integrated with WALRUS",
        "feature3_desc": "Battle data from AI matches will be stored on Walrus to train stronger AI.",
        "feature4": "reward system",
        "feature4_desc": "Integrate with the Bucket Protocol, and when points are insufficient, automatically exchange USDC for BUCK, converting it into game points to continue playing."
      },
      "gameplay": {
        "title": "Gameplay",
        "description": "Using five unique card types, you will outsmart and defeat your opponent...",
        "intro": "interface intro"
      },
      "ai": {
        "title": "AI Battle",
        "description": "Our AI opponents are well-trained and can predict and counter your strategies. The game features six AI characters (based on the qwen-max model), each with different strategic preferences: Sima Yi \n Batman \n Sherlock Holmes \n Kazama Asuka \n Qin Shi Huang \n Joker"
      },
      "footer": {
        "text": "&copy; 2024 Doomsday Protocol. All rights reserved."
      }
    }
  };

  // 卡牌数据（图片 URL 和介绍文本）
const cardsData = [
    {
      image: 'images/1.png', // 替换为卡牌的实际图片路径
      name: 'Fountain of Life',
      description: {
        zh: '生命之泉: 增加1点血量(除非血量已满)',
        en: 'Fountain of Life: Increases your health by 1 point (unless your health is full).'
      }
    },
    {
      image: 'images/2.png',
      name: 'EMP',
      description: {
        zh: 'EMP: 使你成为下一回合的主导方, 抢得先手',
        en: 'EMP: Grants you the initiative for the next turn, allowing you to go first.'
      }
    },
    {
      image: 'images/3.png',
      name: 'Iron Torrent',
      description: {
        zh: '钢铁洪流: 使本轮致命世界的伤害翻倍',
        en: 'Iron Torrent: Doubles the damage from the Lethal World in the current round.'
      }
    },
    {
      image: 'images/4.png',
      name: 'Format',
      description: {
        zh: '格式化: 清除当前的异世界, 立即进入下一个世界(致命或安全)',
        en: 'Format: Clears the current otherworld, immediately moving to the next one (Lethal or Safe).'
      }
    },
    {
      image: 'images/5.png',
      name: 'Yin-Yang Eye',
      description: {
        zh: '阴阳眼: 查看当前异世界是致命世界还是安全世界',
        en: 'Yin-Yang Eye: Reveals whether the current otherworld is Lethal or Safe.'
      }
    }
  ];

  
  
  // 定义默认语言
  let currentLang = 'zh';
  

  // 动态加载卡牌数据
function loadCards(lang) {
    const cardContainer = document.getElementById('card-container');
    cardContainer.innerHTML = ''; // 清空之前的卡牌内容
  
    cardsData.forEach(card => {
      // 创建卡片元素
      const cardElement = document.createElement('div');
      cardElement.classList.add('card');
  
      // 卡牌图片
      const cardImage = document.createElement('img');
      cardImage.src = card.image;
      cardImage.alt = card.name;
  
      // 卡牌名称
      const cardName = document.createElement('h3');
      cardName.textContent = card.name;
  
      // 卡牌描述
      const cardDescription = document.createElement('p');
      cardDescription.textContent = card.description[lang];
  
      // 将图片、名称和描述添加到卡片元素中
      cardElement.appendChild(cardImage);
      cardElement.appendChild(cardName);
      cardElement.appendChild(cardDescription);
  
      // 将卡片添加到卡牌容器中
      cardContainer.appendChild(cardElement);
    });
  }

  // 动态更新语言切换按钮的激活状态
function updateActiveButton() {
    document.querySelectorAll('.language-switch button').forEach(button => {
      button.classList.remove('active'); // 移除所有按钮的 active 类
    });
    if (currentLang === 'zh') {
      document.getElementById('zh-btn').classList.add('active');
    } else {
      document.getElementById('en-btn').classList.add('active');
    }
  }

  // 加载语言数据并更新页面内容
  function loadLanguage(lang) {
    const data = languages[lang];
    document.querySelectorAll('[data-translate]').forEach(element => {
      const key = element.getAttribute('data-translate');
      element.textContent = getNestedValue(data, key);
    });
  }
  
  
  // 获取嵌套对象值的函数
  function getNestedValue(obj, key) {
    return key.split('.').reduce((acc, part) => acc && acc[part], obj);
  }
  
  // 切换语言事件监听器
  document.getElementById('zh-btn').addEventListener('click', () => {
    currentLang = 'zh';
    loadLanguage(currentLang);
    loadCards(currentLang); // 加载中文卡牌描述
    updateActiveButton(); // 更新按钮状态
  });
  
  document.getElementById('en-btn').addEventListener('click', () => {
    currentLang = 'en';
    loadLanguage(currentLang);
    loadCards(currentLang); // 加载中文卡牌描述
    updateActiveButton(); // 更新按钮状态
  });
  
  // 页面初始加载时调用
  window.onload = function () {
    loadLanguage(currentLang);
    loadCards(currentLang); // 加载中文卡牌描述
    updateActiveButton(); // 更新按钮状态
  };
  
// 获取模态框
const modal = document.getElementById('modal');

// 获取模态框中的图片元素
const expandedImg = document.getElementById('expanded-img');

// 获取缩略图图片
const thumbnails = document.querySelectorAll('.thumbnail');

// 获取关闭按钮
const closeButton = document.querySelector('.close');

// 显示模态框并显示对应大图
thumbnails.forEach((thumbnail) => {
  thumbnail.addEventListener('click', (event) => {
    modal.style.display = 'flex'; // 显示模态框
    expandedImg.src = event.target.src; // 加载被点击的图片
  });
});

// 点击关闭按钮关闭模态框
closeButton.addEventListener('click', () => {
  modal.style.display = 'none';
});

// 点击模态框外部区域关闭模态框
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

  