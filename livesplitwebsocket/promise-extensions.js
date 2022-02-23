Promise.withTimeout = async function (callback, ms) {
  let resolve, reject;
  const promise = new Promise(async (res, rej) => [resolve, reject] = [res, rej]);

  const timeout = setTimeout(() => reject('Promise timed out'), ms);
  resolve(await callback());
  clearTimeout(timeout);
  return promise;
}