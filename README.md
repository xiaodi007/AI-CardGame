# Doomsday Protocol: Rebirth in Another World
[中文](https://github.com/xiaodi007/AI-CardGame/blob/main/README-zh.md)

Welcome to **Doomsday Protocol: Rebirth in Another World**!

This is a highly challenging and strategic card battle game, inspired by the classic "Buckshot Roulette" and built using the Move Sui programming language along with Sui's latest random modules. Every game offers a new experience, as all game elements—from the initial environment to your hand of cards and health points—are randomly generated. The current game mode is player versus AI, making each match a unique challenge.

### Game Overview

In *Doomsday Protocol: Rebirth in Another World*, your goal is to use various item cards to defeat your opponent in randomly generated otherworlds. At the start of each game, the system uses smart contracts to generate and configure the game environment, including the number of “Lethal Worlds” and “Safe Worlds,” as well as the initial health points for both sides. Your task is to use your cards wisely, making strategic decisions each turn to reduce your opponent's health until one side reaches zero.

### Lethal Worlds and Safe Worlds

- **Lethal World**: Entering this world will reduce your health by 1 point. This world is full of danger.
- **Safe World**: Entering this world does not reduce your health, and you will gain the initiative for the next turn.

At the beginning of each round, the system will generate the number of “Lethal Worlds” and “Safe Worlds,” but their sequence is unknown. You need to make limited inferences using the tools and probability at your disposal to determine which world you are about to enter. Entering a Lethal World will reduce your health, so each choice is a strategic gamble.

### Game Rules

#### Health Rules
- At the start of the game, both sides have the same initial health, ranging from 1 to 4.
- During the game, you can use the "Fountain of Life" item to increase your health by 1 point unless your health is already full.
- If your opponent enters a Lethal World, their health will decrease by 1 point. If you use the "Iron Torrent" item, the damage from the Lethal World will double, reducing health by 2 points.

#### Item Rules
- At the start of the game, you will be given 4 random items. Each item has a unique effect, and you need to use them wisely based on the current situation and your opponent’s status.
- The 5 types of items and their effects are:
  - **Fountain of Life**: Increases your health by 1 point (unless your health is full).
  - **EMP**: Grants you the initiative for the next turn, allowing you to go first.
  - **Iron Torrent**: Doubles the damage from the Lethal World in the current round.
  - **Format**: Clears the current otherworld, immediately moving to the next one (Lethal or Safe).
  - **Yin-Yang Eye**: Reveals whether the current otherworld is Lethal or Safe.
- You must have the initiative to use items, and using items does not end your turn. You can use multiple items in one turn to create the best effect.

### Strategy Tips
- At the beginning of each round, assess your health, your opponent’s health, available items, and known otherworld information to develop the best strategy to suppress your opponent.
- Based on your character’s traits (smart but ruthless), aim not only to physically weaken your opponent’s health but also to apply psychological pressure.
- When you have the initiative, take full advantage of item combinations, such as using "Yin-Yang Eye" to identify the world type before using "Iron Torrent" to maximize damage.
- If the situation is unfavorable, use the "EMP" item to regain the initiative, and try to turn the tide by using the "Format" item to reconfigure the otherworlds.

### Points System
For every victory against the AI, you will earn 100 points, while a loss will cost you 100 points. If your points are insufficient, the game will call the Bucket Protocol's swapin interface to exchange USDC for Bucket points (1 USDC equals 100 points), ensuring you can continue participating in the game.

### Game Features
One of the game's standout features is that the AI opponents are driven by GPT-like agents with unique personalities. These agents generate different strategies and dialogue based on the game’s current environment, ensuring that every match feels fresh and challenging.

We believe that *Doomsday Protocol: Rebirth in Another World* will be your go-to game for strategic battles. Dive in and experience it today!

### AI Characters
The game features six AI characters (based on the qwen-max model), each with different strategic preferences:
- Sima Yi
- Batman
- Sherlock Holmes
- Kazama Asuka
- Qin Shi Huang
- Joker

## Advantages

1. **Randomness and Replayability**:
   - **Random Game Data**: Utilizing the Random module, different random data is generated at the start of each game, making every match unique. Players won't feel repetitive or bored, enhancing the game's replayability.
   - **Dynamic Environment**: The randomly generated world settings, items, and initial conditions keep the game environment constantly changing, requiring players to continually adapt their strategies to face new challenges.

2. **Blockchain Technology**:
   - **Fairness and Transparency**: Smart contracts are used to generate game data, ensuring fairness and transparency.

3. **Enhanced Strategy**:
   - **Diverse Decisions**: Players can make various strategic decisions using items, adding depth and strategy to the game.
   - **AI Battles**: Battles against AI opponents add an extra layer of challenge, requiring players to use their wits and strategies to defeat them.

## Future Development and Market

1. **Points Redemption**:
   - Game coins can be used to participate in special events or tournaments. These points can be redeemed for various rewards, NFTs, and merchandise, but not for purchasing cards and equipment, ensuring game balance.

2. **NFT Trading**:
   - Rare cards, equipment, and skins are issued in the form of NFTs, which players can freely trade in the built-in market, with the platform charging transaction fees.

3. **Battle System**:
   - Players can battle against other players, earning or losing points based on the outcome. Points can be used for rankings and rewards.

4. **AI Battles**:
   - Players can create and train AI characters, allowing other players to challenge them and earn points.

5. **AI Character Trading**:
   - AI characters can also be traded, with the platform charging transaction fees.