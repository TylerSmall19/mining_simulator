const API_ROUTES = {
  player: {
    create: `${process.env.REACT_APP_API_ROOT_DOMAIN}/players/`
  }
}

const createPlayer = async (playerParams: { playerName: string }) => {
  const { playerName } = playerParams;

  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer eyabasdlwenlasdcklawef.nakiqernkasdcklmasg.faketoken");
    const req = new Request(API_ROUTES.player.create, {
      method: 'post',
      body: JSON.stringify({
        playerName
      }),
      headers
    });

    const response = await fetch(req);
    if (!response.ok) {
      console.error(await response.json() || 'Something went wrong with your request', response);
      throw new Error(`Response status: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error(error.message);
  }
}

export const ApiUtility = {
  createPlayer
}