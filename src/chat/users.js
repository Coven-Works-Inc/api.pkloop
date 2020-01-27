const users = []

const addUser = ({id, name, room}) => {
    const existingUser = users.find((user) => user.name === name && user.room === room)
    if(existingUser){
        return { error: 'Username is taken'}
    }
    const user = { id, name, room }
    users.push(user)
    console.log(users)
    return { user }
}

const getUser = (id) => users.find((user) => user.id === id)
module.exports = { addUser, getUser}