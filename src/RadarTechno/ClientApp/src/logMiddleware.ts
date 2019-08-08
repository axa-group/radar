/* tslint:disable:no-console */

export default function logMiddleware({ getState }) {
  let logger: any;
  if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
    logger = {log: () => (null)};
  } else {
    logger = console;
  }
  return next => action => {
    logger.log('Prev State:', getState());
    logger.log('Action:', action);
    next(action);
    logger.log('Next State:', getState());
  };
}
