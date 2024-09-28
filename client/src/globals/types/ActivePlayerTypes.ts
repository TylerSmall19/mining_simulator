export type Item = {
  name: string,
  itemLevel: number,
  itemDescription: string
  stats: {
    statName: string,
    affect: number,
    statDescription: string
  }[]
}

export type PlayerSkill = {
  name: 'mining',
  level: number,
  xp: number
}

export type Invetory = {
  items: Item[]
}

export type PlayerDetails = {
  skills: PlayerSkill[],
  characters: {
    _id: string,
    name: string,
    stats: {
      mining: {
        baseAmount: number,
        miningInterval: number
      }
    }
  }[],
  inventory: Invetory,
  _id: string,
  playerName: string
}