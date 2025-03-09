

export const fetchSteamData = async () => {
  const steamAPIKey = 'B0A1B4177100A3259848063B69199FDC' //
  const steamId = '76561198271038475'; //Downloaded at login
  const userStatsURL = `/steam-api/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${steamAPIKey}&steamid=${steamId}&format=json`;
  try {
    const response = await fetch(userStatsURL);
    const data = await response.json();
    
    // const baseData = data.response.games;
    // const desiredData: Record<string, { name: string, totalPlaytime: number, recentPlaytime: number }>[] = [];
    // if (baseData) {
    //   baseData.map(({ appid, name, playtime_2weeks, playtime_forever }: { appid: number, name: string, playtime_forever: number, playtime_2weeks: number }) => {
    //     desiredData.push({ [appid]: { name, totalPlaytime: playtime_forever, recentPlaytime: playtime_2weeks } })

    //   })
    // }
    
    return data;
  } catch (error) {
    return `${error}`;
  }
};

export const fetchLatestReview = async (gameId: number): Promise<{ latestReview: string; score: number; }> => {
  const latestReviewURL = `/steam-store/appreviews/${gameId}?json=1`;
  // try {

    const response = await fetch(latestReviewURL);
    const data = await response.json();
    let latestReview;
    let score;
    if (data.reviews[0]) {
      latestReview = data.reviews[0].review;
      score = data.query_summary.review_score;
    }
    return { latestReview, score };
  // } catch (error) {
  //   return `${error}`;
  // }
}

export const fetchIMG = async (gameId: number) => {
  const imgURL = `/steam-store/api/appdetails?appids=${gameId}`;
  try {

    const response = await fetch(imgURL);
    const data = await response.json();
    let image;
    if (data[gameId] && data[gameId].data && data[gameId].data.capsule_image) {
      image = data[gameId].data.capsule_image
    }
    return image;
  } catch (error) {
    return `${error}`;
  }
}