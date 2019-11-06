import VKService from './vkService';

class Loader {

  CreateTable(recentPostsCount, setTableData) {
    const vkService = new VKService();
    let getLikesStatisticsPromise = vkService.GetWallPostsID(recentPostsCount)
      .then((postsID) => this.getLikesStatistics(postsID)).catch(e => console.error(e));

    let getFriendsPromise = vkService.GetFriendsData();
    Promise.all([getLikesStatisticsPromise, getFriendsPromise]).then((response) => {
      setTableData(this.getTableData(response, recentPostsCount))
    }).catch(e => console.error(e));
  }

  getLikesStatistics = (postsID) => {
    const vkService = new VKService();
    let vkAPICallPromise = postsID.map((postID) => vkService.GetLikesID(postID));
    return Promise.all(vkAPICallPromise).then((response) => this.setLikesStatistics(response)).catch(e => console.error(e));
  }

  setLikesStatistics(response) {
    let tempLikesStatistics = {};
    const likesID = response.flat();
    likesID.forEach((id) => {
      if (tempLikesStatistics[id] === undefined) {
        tempLikesStatistics[id] = 1;
      } else {
        tempLikesStatistics[id]++;
      }
    });
    
    return tempLikesStatistics;
  }

  getTableData(response, recentPostsCount) {
    const likesStatistics = response[0];
    const friendsData = response[1];
    let tableData = Object.keys(likesStatistics).map((userID) => {
      return ({
        photo: friendsData[userID].photo,
        name: friendsData[userID].name,
        statistics: likesStatistics[userID] + '/' + recentPostsCount
      })
    });

    return tableData;
  }
}

export default Loader;