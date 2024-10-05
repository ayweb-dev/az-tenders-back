import EventEmitter from "events";

class MemoryQueue extends EventEmitter {
  constructor() {
    super();
    this.queue = [];
    this.isProcessing = false;
  }

  add(job) {
    this.queue.push(job);
    this.processQueue();
  }

  async processQueue() {
    if (this.isProcessing) return;

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const job = this.queue.shift();
      await this.processJob(job);
    }

    this.isProcessing = false;
  }

  async processJob(job) {
    // Emit an event to process the job
    this.emit("process", job);
  }
}

const emailQueue = new MemoryQueue();

export default emailQueue;
