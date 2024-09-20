# Industry Icons

## Gameplay goals
This game starts simply -- it's a mining game, and you can start as a single miner in a single area. As you progress and gain XP, you'll be able to hire out the work and create a company if you'd like. Look for workers, gain passive XP gold, and resources. Setup supply chains, market chains, and both passive and active skilling and selling.

This game will sprall over many map chunks and will involve invention (including actual code block building for custom scripting) and custom graphics and skins for all to see (similar to Animal Crossing New Horizons). Since this game's mechanics should be relatively simple (Ha! I say that now...) it should be possible for servers to contain many players in some capacity.

I'd love to also include land ownership and resource management (sort of like Stardew valley, but with more player control). I'd also love for most of the items and a lot of the mechanics and inventions of the game to be player driven and created via resources in the games (like Eve online).

## How we're going to make it

### The high-view
Most interactions we're going to start with one tenant: keep it simple. I want the mechanics to be simple but enjoyable in the game to try to reduce production and coding time. The server itself will play a critical role in the game, running all the logic via a mix of websockets, client to client interactions (over TCP for trading), and simple REST calls. All of these will start being handled by one server via separate handlers so we can break apart the logic later as needed.

### More specifics
Our express server will handle an initial authorization. It'll handle this via a JWT token and some form of login system @TODO: (Solve which method we'll use).

After a user has logged in, it'll submit that token in the header of the websocket establish connection. If the token is valid the server will open the socket and the client will start to send various messages. We'll have a list of message types we support and each type of message will go to a separate handler (again for scalability if we need to pull pieces apart -- I don't want coupling between parts unless necessary).

After the user tunnels to the server and sends the message, the server will give it to the handler and return a response. The client will be aware of what to do with those responses and will alter the game logic accordingly.

Upon a succesful connection, the server will persist the connection into the `connections` DB and associate the connection with a userID and the connection ID for the socket (don't know how to get that yet, have to read some docs) to navigate a reconnect in the case of a websocket crash. This DB will purgue records older than an hour so we can keep the DB pruned of inactive connections. 

#### Account Safety
We WILL persist a log of the PCs that have accessed a player's account along with the time, IP address, and any basic system info we can pull from the HTTP request. This will be kept for account auditing purposes.

Along with this basic info, we'll associate an ID for each historical session with the connection that made the request for import game events like banking, selling, collecting items, and trading. This should server as a reasonable way to audit player activity in the event of a hack or loss of account. (Even though realistically I'm probably the only one that will ever play this thing).

#### Movement
- The player sends a `move` request to the server. This includes: 
  - Current location, as [x,y] on the local grid
  - Where they'd like to go to, as [x,y] on the local grid
  - CharacterID for the character to move
    - the userID will be pulled from the connection session
- The server verifies the location is valid, the walking speed of the character, the characterID.
- The server sets a timer for walk time based on distance traveled and lets the client handle the specific rendering of the actions on its own.
- The server sends a `move` command back to the user's client and permits or denies the action.
- The client moves the player

```ts
req = {
  requestType: 'move'
  currLocation: [1,3],
  targetLocation: [45,65],
  characterID: 'foobarbuzz'
}
```

```ts
res = {
  commandType: 'move',
  currLocation: [1,3],
  targetLocation: [45,65],
  characterID: 'foobarbuzz',
  actionApproved: true
}
```

#### Mining
The mining flow will work like this, assuming a valid connection to a websocket with the server:

For the sake of readability here, I'm going to refer to client messages and requests and server messages as commands. They're technically messages in websockets, but the web dev in me doesn't like that term.
- The player will send a `mine` request.
- Once the character is close enough to interact with the item nearby, the game server will give a `collision` command with the item ID from the game's perpective.
- The client will handle this with the colliders its tracking client side.
- The player will respond to that message with a `mining` request.
- The server will verify the miner's position, miner's mining amount, the rarity of the ore, the type of the ore, and the capacity of the ore
- After verifying the request, the player will receive an `inventory` command and the ore will be added to the player's inventory array in memory on the server at the same time. Every 10 inventory commands we will persist to the inventory DB OR on every inventory request for ultra rare resources or any item drops outside of `trash` and `common`.
  - This is maintain the player's inventory in case of game crashes or connection loss.
- The server will start a timer for the mining action and the player will receive their mining amount at a tick rate equal to their mining speed.
  - This speed will be calculated based on their items (if any), level, and a difficulty multiplier for the rock.
- Once the ore is depleted or the player sends a message to request moving or other actions that would disrupt the flow, the rock will be depleted and a `resource_depleted` message will be sent, notifying the client to remove that ore at that position.
- The server will handle respawn timers.

### Sidenotes:
Initally we won't have a physics engine running on the server because the rendering package we use (excalibur) for the game doesn't support headless mode for a physics-only game in node *yet*. **TM

With this limitation it does mean we're going to have a bit of trouble managing collisions and player interactions in a same and non-cheatable way. This will need to be some sort of custom logic or we can run an alternative server for physics in the server (like phaser with a browser shim) or something with a bit more power. I think this would be possible if we then convert the gamelogic into a JSON format that can be consumed by the client to show the locations of all the world objects that need to move. Static assets (rocks and resources) can be given an initial position in the game's loader and only updated when new rocks spawn or something changes.

This would be a lot of packages, but that's probably gaming, right?