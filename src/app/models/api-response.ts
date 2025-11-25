import { PaginationMeta } from "./pagination";

export interface ApiResponse<T = any> {
  data: T[];
  pagination: PaginationMeta;
}
