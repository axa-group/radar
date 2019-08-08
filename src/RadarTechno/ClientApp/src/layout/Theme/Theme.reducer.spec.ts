import { TOGGLE_DARK_THEME } from "./Theme.constants";
import { themeReducer } from "./Theme.reducer";

describe('Theme reducer test', () => {
  
  test('default action', () => {
    const result = themeReducer({darkTheme: false}, {type: 'UNKNOWN'});
    expect(result).toEqual({darkTheme: false});
  });

  test('TOGGLE_DARK_THEME action', () => {
    const result = themeReducer({darkTheme: false}, {type: TOGGLE_DARK_THEME});
    expect(result).toEqual({darkTheme: true});
  });
});
