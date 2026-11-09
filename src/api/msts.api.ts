import { grispiAPI } from "@/grispi/client/api";
import { ApiResult } from "@/types/api.type";
import { MstsOrder } from "@/types/msts.type";

const API_BASE_URL =
  process.env.REACT_APP_PROXY_URL || "http://localhost:8080";

/**
 * Lists the orders of a phone number, newest first.
 */
export async function searchOrders(
  phone: string,
  signal?: AbortSignal
): Promise<ApiResult<MstsOrder[]>> {
  const authorization = grispiAPI.authentication.getHeader("Authorization");

  if (!authorization) {
    return {
      statusCode: 401,
      data: { error: { description: "Unauthorized", type: "UNAUTHORIZED" } },
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/orders/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
      body: JSON.stringify({ phone }),
      signal,
    });

    return await response.json();
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw error;
    }

    return {
      statusCode: 500,
      data: {
        error: {
          description: "Horoz sistemine ulaşılamadı.",
          type: "UNKNOWN_ERROR",
        },
      },
    };
  }
}
