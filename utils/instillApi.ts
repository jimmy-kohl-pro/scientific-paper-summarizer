import axios from 'axios';

const token = process.env.INSTILL_API_TOKEN || '';

const user = "jim-k";

export const runPipeline = async (pipelineName: string, inputs: Record<string, any>[]) => {
  const response = await axios.post(
    `https://api.instill.tech/vdp/v1beta/users/${user}/pipelines/${pipelineName}/trigger`,
    {
      inputs
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }
  );
  return response;
}
