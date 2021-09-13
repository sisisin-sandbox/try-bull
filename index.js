const { Worker, Queue, QueueScheduler } = require('bullmq');

const queue = new Queue('queue1', { limiter: {} });
const scheduler = new QueueScheduler('queue1');
const src = [0, 1, 2, 3, 4, 5, 6];

async function main() {
  const start = new Date();
  console.log(format(start));
  const worker = new Worker(
    'queue1',
    async (job) => {
      const d = new Date();
      console.log(job.name, job.data, format(d));
    },
    { limiter: { max: 1, duration: 1000 } },
  );

  for (const v of src) {
    queue.add('foobar', { number: `${v}_1`, queuedAt: format(new Date()) });
    queue.add('foobar', { number: `${v}_2`, queuedAt: format(new Date()) });
    await sleep(1000);
  }

  function sleep(t) {
    return new Promise((done) => {
      setTimeout(() => {
        done();
      }, t);
    });
  }
  function format(d) {
    return `${d.getMinutes()}:${d.getSeconds()}`;
  }
}

main().catch(console.error);
