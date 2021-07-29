class ActionableError extends Error {
  constructor(public errorCode: string, message: string) {
    super(message);
  }
}

export default ActionableError;
