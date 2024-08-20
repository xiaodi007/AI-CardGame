import axios from "axios";

export const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

// 增加或减少用户积分的函数
export async function updateUserPoints(user, points) {
  try {
      const response = await axios.post('/api/points', {
          user,
          points,
      });
      console.log('Updated user points:', response.data);
  } catch (error) {
      console.error('Error updating user points:', error);
  }
}

// 获取排行榜和当前用户积分的函数
export  async function getLeaderboard(user) {
  try {
    let _url = ''
    if (user === ''){
      _url = (`/api/leaderboard/null`);
    } else {
      _url = (`/api/leaderboard/${user}`);
    }
    const response = await axios.get(_url)
      
      // 使用析构语法返回数据
      const { top10, userPoints } = response.data;
      return { top10, userPoints };
  } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return null;  // 错误时返回null
  }
}