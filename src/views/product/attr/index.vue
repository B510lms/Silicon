<template>
  <div>
    <Category :scene="scene" />
    <el-card style="margin: 10px 0;">
      <div v-show="scene == 0">
        <el-button type="primary" icon="Plus" :disabled="categoryStore.c3Id ? false : true"
          @click="addAttr">添加属性管理</el-button>
        <el-table border style="margin: 10px 0" :data="attrAttr">
          <el-table-column label="序号" type="index" width="80px" align="center"></el-table-column>
          <el-table-column label="属性名称" width="120px" prop="attrName"></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row }">
              <el-tag style="margin: 5px;" v-for="item in row.attrValueList" :key="item.id">{{ item.valueName
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <template #="{ row }">
              <el-button type="primary" size="small" icon="Edit" @click="updateAttr(row)"></el-button>
              <el-popconfirm :title="`你确定删除${row.attrName}?`" width="200px" @confirm="deleteAttr(row.id)">
                <template #reference>
                  <el-button type="primary" size="small" icon="Delete"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="scene == 1">
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input placeholder="请你输入属性名称" v-model="attrParams.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button @click="addAttrValue" :disabled="attrParams.attrName ? false : true" type="primary"
          icon="Plus">添加属性值</el-button>
        <el-button @click="cancel">取消</el-button>
        <el-table border style="margin: 10px 0;" :data="attrParams.attrValueList">
          <el-table-column label="序号" type="index" width="80px" align="center"></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <el-input :ref="(vc: any) => inputArr[$index] = vc" v-if="row.flag" @blur="toLook(row, $index)"
                size="small" placeholder="请你输入属性值名称" v-model="row.valueName"></el-input>
              <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作">
            <template #="{ index }">
              <el-button type="primary" size="small" icon="Delete"
                @click="attrParams.attrValueList.splice(index, 1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="save"
          :disabled="attrParams.attrValueList.length > 0 ? false : true">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, reactive, nextTick, onBeforeUnmount } from 'vue'
import useCategoryStore from '@/store/modules/category';
import { reqAttr, reqAddOrUpdateAttr, reqRemoveAttr } from '@/api/product/attr';
import type { AttrRequestData, Attr, AttrValue } from '@/api/product/attr/type';
import { ElMessage } from 'element-plus';

let categoryStore = useCategoryStore()
let attrAttr = ref<Attr[]>()
let scene = ref<number>(0)
let attrParams = reactive<Attr>({
  attrName: "",
  categoryId: "",
  categoryLevel: 3,
  attrValueList: []
})
let inputArr = ref<any>([]);

watch(() => categoryStore.c3Id, () => {
  attrAttr.value = []
  if (!categoryStore.c3Id) return
  getAttr()
})

const getAttr = async () => {
  const { c1Id, c2Id, c3Id } = useCategoryStore()
  const result: AttrRequestData = await reqAttr(c1Id, c2Id, c3Id)
  attrAttr.value = result.data
}

const addAttr = () => {
  Object.assign(attrParams, {
    attrName: "",
    categoryId: categoryStore.c3Id,
    categoryLevel: 3,
    attrValueList: []
  })
  scene.value = 1;
}

const updateAttr = (row: Attr) => {
  scene.value = 1;
  // ES6->Object.assign进行对象的合并 一定要是JSON.parse(JSON.stringify(row))深拷贝
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)));
}

const addAttrValue = () => {
  attrParams.attrValueList.push({
    valueName: "",
    flag: true,
  })
  //获取最后el-input组件聚焦
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus();
  })
}

const cancel = () => {
  scene.value = 0;
}

const save = async () => {
  const result: any = await reqAddOrUpdateAttr(attrParams)
  if (result.code == 200) {
    scene.value = 0;
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改成功' : '保存成功'
    })
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: attrParams.id ? '修改失败' : '保存失败'
    })
  }
}

const toLook = (row: AttrValue, $index: number) => {
  //非法情况判断1 删除调用对应属性值为空的元素
  if (row.valueName.trim() == '') {
    attrParams.attrValueList.splice($index, 1);
    ElMessage({
      type: 'error',
      message: '属性值不能为空'
    })
    return;
  }
  //非法情况2 切记把当前失却焦点属性值对象从当前数组扣除判断
  let repeat = attrParams.attrValueList.find((item) => {
    if (item != row) {
      return item.valueName === row.valueName;
    }
  });
  if (repeat) {
    attrParams.attrValueList.splice($index, 1);
    ElMessage({
      type: 'error',
      message: '属性值不能重复'
    })
    return;
  }
  row.flag = false
}

const toEdit = (row: AttrValue, $index: number) => {
  row.flag = true
  nextTick(() => {
    inputArr.value[$index].focus();
  })
}

//删除某一个已有的属性方法回调
const deleteAttr = async (attrId: number) => {
  //发相应的删除已有的属性的请求
  let result: any = await reqRemoveAttr(attrId);
  //删除成功
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    //获取一次已有的属性与属性值
    getAttr();
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败'
    })
  }
}

//路由组件销毁的时候，把仓库分类相关的数据清空
onBeforeUnmount(() => {
  //清空仓库的数据
  categoryStore.$reset();
})
</script>

<style lang="scss" scoped></style>