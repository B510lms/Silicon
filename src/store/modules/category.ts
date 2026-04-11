//创建用户相关的小仓库
import { defineStore } from 'pinia'
import type { CategoryState } from './types/type'
import { reqC1, reqC2, reqC3 } from '@/api/product/attr'
import type { CategoryRequestData } from '@/api/product/attr/type'

const useCategoryStore = defineStore('Category', {
  state: (): CategoryState => {
    return {
      c1Arr: [],
      c1Id: '',
      c2Arr: [],
      c2Id: '',
      c3Arr: [],
      c3Id: '',
    }
  },
  actions: {
    async getC1() {
      const result: CategoryRequestData = await reqC1()
      if (result.code == 200) {
        this.c1Arr = result.data
      }
    },
    async getC2() {
      const result: CategoryRequestData = await reqC2(this.c1Id)
      if (result.code == 200) {
        this.c2Arr = result.data
      }
    },
    async getC3() {
      const result: CategoryRequestData = await reqC3(this.c2Id)
      if (result.code == 200) {
        this.c3Arr = result.data
      }
    },
  },
  getters: {

  }
})

export default useCategoryStore