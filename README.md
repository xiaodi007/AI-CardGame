# Doomsday Protocol: Rebirth in Another World
[中文](https://github.com/xiaodi007/random-x/blob/main/README-zh.md)
## Overview

This is a card battle game implemented using the Move programming language and the RandomX module for generating random game data. The game features a player versus AI combat system where players can utilize items and make strategic decisions to defeat their AI opponent. The game starts with generating random data for the game setup using a smart contract.

## Gameplay

"Doomsday Protocol: Rebirth in Another World" is a turn-based card game where players can choose to battle against AI or other players. The game is inspired by "Buckshot Roulette". At the start of each game, the system automatically configures the number of "Deadly Worlds" and "Safe Worlds" and randomly assigns initial health values (1, 2, 3, or 4) that are the same for both sides. Players use item cards to defeat each other in each randomly assigned alternate world until one player's health reaches zero. If both players still have health after the current alternate world is cleared, the system redistributes the worlds and item cards.

### Item
- Green Card: Restores 1 health point per use. Multiple uses per round are allowed but can only restore up to the initial health value for that round. Further uses are ineffective.
- Red Card: Deals double damage for the current round. Can be used once per round.
- Eye Card: Reveals the current world status. Can be used once per round.
- EMP Card: Grants priority choice in the next round. Can be used once per round.
- Purple Card: Devours the current world and moves to the next world. Can be used once per round.

### AI
It features six pre-set AI characters((qwen-max model)), each with a unique strategy preference:
- Default
- Joker
- King Zhou of Shang
- Lu Zhishen
- Sherlock Holmes
- Shinichi Kudo



## Advantages and Disadvantages

### Advantages

1. **Randomness and Replayability**:
   - **Random Game Data**: Each game starts with different random data generated by the RandomX module, making each game unique and preventing monotony.
   - **Dynamic Environment**: Randomly generated world settings, items, and initial conditions ensure a constantly changing game environment, requiring players to continuously adjust their strategies.

2. **Blockchain Technology**:
   - **Fairness and Transparency**: Using smart contracts to generate game data.

3. **Enhanced Strategy**:
   - **Diverse Decisions**: Players can use items, roll dice, and make various strategic decisions, adding depth and strategy to the game.
   - **AI Opponents**: Fighting against AI opponents adds challenge, requiring players to use wisdom and strategy to win.


4. **Rewards and Penalties (Future)**:
   - **Instant Settlement**: After the game, smart contracts can immediately distribute rewards or enforce penalties using Sui tokens or other cryptocurrencies, enhancing the immediacy of the gaming experience.
   - **Decentralized Economy**: Transactions and rewards between players can be achieved through the token system, establishing a decentralized game economy.


## Future Development Directions and Commercial

- Game Coin Exchange: 
  
    Players buy game coins for special events or competitions, ensuring balance.

- NFT Trading: 
  
    Rare cards, equipment, and skins issued as NFTs, freely tradable in the market.

- AI Character Trading: 

    Players can trade created and trained AI characters.

- Platform Fee: 

    Charged for each player and AI battle.

- Point Exchange: 

    Points earned from battles can be exchanged for NFTs and traded.

- Crypto Staking: 

    Exchanged cryptocurrencies can be staked for interest.

- Battle System: 

    Players compete against each other for points, influencing rankings and rewards.

- AI Battle: 

    Players create and train AI characters for others to challenge.


