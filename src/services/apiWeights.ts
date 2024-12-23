import axios from "axios";

const API_ROUTE = "http://localhost:3000/api/v1/weight";

export interface WeightFormData {
  userId: string | undefined;
  weight: number;
  recordedAt: string;
}

export async function getWeights(
  userId: string | undefined,
  numberWeight: number | undefined
) {
  const { data: response } = await axios({
    method: "get",
    url: `${API_ROUTE}/${userId}?number=${numberWeight}`,
  });
  return response.weights;
}

export async function postWeight(data: WeightFormData) {
  const { data: response } = await axios({
    method: "post",
    url: `${API_ROUTE}/`,
    data,
  });
  return response.data;
}

export async function updateWeight(args: { weightId: number; weight: number }) {
  const { weightId, weight } = args;

  const { data: response } = await axios({
    method: "patch",
    url: `${API_ROUTE}/${weightId}`,
    data: { weight: weight },
  });
  return response.data;
}
export async function deleteWeight(weightId: number) {
  const { data: response } = await axios({
    method: "delete",
    url: `${API_ROUTE}/${weightId}`,
  });
  return response.data;
}
