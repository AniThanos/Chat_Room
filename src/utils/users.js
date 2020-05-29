const users = [];

const addUser = ({id, username, room}) => {
    // clean data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();
  // validate username and room
    if (!username || !room ) {
        return {
            'error': 'Username and Room are required'
        };
    }

    // validate existing user
    const existingUser = users.find((user)=>{
        return user.username === username && user.room === room;
    });

    if (existingUser) {
        return {
            error: 'Username is in use'
        };
    }

    const user = {id, username, room};
    users.push(user);
    return {user};
};

const removeUser = (id) => {
    const index= users.findIndex((user)=> user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};


const getUser = (id) => {
    const user = users.find((user)=>user.id === id);
    return user;
};


const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase();
    const userList = users.filter((user)=>user.room === room);
    return userList;
};

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
};
