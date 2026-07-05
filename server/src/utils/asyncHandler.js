/**
 * Wraps async controller functions so any thrown error or rejected promise
 * is automatically forwarded to Express's error-handling middleware via next().
 *
 * Without this, every controller would need repetitive try/catch blocks.
 *
 * Usage:
 *   export const getEvents = asyncHandler(async (req, res) => { ... });
 */
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
      Promise.resolve(requestHandler(req, res, next)).catch(next);
    };
  };
  
  export default asyncHandler;