export interface RequestData {
  code: number,
  message: string,
  ok: boolean,
}

export interface CategoryObj {
  id: number | string,
  name: string,
  category1Id: number,
  catrgory2Id: number,
}

export interface CategoryRequestData extends RequestData {
  data: CategoryObj[]
}

export interface AttrValue {
  id?: number,
  valueName: string,
  attrId?: number,
  flag?: boolean
}

export interface Attr {
  id?: number,
  attrName: string,
  categoryId: number | string,
  categoryLevel: number,
  attrValueList: AttrValue[]
}

export interface AttrRequestData extends RequestData {
  data: Attr[]
}