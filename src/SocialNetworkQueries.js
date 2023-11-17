export class SocialNetworkQueries {
  user;
  
  constructor({ fetchCurrentUser }) {
    this.fetchCurrentUser = fetchCurrentUser;
  }
  
  async findPotentialLikes(minimalScore) {
    let potentialLikes = []
    let books = [];

    try {
      this.user = await this.fetchCurrentUser();
    } catch (error) { }

    if (!this.user) return books;

    const friends = this.user.friends;

    if (!friends) return books;

    friends.forEach(friend => {
      if (!friend.likes) return;
      const friendLikes = [...new Set(friend.likes)];
      friendLikes.forEach(friendLike => {
        if (this.user.likes && !this.user.likes.includes(friendLike)) {
          const potentialLike = potentialLikes.find(pl => pl.name === friendLike)
          if (potentialLike) {
            potentialLike.likes++
          } else {
            potentialLikes.push({ name: friendLike, likes: 1 })
          }
        }
      })
    });

    const minimumFriendsLikes = friends.length * minimalScore

    books = potentialLikes
      .filter(pl => pl.likes > minimumFriendsLikes)
      .sort((a, b) => {
        if (a.likes === b.likes) {
          return a.name > b.name ? 1 : -1;
        }
        return b.likes - a.likes;
      })
      .map(pl => pl.name);

    return books;
  }
}
