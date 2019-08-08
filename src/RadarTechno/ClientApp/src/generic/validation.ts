import Validate from 'mw.validation';

export function computeInitialStateErrorMessage(state, rules) {
  let newState = state;
  for (const propertyName of rules) {
    const input = state[propertyName];
    if (input && input instanceof Object) {
      const event = {
        target: {
          name: propertyName,
          value: input.value,
          viewValue: input.viewValue,
          values: input.values,
        },
      };
      newState = genericHandleChange(rules, state, event);
    }
  }
  return newState;
}

export function validate(rules, value) {
  const validationResult = Validate.validation.firstError(
    Validate.validation.validateView(value, rules),
  );

  return validationResult != null ? validationResult.message : null;
}

export function genericHandleChange(rules, state, event) {
  const { name, value, values, viewValue } = event;
  const inputRules = rules[name];
  const message = validate(inputRules, value);
  if (rules[name]) {
    if (values !== undefined) {
      // Le cas d'un champs qui possède des valeurs multiple
      return {
        ...state,
        [name]: {
          ...state[name],
          values,
        },
      };
    }
    if (event.viewValue !== undefined) {
      // Le cas d'un date par exemple on valide du text et non un objet date
      return {
        ...state,
        [name]: {
          ...state[name],
          value,
          viewValue,
          message,
        },
      };
    }
    // le cas le plus répandu, on valide une "value" simple
    return {
      ...state,
      [name]: {
        ...state[name],
        value,
        message,
      },
    };
  }
  return state;
}
