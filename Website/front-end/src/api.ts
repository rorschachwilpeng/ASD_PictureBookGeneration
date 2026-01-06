import axios from "axios";

export type MVPCreateResponse = {
  request_id: string;
  stored_json_path: string;
  prompt: string | null;
  image_urls: string[];
};

const API_BASE = "http://localhost:8000";

export async function createMvp(config: Record<string, unknown>) {
  const resp = await axios.post<MVPCreateResponse>(`${API_BASE}/api/mvp/create`, {
    config,
  });
  return resp.data;
}


