const VK = window.VK;
class VKService {
    Login(setUserID) {
        VK.Auth.login((response) => setUserID(response.session.mid));
    }

    GetUserData(id, setUserData) {
        VK.Api.call('users.get', {
            user_ids: id,
            v: "5.102",
            fields: "photo_100"
        }, (r) => setUserData(r.response[0].first_name, r.response[0].last_name, r.response[0].photo_100 ));
    }

    GetWallPostsID(recentPostsCount) {
        return new Promise((resolve) => {
            VK.Api.call('wall.get', {
                filter: 'owner',
                count: recentPostsCount,
                v: '5.102'
            }, (r) => {
                resolve(this.makeWallPostsID(r));
            })
        })
    }

    makeWallPostsID = (r) => {
        return r.response.items.map((item) => item.id);
    }

    GetFriendsData() {
        return new Promise((resolve) => {
            VK.Api.call('friends.get', {
                fields: 'photo_50',
                v: '5.102'
            }, (r) => {
                resolve(this.makeFriendsData(r))
            })
        })
    }

    makeFriendsData = (r) => {
        let tempFriendsData = {};
        r.response.items.forEach(friendInfo => {
            tempFriendsData[friendInfo.id] = {
                name: friendInfo.first_name + " " + friendInfo.last_name,
                photo: friendInfo.photo_50
            }
        })
        return tempFriendsData;
    }

    GetLikesID(postID) {
        return new Promise((resolve) => {
            VK.Api.call('likes.getList', {
                friends_only: 1,
                item_id: postID,
                type: 'post',
                v: '5.102'
            }, (r) => {
                resolve(this.makeLikesID(r));                
            });
        })
    }

    makeLikesID = (r) => {
        return r.response.items;
    }
}

export default VKService;