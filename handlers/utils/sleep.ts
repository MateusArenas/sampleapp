const sleep = (delay=300) => new Promise(resolve => setTimeout(resolve, delay));

export default sleep;