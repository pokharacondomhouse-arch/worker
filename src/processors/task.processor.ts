import { getWorkerWasm } from '../wasm';

export interface TaskJobData {
  id: string;
  name: string;
  payload?: {
    a: number;
    b: number;
  };
}

export async function processTaskJob(jobData: TaskJobData): Promise<{ success: boolean; result?: number }> {
  console.log(`[Worker Processor] Processing job ${jobData.id} (${jobData.name})...`);

  // Demonstrate WebAssembly compute in the background worker
  if (jobData.payload) {
    const wasm = await getWorkerWasm();
    const sum = wasm.add(jobData.payload.a, jobData.payload.b);
    console.log(`[Worker Processor] WASM computed: ${jobData.payload.a} + ${jobData.payload.b} = ${sum}`);
    return { success: true, result: sum };
  }

  return { success: true };
}
