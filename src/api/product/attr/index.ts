import request from "@/utils/request";
import type { CategoryRequestData, AttrRequestData, Attr } from "./type";

enum API {
  C1_URL = '/admin/product/getCategory1',
  C2_URL = '/admin/product/getCategory2/',
  C3_URL = '/admin/product/getCategory3/',
  Attr_URL = '/admin/product/attrInfoList/',
  AddOrUpdateAttr_URL = '/admin/product/saveAttrInfo',
  DELETEATTR_URL = '/admin/product/deleteAttr/',
}

export const reqC1 = () => request.get<any, CategoryRequestData>(API.C1_URL);
export const reqC2 = (catrgory1Id: number | string) => request.get<any, CategoryRequestData>(API.C2_URL + catrgory1Id);
export const reqC3 = (catrgory2Id: number | string) => request.get<any, CategoryRequestData>(API.C3_URL + catrgory2Id);

export const reqAttr = (c1Id: number | string, c2Id: number | string, c3Id: number | string) => request.get<any, AttrRequestData>(API.Attr_URL + `${c1Id}/${c2Id}/${c3Id}`);
export const reqAddOrUpdateAttr = (data: Attr) => request.post<any, any>(API.AddOrUpdateAttr_URL, data)
export const reqRemoveAttr = (attrId: number) => request.delete<any, any>(API.DELETEATTR_URL + attrId)

