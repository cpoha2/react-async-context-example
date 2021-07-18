import {useEffect, useReducer} from 'react';

type UserAttrs = {
  gender?: string;
  name?: string;
  country?: string;
  email?: string;
};

type UserState = {
  loading: boolean;
  error: string | null;
  data: UserAttrs;
};

enum ActionType {
  FETCH_USER = 'fetch_user',
  FETCH_USER_SUCCESS = 'fetch_user_success',
  FETCH_USER_ERROR = 'fetch_user_error',
}

type Action =
  | {type: ActionType.FETCH_USER}
  | {
      type: ActionType.FETCH_USER_SUCCESS;
      payload: Required<UserAttrs>;
    }
  | {type: ActionType.FETCH_USER_ERROR; payload: string};

function reducer(_state: UserState, action: Action): UserState {
  switch (action.type) {
    case ActionType.FETCH_USER: {
      return {loading: true, error: null, data: {}};
    }
    case ActionType.FETCH_USER_SUCCESS: {
      return {loading: false, error: null, data: action.payload};
    }
    case ActionType.FETCH_USER_ERROR: {
      return {loading: false, error: action.payload, data: {}};
    }
    default: {
      throw new Error(`Unhandled action type - ${JSON.stringify(action)}`);
    }
  }
}

function App() {
  const [{loading, error, data}, dispatch] = useReducer(reducer, {
    loading: false,
    error: null,
    data: {},
  });

  useEffect(() => {
    const fetchUser = async () => {
      console.log ('start useEffect');
      dispatch({type: ActionType.FETCH_USER});
      try {
        const res = await fetch('https://randomuser.me/api/');
        const parsed = (await res.json()) as {
          results: [
            {
              gender: string;
              name: {first: string};
              location: {country: string};
              email: string;
            },
          ];
        };
        console.log("about to parse results and dispatch success");
        const user = parsed.results[0];
        console.log(user);
        dispatch({
          type: ActionType.FETCH_USER_SUCCESS,
          payload: {
            gender: user.gender,
            name: user.name.first,
            country: user.location.country,
            email: user.email,
          },
        });
      } catch (error) {
        if (error instanceof Error) {
          console.log("error 1");
          dispatch({type: ActionType.FETCH_USER_ERROR, payload: error.message});
        } else {
          console.log("error 2");
          dispatch({
            type: ActionType.FETCH_USER_ERROR,
            payload: 'Something went wrong',
          });
        }
      }
    };

    fetchUser();
    console.log("fetched user at end of useEffect");
  }, []);

  return (
    <div>
      {loading && <h3>Loading...</h3>}
      {error && <h1 style={{color: 'red'}}>{error}</h1>}
      <h1>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </h1>
    </div>
  );
}

export default App;